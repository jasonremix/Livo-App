import { useEffect, useImperativeHandle, useRef, useState, type ComponentType, type Ref } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewProps } from 'react-native-webview/lib/WebView';
import type { WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes';

import { buildOcrHtml, createOcrBridge, OCR_ORIGIN, type OcrEngineProps } from '@/lib/ocr-html';

const HTML = buildOcrHtml();

interface WebViewHandle {
  postMessage: (data: string) => void;
}
// Die Typen von react-native-webview deklarieren keinen ref – zur Laufzeit ist er vorhanden.
const RefWebView = WebView as unknown as ComponentType<WebViewProps & { ref?: Ref<WebViewHandle> }>;

/** Unsichtbare WebView, in der die Texterkennung lokal auf dem Gerät läuft. */
export function OcrEngine({ ref, onProgress }: OcrEngineProps) {
  const webRef = useRef<WebViewHandle>(null);
  const [bridge] = useState(createOcrBridge);

  useEffect(() => {
    bridge.setSender((message) => webRef.current?.postMessage(message));
  }, [bridge]);

  useEffect(() => {
    bridge.setProgressListener(onProgress);
  }, [bridge, onProgress]);

  useImperativeHandle(ref, () => ({ recognize: (image) => bridge.recognize(image) }), [bridge]);

  return (
    <RefWebView
      ref={webRef}
      source={{ html: HTML, baseUrl: `${OCR_ORIGIN}/` }}
      originWhitelist={['*']}
      javaScriptEnabled
      domStorageEnabled
      onMessage={(e: WebViewMessageEvent) => bridge.handle(e.nativeEvent.data)}
      style={styles.hidden}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

const styles = StyleSheet.create({
  hidden: { position: 'absolute', width: 1, height: 1, opacity: 0 },
});
