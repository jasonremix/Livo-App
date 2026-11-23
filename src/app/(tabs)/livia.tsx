import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type ScrollViewInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Chip, ConfirmDialog, IconButton, Row, Txt } from '@/components/ui';
import { QUESTION_BY_ID } from '@/data/questions';
import { dayKey } from '@/lib/dates';
import { sendToLivia } from '@/lib/livia-chat';
import { FREE_LIVIA_MESSAGES_PER_DAY, LIVIA_AI_ENABLED, type ChatMessage } from '@/lib/livia-client';
import { useLivoStore } from '@/store/useLivoStore';
import { Fonts, MAX_CONTENT_WIDTH, Radius, Space, useTheme } from '@/theme';

const SUGGESTIONS = [
  'Wie berechne ich den Anhalteweg?',
  'Wer hat im Kreisverkehr Vorfahrt?',
  'Wie viel Alkohol darf ich in der Probezeit trinken?',
  'Wann darf ich die Nebelschlussleuchte benutzen?',
  'Wie bilde ich eine Rettungsgasse?',
];

export default function Livia() {
  const { c } = useTheme();
  const chat = useLivoStore((s) => s.chat);
  const busy = useLivoStore((s) => s.liviaBusy);
  const clearChat = useLivoStore((s) => s.clearChat);
  const isPlus = useLivoStore((s) => s.isPlus);
  const usage = useLivoStore((s) => s.liviaUsage);
  const [input, setInput] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const scrollRef = useRef<ScrollViewInstance>(null);

  const limitReached =
    LIVIA_AI_ENABLED && !isPlus && usage.day === dayKey() && usage.count >= FREE_LIVIA_MESSAGES_PER_DAY;

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    setInput('');
    sendToLivia(text);
  };

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(t);
  }, [chat.length, busy]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { borderBottomColor: c.border }]}>
          <Row gap={Space.md} style={styles.column}>
            <Avatar size={44} />
            <View style={{ flex: 1 }}>
              <Txt variant="h2">Livia</Txt>
              <Txt variant="caption" color="textMuted">
                {LIVIA_AI_ENABLED ? 'Deine KI-Tutorin für die Theorieprüfung' : 'Erklärt Regeln aus der Livo-Wissensbasis'}
              </Txt>
            </View>
            {chat.length > 0 && <IconButton icon="trash-outline" label="Verlauf löschen" onPress={() => setConfirmClear(true)} />}
          </Row>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={[styles.column, { gap: Space.md }]}>
            {chat.length === 0 && (
              <View style={{ alignItems: 'center', gap: Space.md, paddingVertical: Space.xl }}>
                <Avatar size={88} />
                <Txt variant="h2" style={{ textAlign: 'center' }}>
                  Hi, ich bin Livia!
                </Txt>
                <Txt color="textMuted" style={{ textAlign: 'center', maxWidth: 380 }}>
                  Frag mich alles zu Verkehrsregeln, Schildern und der Theorieprüfung. Ich erkläre es dir verständlich.
                </Txt>
                <View style={styles.suggestions}>
                  {SUGGESTIONS.map((s) => (
                    <Chip key={s} label={s} onPress={() => send(s)} />
                  ))}
                </View>
              </View>
            )}

            {chat.map((m) => (
              <Bubble key={m.id} message={m} />
            ))}

            {busy && (
              <Row gap={Space.sm}>
                <Avatar size={28} />
                <View style={[styles.bubble, { backgroundColor: c.surfaceAlt }]}>
                  <ActivityIndicator color={c.textMuted} accessibilityLabel="Livia schreibt" />
                </View>
              </Row>
            )}

            {limitReached && <Button title="Livo Plus ansehen" icon="sparkles" onPress={() => router.push('/plus')} />}
          </View>
        </ScrollView>

        <View style={[styles.inputBar, { borderTopColor: c.border, backgroundColor: c.bg }]}>
          <Row gap={Space.sm} style={styles.column}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Frag Livia …"
              placeholderTextColor={c.textMuted}
              multiline
              maxLength={500}
              accessibilityLabel="Nachricht an Livia"
              onSubmitEditing={() => send(input)}
              submitBehavior="submit"
              style={[styles.input, { color: c.text, backgroundColor: c.surfaceAlt }]}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Senden"
              disabled={!input.trim() || busy}
              onPress={() => send(input)}
              style={[styles.send, { backgroundColor: input.trim() && !busy ? c.primary : c.surfaceAlt }]}>
              <Ionicons name="arrow-up" size={22} color={input.trim() && !busy ? c.onPrimary : c.textMuted} />
            </Pressable>
          </Row>
        </View>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={confirmClear}
        title="Verlauf löschen?"
        message="Alle Nachrichten mit Livia werden entfernt."
        confirmLabel="Löschen"
        destructive
        onConfirm={() => {
          clearChat();
          setConfirmClear(false);
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </SafeAreaView>
  );
}

function Avatar({ size }: { size: number }) {
  const { c } = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: c.tealSoft,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('@/assets/brand/livo-logo.png')}
        style={{ width: size * 0.55, height: size * 0.66 }}
        contentFit="contain"
        accessibilityLabel="Livia"
      />
    </View>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const { c } = useTheme();
  if (message.role === 'user') {
    return (
      <View style={[styles.bubble, styles.mine, { backgroundColor: c.primary }]}>
        <Txt style={{ color: c.onPrimary }}>{message.text}</Txt>
      </View>
    );
  }
  const related = (message.related ?? []).filter((id) => QUESTION_BY_ID[id]);
  return (
    <Row gap={Space.sm} style={{ alignItems: 'flex-end' }}>
      <Avatar size={28} />
      <View style={{ flex: 1, gap: Space.sm, alignItems: 'flex-start' }}>
        <View style={[styles.bubble, { backgroundColor: c.surfaceAlt }]}>
          <Txt selectable>{message.text}</Txt>
        </View>
        {related.length > 0 && (
          <Button
            title={related.length === 1 ? 'Passende Frage üben' : `${related.length} passende Fragen üben`}
            variant="teal"
            small
            icon="school-outline"
            onPress={() => router.push({ pathname: '/quiz', params: { mode: 'ids', id: related.join(',') } })}
          />
        )}
      </View>
    </Row>
  );
}

const styles = StyleSheet.create({
  column: { width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' },
  header: { paddingHorizontal: Space.lg, paddingVertical: Space.md, borderBottomWidth: StyleSheet.hairlineWidth },
  scroll: { padding: Space.lg, paddingBottom: Space.xl, flexGrow: 1 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm, justifyContent: 'center', marginTop: Space.sm },
  bubble: { maxWidth: '88%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.lg },
  mine: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  inputBar: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: Space.lg, paddingVertical: Space.sm },
  input: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 16,
    maxHeight: 120,
    minHeight: 46,
    borderRadius: 23,
    paddingHorizontal: Space.lg,
    paddingTop: 12,
    paddingBottom: 12,
  },
  send: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
});
