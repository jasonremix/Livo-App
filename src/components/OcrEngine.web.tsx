import { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { buildOcrHtml, createOcrBridge, type OcrEngineProps } from '@/lib/ocr-html';

const HTML = buildOcrHtml();

/** Web-Variante: unsichtbares iframe, in dem die Texterkennung im Browser läuft. */
export function OcrEngine({ ref, onProgress }: OcrEngineProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [bridge] = useState(createOcrBridge);

  useEffect(() => {
    bridge.setSender((message) => frameRef.current?.contentWindow?.postMessage(message, '*'));
  }, [bridge]);

  useEffect(() => {
    bridge.setProgressListener(onProgress);
  }, [bridge, onProgress]);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (e.source === frameRef.current?.contentWindow && typeof e.data === 'string') bridge.handle(e.data);
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [bridge]);

  useImperativeHandle(ref, () => ({ recognize: (image) => bridge.recognize(image) }), [bridge]);

  return <iframe ref={frameRef} srcDoc={HTML} title="Texterkennung" aria-hidden style={{ display: 'none' }} />;
}
