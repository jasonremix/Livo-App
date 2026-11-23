import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { OcrEngine } from '@/components/OcrEngine';
import { BetaBadge, Button, Card, Chip, Divider, IconButton, ProgressBar, Row, Screen, Txt } from '@/components/ui';
import { LICENSE_CLASSES } from '@/data/license-classes';
import { daysBetween, formatDate, parseDayKey } from '@/lib/dates';
import { maskNumber, parseLicenseText, type LicenseScan } from '@/lib/license';
import { sendToLivia } from '@/lib/livia-chat';
import { LIVIA_AI_ENABLED } from '@/lib/livia-client';
import type { OcrHandle } from '@/lib/ocr-html';
import { Fonts, Radius, Space, useTheme } from '@/theme';

type Mode = 'license' | 'card';
type Phase = 'idle' | 'working' | 'done' | 'error';

const MAX_WIDTH = 1600;

export default function ScannerScreen() {
  const { c } = useTheme();
  const ocr = useRef<OcrHandle>(null);
  const [mode, setMode] = useState<Mode>('license');
  const [phase, setPhase] = useState<Phase>('idle');
  const [photo, setPhoto] = useState<string | null>(null);
  const [status, setStatus] = useState({ label: '', progress: 0 });
  const [text, setText] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showNumber, setShowNumber] = useState(false);
  const [copied, setCopied] = useState(false);

  const onProgress = useCallback((label: string, progress: number) => setStatus({ label, progress }), []);

  const scan = async (source: 'camera' | 'library') => {
    setError(null);
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError(
        source === 'camera'
          ? 'Ohne Kamerazugriff kann Livo kein Foto aufnehmen. Du kannst ihn in den Einstellungen erlauben.'
          : 'Ohne Zugriff auf deine Fotos kann Livo kein Bild auswählen.',
      );
      setPhase('error');
      return;
    }
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 1 };
    const picked =
      source === 'camera' ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    if (picked.canceled || !picked.assets[0]) return;
    const asset = picked.assets[0];

    setPhase('working');
    setStatus({ label: 'Bild wird vorbereitet …', progress: 0 });
    setText('');
    setShowNumber(false);
    setCopied(false);
    try {
      // Verkleinern beschleunigt die Erkennung deutlich, ohne an Lesbarkeit zu verlieren
      const context = ImageManipulator.manipulate(asset.uri);
      if (asset.width > MAX_WIDTH) context.resize({ width: MAX_WIDTH });
      const rendered = await context.renderAsync();
      const saved = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.85, base64: true });
      const dataUrl = `data:image/jpeg;base64,${saved.base64}`;
      setPhoto(saved.uri);
      const result = await ocr.current!.recognize(dataUrl);
      setText(result.text.trim());
      setConfidence(result.confidence);
      setPhase('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Die Texterkennung ist fehlgeschlagen.');
      setPhase('error');
    }
  };

  const reset = () => {
    setPhase('idle');
    setPhoto(null);
    setText('');
    setError(null);
  };

  const license = mode === 'license' && phase === 'done' ? parseLicenseText(text) : null;

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: 'Scanner', headerTitle: '' }} />
      <OcrEngine ref={ocr} onProgress={onProgress} />

      <Row gap={Space.sm} style={{ marginTop: Space.sm }}>
        <Txt variant="h1">Livo Scanner</Txt>
        <BetaBadge />
      </Row>
      <Txt color="textMuted" style={{ marginTop: 4 }}>
        Führerschein, Lernkarte oder Dokument fotografieren – der Text wird direkt auf deinem Gerät erkannt.
      </Txt>

      <Row gap={Space.sm} style={{ marginTop: Space.lg }}>
        <Chip label="Führerschein" icon="card-outline" selected={mode === 'license'} onPress={() => setMode('license')} />
        <Chip label="Lernkarte & Dokument" icon="document-text-outline" selected={mode === 'card'} onPress={() => setMode('card')} />
      </Row>

      <Card tone="teal" style={{ marginTop: Space.lg }}>
        <Row gap={Space.sm} style={{ alignItems: 'flex-start' }}>
          <Ionicons name="lock-closed-outline" size={18} color={c.tealText} style={{ marginTop: 2 }} />
          <Txt variant="small" style={{ flex: 1 }}>
            Dein Foto bleibt auf diesem Gerät und wird weder hochgeladen noch an eine KI geschickt. Beim ersten Scan
            lädt Livo einmalig die Texterkennung (ca. 6 MB).
          </Txt>
        </Row>
      </Card>

      {phase === 'idle' || phase === 'error' ? (
        <View style={{ gap: Space.sm, marginTop: Space.xl }}>
          <Button title="Foto aufnehmen" icon="camera-outline" onPress={() => scan('camera')} />
          <Button title="Foto auswählen" icon="images-outline" variant="secondary" onPress={() => scan('library')} />
          {mode === 'license' && (
            <Txt variant="caption" color="textMuted" style={{ textAlign: 'center', marginTop: Space.sm }}>
              Tipp: Vorderseite gerade von oben fotografieren, gutes Licht, keine Spiegelungen.
            </Txt>
          )}
        </View>
      ) : null}

      {phase === 'error' && error && (
        <Card style={{ marginTop: Space.lg, borderColor: c.danger }}>
          <Txt variant="bodyStrong" color="dangerText">
            Das hat nicht geklappt
          </Txt>
          <Txt variant="small" style={{ marginTop: 4 }}>
            {error}
          </Txt>
        </Card>
      )}

      {phase === 'working' && (
        <Card style={{ marginTop: Space.xl, gap: Space.md }}>
          {photo && <Image source={{ uri: photo }} style={styles.preview} contentFit="contain" />}
          <Txt variant="bodyStrong">{status.label || 'Bitte kurz warten …'}</Txt>
          <ProgressBar value={status.progress} color={c.teal} />
        </Card>
      )}

      {phase === 'done' && (
        <View style={{ gap: Space.md, marginTop: Space.xl }}>
          {photo && <Image source={{ uri: photo }} style={styles.preview} contentFit="contain" accessibilityLabel="Gescanntes Foto" />}

          {license ? (
            <LicenseResult
              scan={license}
              showNumber={showNumber}
              onToggleNumber={() => setShowNumber((v) => !v)}
              rawText={text}
            />
          ) : (
            <Card style={{ gap: Space.sm }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Txt variant="h3">Erkannter Text</Txt>
                <Txt variant="caption" color="textMuted">
                  Sicherheit {Math.round(confidence)} %
                </Txt>
              </Row>
              <TextInput
                value={text}
                onChangeText={setText}
                multiline
                accessibilityLabel="Erkannter Text"
                placeholder="Kein Text erkannt"
                placeholderTextColor={c.textMuted}
                style={[styles.textBox, { color: c.text, backgroundColor: c.surfaceAlt }]}
              />
              <Row gap={Space.sm} style={{ flexWrap: 'wrap' }}>
                <Button
                  title={copied ? 'Kopiert' : 'Text kopieren'}
                  icon={copied ? 'checkmark' : 'copy-outline'}
                  variant="secondary"
                  small
                  disabled={!text}
                  onPress={async () => {
                    await Clipboard.setStringAsync(text);
                    setCopied(true);
                  }}
                />
                <Button
                  title="Livia erklären lassen"
                  icon="chatbubble-ellipses-outline"
                  variant="teal"
                  small
                  disabled={!text}
                  onPress={() => {
                    sendToLivia(text.slice(0, 500));
                    router.push('/livia');
                  }}
                />
              </Row>
              <Txt variant="caption" color="textMuted">
                {LIVIA_AI_ENABLED
                  ? '„Livia erklären lassen“ sendet nur den erkannten Text an Livia – nicht das Foto.'
                  : 'Livia sucht in ihrer Wissensbasis auf dem Gerät nach der passenden Erklärung.'}
              </Txt>
            </Card>
          )}

          <Button title="Neuer Scan" icon="refresh" variant="secondary" onPress={reset} />
        </View>
      )}

      <Txt variant="caption" color="textMuted" style={{ textAlign: 'center', marginTop: Space.xl }}>
        Ein Scan ist kein amtlicher Nachweis und kein digitaler Führerschein. Es wird nichts gespeichert.
      </Txt>
    </Screen>
  );
}

