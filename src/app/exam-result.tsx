import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, EmptyState, Row, Screen, Txt } from '@/components/ui';
import { QUESTION_BY_ID } from '@/data/questions';
import type { Question } from '@/data/types';
import { EXAM_CONFIG, failReason } from '@/lib/exam';
import { formatSolution, type UserAnswer } from '@/lib/grading';
import { useLivoStore } from '@/store/useLivoStore';
import { Fonts, Radius, Space, useTheme } from '@/theme';

function describeAnswer(q: Question, a: UserAnswer | undefined): string {
  if (!a) return 'nicht beantwortet';
  if (q.type === 'number') return a.value ? `${a.value} ${q.unit}`.trim() : 'nicht beantwortet';
  const picked = q.options.filter((o) => a.selected?.includes(o.id)).map((o) => o.text);
  return picked.length ? picked.join(' · ') : 'nicht beantwortet';
}

export default function ExamResult() {
  const { c } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const exam = useLivoStore((s) => s.exams.find((e) => e.id === id));
  const [open, setOpen] = useState<string | null>(null);

  if (!exam) {
    return (
      <Screen edges={[]}>
        <EmptyState
          icon="document-outline"
          title="Ergebnis nicht gefunden"
          text="Diese Prüfung ist nicht mehr gespeichert."
          action={<Button title="Zur Prüfung" onPress={() => router.replace('/pruefung')} />}
        />
      </Screen>
    );
  }

  const fivesWrong = exam.wrongIds.filter((w) => QUESTION_BY_ID[w]?.points === 5).length;
  const reason = exam.passed ? null : failReason(exam.errorPoints, fivesWrong);
  const minutes = Math.floor(exam.durationSec / 60);
  const seconds = exam.durationSec % 60;

  return (
    <Screen edges={[]}>
      <View style={[styles.hero, { backgroundColor: exam.passed ? c.successSoft : c.dangerSoft }]}>
        <Ionicons
          name={exam.passed ? 'checkmark-circle' : 'close-circle'}
          size={56}
          color={exam.passed ? c.success : c.danger}
        />
        <Txt variant="display" color={exam.passed ? 'successText' : 'dangerText'} style={{ textAlign: 'center' }}>
          {exam.passed ? 'Bestanden!' : 'Nicht bestanden'}
        </Txt>
        <Txt color={exam.passed ? 'successText' : 'dangerText'} style={{ textAlign: 'center' }}>
          {exam.errorPoints} Fehlerpunkte (erlaubt: {EXAM_CONFIG.maxErrorPoints})
          {reason ? `\n${reason}` : ''}
        </Txt>
      </View>

      <Row gap={Space.md} style={{ marginTop: Space.md }}>
        <Stat label="Richtig" value={`${exam.correctCount}/${exam.total}`} />
        <Stat label="Fehlerpunkte" value={String(exam.errorPoints)} />
        <Stat label="Zeit" value={`${minutes}:${String(seconds).padStart(2, '0')}`} />
      </Row>

      <View style={{ gap: Space.sm, marginTop: Space.xl }}>
        {exam.wrongIds.length > 0 && (
          <Button
            title="Fehler direkt üben"
            icon="refresh"
            onPress={() => router.push({ pathname: '/quiz', params: { mode: 'ids', id: exam.wrongIds.join(',') } })}
          />
        )}
        <Button
          title="Neue Simulation"
          variant={exam.wrongIds.length ? 'secondary' : 'primary'}
          icon="ribbon-outline"
          onPress={() => router.replace('/exam')}
        />
      </View>

      {exam.wrongIds.length > 0 ? (
        <>
          <Txt variant="h2" style={{ marginTop: Space.xl, marginBottom: Space.md }}>
            Falsch beantwortet ({exam.wrongIds.length})
          </Txt>
          <View style={{ gap: Space.sm }}>
            {exam.wrongIds.map((qid) => {
              const q = QUESTION_BY_ID[qid];
              if (!q) return null;
              const expanded = open === qid;
              return (
                <Card key={qid}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    onPress={() => setOpen(expanded ? null : qid)}>
                    <Row style={{ alignItems: 'flex-start' }} gap={Space.sm}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <Txt variant="caption" color="textMuted">
                          {q.points} Fehlerpunkte
                        </Txt>
                        <Txt variant="bodyStrong">{q.text}</Txt>
                      </View>
                      <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={c.textMuted} />
                    </Row>
                  </Pressable>
                  {expanded && (
                    <View style={{ gap: Space.sm, marginTop: Space.md }}>
                      <Txt variant="small" color="dangerText">
                        Deine Antwort: {describeAnswer(q, exam.answers?.[qid])}
                      </Txt>
                      <Txt variant="small" color="successText">
                        Richtig: {formatSolution(q)}
                      </Txt>
                      <Txt variant="small">{q.explanation}</Txt>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        </>
      ) : (
        <Card tone="teal" style={{ marginTop: Space.xl }}>
          <Txt variant="bodyStrong" color="tealText">
            Alles richtig – fehlerfrei bestanden!
          </Txt>
          <Txt variant="small" style={{ marginTop: 4 }}>
            Wiederhole die Simulation ein paar Mal, damit du am Prüfungstag ganz entspannt bist.
          </Txt>
        </Card>
      )}
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ flex: 1, alignItems: 'center', paddingVertical: Space.md }}>
      <Txt style={{ fontFamily: Fonts.display, fontSize: 20 }}>{value}</Txt>
      <Txt variant="caption" color="textMuted">
        {label}
      </Txt>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: Space.sm, padding: Space.xl, borderRadius: Radius.xl, marginTop: Space.sm },
});
