import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { QuestionView } from '@/components/QuestionView';
import { Button, ConfirmDialog, IconButton, ProgressBar, Row, Screen, Txt } from '@/components/ui';
import { QUESTION_BY_ID } from '@/data/questions';
import { EXAM_CONFIG, generateExam, scoreExam } from '@/lib/exam';
import { isAnswered, type UserAnswer } from '@/lib/grading';
import type { ExamRecord } from '@/lib/stats';
import { useLivoStore } from '@/store/useLivoStore';
import { Fonts, MAX_CONTENT_WIDTH, Radius, Space, useTheme } from '@/theme';

const DURATION_SEC = EXAM_CONFIG.durationMinutes * 60;

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Exam() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const [ids] = useState(() => generateExam());
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [overview, setOverview] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const submitted = useRef(false);

  const recordAnswer = useLivoStore((s) => s.recordAnswer);
  const saveExam = useLivoStore((s) => s.saveExam);

  const elapsed = Math.floor((now - startedAt) / 1000);
  const remaining = Math.max(0, DURATION_SEC - elapsed);
  const answeredCount = ids.filter((id) => isAnswered(QUESTION_BY_ID[id], answers[id])).length;

  const submit = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;
    const score = scoreExam(ids, answers);
    for (const d of score.details) {
      if (isAnswered(QUESTION_BY_ID[d.id], answers[d.id])) recordAnswer(d.id, d.correct);
    }
    const record: ExamRecord = {
      id: String(Date.now()),
      finishedAt: Date.now(),
      durationSec: Math.min(DURATION_SEC, Math.floor((Date.now() - startedAt) / 1000)),
      errorPoints: score.errorPoints,
      correctCount: score.correctCount,
      total: score.total,
      passed: score.passed,
      questionIds: ids,
      wrongIds: score.details.filter((d) => !d.correct).map((d) => d.id),
      answers,
    };
    saveExam(record);
    router.replace({ pathname: '/exam-result', params: { id: record.id } });
  }, [answers, ids, recordAnswer, saveExam, startedAt]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (remaining === 0) submit();
  }, [remaining, submit]);

  const question = QUESTION_BY_ID[ids[index]];
  const isFlagged = flagged.includes(question.id);
  const lowTime = remaining < 5 * 60;

  const footer = (
    <View style={[styles.footer, { borderTopColor: c.border, backgroundColor: c.bg, paddingBottom: Space.md + insets.bottom }]}>
      <Row gap={Space.sm} style={styles.footerInner}>
        <Button
          title="Zurück"
          variant="secondary"
          icon="arrow-back"
          onPress={() => setIndex(index - 1)}
          disabled={index === 0}
          style={{ flex: 1 }}
        />
        {index + 1 < ids.length ? (
          <Button title="Weiter" iconRight="arrow-forward" onPress={() => setIndex(index + 1)} style={{ flex: 1 }} />
        ) : (
          <Button title="Abgeben" icon="checkmark-done" onPress={() => setConfirmSubmit(true)} style={{ flex: 1 }} />
        )}
      </Row>
    </View>
  );

  return (
    <Screen edges={['top']} footer={footer}>
      <Row gap={Space.md}>
        <IconButton icon="close" label="Prüfung abbrechen" onPress={() => setConfirmExit(true)} />
        <View
          style={[styles.timer, { backgroundColor: lowTime ? c.dangerSoft : c.surfaceAlt }]}
          accessibilityLabel={`Verbleibende Zeit ${formatTime(remaining)}`}>
          <Ionicons name="time-outline" size={16} color={lowTime ? c.dangerText : c.text} />
          <Txt style={{ fontFamily: Fonts.bodyExtra, fontVariant: ['tabular-nums'] }} color={lowTime ? 'dangerText' : 'text'}>
            {formatTime(remaining)}
          </Txt>
        </View>
        <View style={{ flex: 1 }} />
        <IconButton icon="grid-outline" label="Fragenübersicht" onPress={() => setOverview(true)} />
      </Row>

      <View style={{ marginTop: Space.lg, gap: 6 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt variant="caption" color="textMuted">
            Frage {index + 1} von {ids.length}
          </Txt>
          <Txt variant="caption" color="textMuted">
            {answeredCount} beantwortet
          </Txt>
        </Row>
        <ProgressBar value={answeredCount / ids.length} color={c.teal} />
      </View>

      <View style={{ marginTop: Space.xl }}>
        <QuestionView
          key={question.id}
          question={question}
          answer={answers[question.id]}
          onChange={(a) => setAnswers((prev) => ({ ...prev, [question.id]: a }))}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isFlagged }}
        onPress={() =>
          setFlagged((f) => (f.includes(question.id) ? f.filter((x) => x !== question.id) : [...f, question.id]))
        }
        style={[styles.flag, { borderColor: isFlagged ? c.teal : c.border }]}>
        <Ionicons name={isFlagged ? 'flag' : 'flag-outline'} size={18} color={isFlagged ? c.tealText : c.textMuted} />
        <Txt variant="small" color={isFlagged ? 'tealText' : 'textMuted'}>
          {isFlagged ? 'Zum späteren Ansehen markiert' : 'Später nochmal ansehen'}
        </Txt>
      </Pressable>

      <Modal visible={overview} animationType="slide" transparent onRequestClose={() => setOverview(false)}>
        <View style={[styles.sheetBackdrop, { backgroundColor: c.overlay }]}>
          <SafeAreaView edges={['bottom']} style={[styles.sheet, { backgroundColor: c.bg }]}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Txt variant="h2">Übersicht</Txt>
              <IconButton icon="close" label="Übersicht schließen" onPress={() => setOverview(false)} />
            </Row>
            <Row gap={Space.lg} style={{ marginTop: Space.sm, flexWrap: 'wrap' }}>
              <Legend color={c.text} label="beantwortet" filled />
              <Legend color={c.border} label="offen" />
              <Legend color={c.teal} label="markiert" />
            </Row>
            <View style={styles.grid}>
              {ids.map((id, i) => {
                const done = isAnswered(QUESTION_BY_ID[id], answers[id]);
                const flag = flagged.includes(id);
                return (
                  <Pressable
                    key={id}
                    accessibilityRole="button"
                    accessibilityLabel={`Frage ${i + 1}${done ? ', beantwortet' : ''}${flag ? ', markiert' : ''}`}
                    onPress={() => {
                      setIndex(i);
                      setOverview(false);
                    }}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: done ? c.text : c.surface,
                        borderColor: flag ? c.teal : i === index ? c.primary : c.border,
                        borderWidth: flag || i === index ? 2.5 : 1,
                      },
                    ]}>
                    <Txt variant="bodyStrong" style={{ color: done ? c.bg : c.text }}>
                      {i + 1}
                    </Txt>
                  </Pressable>
                );
              })}
            </View>
            <Button
              title={`Prüfung abgeben (${answeredCount}/${ids.length})`}
              icon="checkmark-done"
              onPress={() => {
                setOverview(false);
                setConfirmSubmit(true);
              }}
              style={{ marginTop: Space.lg }}
            />
          </SafeAreaView>
        </View>
      </Modal>

      <ConfirmDialog
        visible={confirmSubmit}
        title="Prüfung abgeben?"
        message={
          answeredCount < ids.length
            ? `Du hast ${ids.length - answeredCount} Fragen noch nicht beantwortet. Sie zählen als Fehler.`
            : 'Alle Fragen sind beantwortet. Danach siehst du dein Ergebnis.'
        }
        confirmLabel="Jetzt abgeben"
        onConfirm={() => {
          setConfirmSubmit(false);
          submit();
        }}
        onCancel={() => setConfirmSubmit(false)}
      />
      <ConfirmDialog
        visible={confirmExit}
        title="Prüfung abbrechen?"
        message="Dein Fortschritt in dieser Simulation geht verloren."
        confirmLabel="Abbrechen"
        cancelLabel="Weitermachen"
        destructive
        onConfirm={() => {
          setConfirmExit(false);
          submitted.current = true;
          if (router.canGoBack()) router.back();
          else router.replace('/pruefung');
        }}
        onCancel={() => setConfirmExit(false)}
      />
    </Screen>
  );
}

function Legend({ color, label, filled }: { color: string; label: string; filled?: boolean }) {
  return (
    <Row gap={6}>
      <View style={{ width: 14, height: 14, borderRadius: 4, borderWidth: 2, borderColor: color, backgroundColor: filled ? color : 'transparent' }} />
      <Txt variant="caption" color="textMuted">
        {label}
      </Txt>
    </Row>
  );
}

const styles = StyleSheet.create({
  footer: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: Space.md, paddingHorizontal: Space.lg, alignItems: 'center' },
  footerInner: { width: '100%', maxWidth: MAX_CONTENT_WIDTH - Space.lg * 2 },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill },
  flag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    alignSelf: 'flex-start',
    marginTop: Space.xl,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sheetBackdrop: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  sheet: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Space.xl,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm, marginTop: Space.lg },
  cell: { width: 48, height: 48, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
});