function LicenseResult({
  scan,
  showNumber,
  onToggleNumber,
  rawText,
}: {
  scan: LicenseScan;
  showNumber: boolean;
  onToggleNumber: () => void;
  rawText: string;
}) {
  const { c } = useTheme();
  const [showRaw, setShowRaw] = useState(false);
  const name = [scan.givenNames, scan.surname].filter(Boolean).join(' ');
  const daysLeft = scan.expires ? daysBetween(new Date(), parseDayKey(scan.expires)) : null;
  const nothing = !name && !scan.expires && !scan.number && scan.classes.length === 0;

  return (
    <Card style={{ gap: Space.md }}>
      <Txt variant="h3">Erkannte Daten</Txt>
      {nothing ? (
        <Txt variant="small" color="textMuted">
          Livo konnte keine Führerscheinfelder erkennen. Fotografiere die Vorderseite möglichst gerade, scharf und ohne
          Spiegelungen – oder wähle „Lernkarte & Dokument“, um den reinen Text zu sehen.
        </Txt>
      ) : (
        <>
          {name ? <Field label="Name" value={name} /> : null}
          {scan.expires ? (
            <Field
              label="Gültig bis (4b)"
              value={formatDate(scan.expires)}
              note={
                daysLeft === null
                  ? undefined
                  : daysLeft < 0
                    ? 'Abgelaufen – bitte rechtzeitig umtauschen.'
                    : `Noch ${Math.floor(daysLeft / 365)} Jahre und ${daysLeft % 365} Tage`
              }
              warn={daysLeft !== null && daysLeft < 180}
            />
          ) : null}
          {scan.number ? (
            <Row style={{ justifyContent: 'space-between' }}>
              <Field label="Führerscheinnummer (5)" value={showNumber ? scan.number : maskNumber(scan.number)} />
              <IconButton
                icon={showNumber ? 'eye-off-outline' : 'eye-outline'}
                label={showNumber ? 'Nummer verbergen' : 'Nummer anzeigen'}
                onPress={onToggleNumber}
              />
            </Row>
          ) : null}
          {scan.authority ? <Field label="Behörde (4c)" value={scan.authority} /> : null}
        </>
      )}

      {scan.classes.length > 0 && (
        <>
          <Divider />
          <Txt variant="label" color="textMuted">
            Klassen (9)
          </Txt>
          <View style={{ gap: Space.sm }}>
            {scan.classes.map((cls) => (
              <Row key={cls} gap={Space.md} style={{ alignItems: 'flex-start' }}>
                <View style={[styles.classPill, { backgroundColor: c.primarySoft }]}>
                  <Txt style={{ fontFamily: Fonts.bodyExtra, color: c.primary }}>{cls}</Txt>
                </View>
                <Txt variant="small" style={{ flex: 1 }}>
                  {LICENSE_CLASSES[cls]}
                </Txt>
              </Row>
            ))}
          </View>
        </>
      )}

      <Button
        title={showRaw ? 'Erkannten Text ausblenden' : 'Erkannten Text anzeigen'}
        variant="ghost"
        small
        onPress={() => setShowRaw((v) => !v)}
      />
      {showRaw && (
        <Txt variant="small" selectable style={[styles.raw, { backgroundColor: c.surfaceAlt }]}>
          {rawText || '–'}
        </Txt>
      )}
    </Card>
  );
}

function Field({ label, value, note, warn }: { label: string; value: string; note?: string; warn?: boolean }) {
  return (
    <View style={{ gap: 2 }}>
      <Txt variant="caption" color="textMuted">
        {label}
      </Txt>
      <Txt variant="bodyStrong">{value}</Txt>
      {note ? (
        <Txt variant="caption" color={warn ? 'dangerText' : 'successText'}>
          {note}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { width: '100%', height: 180, borderRadius: Radius.md },
  textBox: {
    fontFamily: Fonts.body,
    fontSize: 15,
    minHeight: 140,
    borderRadius: Radius.md,
    padding: Space.md,
    textAlignVertical: 'top',
  },
  classPill: { minWidth: 48, paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.sm, alignItems: 'center' },
  raw: { padding: Space.md, borderRadius: Radius.md },
});
