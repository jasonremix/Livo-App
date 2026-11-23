/**
 * Kleine HTML-Seite, die Texterkennung mit tesseract.js ausführt – direkt auf dem Gerät
 * (in einer WebView bzw. im Browser-iframe). Das Foto verlässt das Gerät nicht; aus dem
 * Internet geladen wird nur die Erkennungs-Software samt deutschem Sprachpaket (einmalig, danach im Cache).
 */
import type { Ref } from 'react';

export const OCR_ORIGIN = 'https://cdn.jsdelivr.net';
export const OCR_CDN = `${OCR_ORIGIN}/npm`;
export const TESSERACT_VERSION = '7.0.0';

export type OcrMessage =
  | { type: 'ready' }
  | { type: 'progress'; status: string; progress: number }
  | { type: 'result'; id: string; text: string; confidence: number }
  | { type: 'error'; id?: string; message: string };

export function buildOcrHtml(cdn: string = OCR_CDN): string {
  const v = TESSERACT_VERSION;
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body>
<script src="${cdn}/tesseract.js@${v}/dist/tesseract.min.js"></script>
<script>
(function () {
  var CDN = ${JSON.stringify(cdn)};
  var workerPromise = null;
  function post(msg) {
    var s = JSON.stringify(msg);
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(s);
    else if (window.parent && window.parent !== window) window.parent.postMessage(s, '*');
  }
  function getWorker() {
    if (!workerPromise) {
      workerPromise = Tesseract.createWorker('deu', 1, {
        workerPath: CDN + '/tesseract.js@${v}/dist/worker.min.js',
        corePath: CDN + '/tesseract.js-core@${v}',
        langPath: CDN + '/@tesseract.js-data/deu/4.0.0_best_int',
        logger: function (m) { post({ type: 'progress', status: m.status, progress: m.progress || 0 }); }
      });
      workerPromise.catch(function () { workerPromise = null; });
    }
    return workerPromise;
  }
  async function handle(raw) {
    var msg;
    try { msg = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { return; }
    if (!msg || msg.type !== 'recognize') return;
    try {
      var worker = await getWorker();
      var res = await worker.recognize(msg.image);
      post({ type: 'result', id: msg.id, text: res.data.text || '', confidence: res.data.confidence || 0 });
    } catch (e) {
      post({ type: 'error', id: msg.id, message: String((e && e.message) || e) });
    }
  }
  window.addEventListener('message', function (e) { handle(e.data); });
  document.addEventListener('message', function (e) { handle(e.data); });
  if (typeof Tesseract === 'undefined') {
    post({ type: 'error', message: 'Die Texterkennung konnte nicht geladen werden. Bist du online?' });
  } else {
    post({ type: 'ready' });
  }
})();
</script>
</body></html>`;
}

/** Verständlicher Statustext zu den Fortschrittsmeldungen von tesseract.js. */
export function ocrStatusLabel(status: string): string {
  if (status.includes('loading tesseract core') || status.includes('loading language')) return 'Texterkennung wird geladen …';
  if (status.includes('initializ')) return 'Texterkennung wird vorbereitet …';
  if (status.includes('recognizing')) return 'Text wird erkannt …';
  return 'Bitte kurz warten …';
}

export interface OcrResult {
  text: string;
  confidence: number;
}

export interface OcrHandle {
  recognize: (imageDataUrl: string) => Promise<OcrResult>;
}

export interface OcrEngineProps {
  ref?: Ref<OcrHandle>;
  onProgress?: (label: string, progress: number) => void;
}

/**
 * Verbindet die Screens mit der OCR-Seite: Anfragen werden gepuffert, bis die Seite bereit ist,
 * und Antworten über ihre ID der richtigen Anfrage zugeordnet.
 */
export function createOcrBridge() {
  let send: ((message: string) => void) | undefined;
  let ready = false;
  let loadError: string | null = null;
  let onProgress: ((label: string, progress: number) => void) | undefined;
  const queue: string[] = [];
  const pending = new Map<string, { resolve: (r: OcrResult) => void; reject: (e: Error) => void }>();
  let counter = 0;

  const flush = () => {
    if (ready && send) queue.splice(0).forEach(send);
  };

  return {
    /** Wird gesetzt, sobald die WebView bzw. das iframe existiert. */
    setSender(sender: (message: string) => void) {
      send = sender;
      flush();
    },
    setProgressListener(listener: typeof onProgress) {
      onProgress = listener;
    },
    handle(raw: string) {
      let msg: OcrMessage;
      try {
        msg = JSON.parse(raw) as OcrMessage;
      } catch {
        return;
      }
      if (msg.type === 'ready') {
        ready = true;
        flush();
      } else if (msg.type === 'progress') {
        onProgress?.(ocrStatusLabel(msg.status), msg.progress);
      } else if (msg.type === 'result') {
        pending.get(msg.id)?.resolve({ text: msg.text, confidence: msg.confidence });
        pending.delete(msg.id);
      } else if (msg.type === 'error') {
        const error = new Error(msg.message);
        if (msg.id) {
          pending.get(msg.id)?.reject(error);
          pending.delete(msg.id);
        } else {
          loadError = msg.message;
          pending.forEach((p) => p.reject(error));
          pending.clear();
          queue.length = 0;
        }
      }
    },
    recognize(image: string): Promise<OcrResult> {
      if (loadError) return Promise.reject(new Error(loadError));
      const id = `ocr-${Date.now()}-${counter++}`;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        const message = JSON.stringify({ type: 'recognize', id, image });
        queue.push(message);
        flush();
      });
    },
  };
}
