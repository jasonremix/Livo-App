import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Badge, Button, Card, Divider, EmptyState, ListRow, Row, Screen, SectionHeader, Txt, type IconName } from '@/components/ui';
import { EXAM_CONFIG, EXAM_SIZE } from '@/lib/exam';
import { useLivoStore } from '@/store/useLivoStore';
import { Space, useTheme } from '@/theme';

const RULES: { icon: IconName; text: string }[] = [
  { icon: 'list-outline', text: `${EXAM_SIZE} Fragen: ${EXAM_CONFIG.basicQuestions} Grundstoff + ${EXAM_CONFIG.classQuestions} Zusatzstoff Klasse B` },
  { icon: 'time-outline', text: `${EXAM_CONFIG.durationMinutes} Minuten Zeit` },
  { icon: 'alert-circle-outline', text: `Höchstens ${EXAM_CONFIG.maxErrorPoints} Fehlerpunkte (2–5 pro Frage)` },
  { icon: 'close-circle-outline', text: 'Zwei falsche 5-Punkte-Fragen = nicht bestanden' },
  { icon: 'checkbox-outline', text: 'Eine Frage zählt nur, wenn alle richtigen Antworten gewählt sind' },
];

function formatDateTime(ts: number) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())} Uhr`;
}

export default function ExamTab() {
  const { c } = useTheme();
  const exams = useLivoStore((s) => s.exams);
  const passed = exams.filter((e) => e.passed).length;
  const best = exams.length ? Math.min(...exams.map((e) => e.errorPoints)) : null;
  const lastFive = exams.slice(0, 5);
  const streakPassed = (() => {
    let n = 0;
    for (const e of exams) {
      if (!e.passed) break;
      n++;
    }
    return n;
  })();

  return (
    <Screen>
      <Txt variant="h1">Prüfung</Txt>
      <Txt color="textMuted" style={{ marginTop: 4 }}>
        Simuliere die Theorieprüfung Klasse B unter echten Bedingungen.
      </Txt>

      <Card style={{ marginTop: Space.xl, gap: Space.md }}>
        <Row gap={Space.sm}>
          <Ionicons name="ribbon" size={22} color={c.primary} />
          <Txt variant="h2">Prüfungssimulation</Txt>
        </Row>
        <View style={{ gap: Space.sm }}>
          {RULES.map((r) => (
            <Row key={r.text} gap={Space.sm} style={{ alignItems: 'flex-start' }}>
              <Ionicons name={r.icon} size={18} color={c.textMuted} style={{ marginTop: 2 }} />
              <Txt variant="small" style={{ flex: 1 }}>
                {r.text}
              </Txt>
            </Row>
          ))}
        </View>
        <Button title="Simulation starten" icon="play" onPress={() => router.push('/exam')} />
      </Card>

      {exams.length > 0 && (
        <Row gap={Space.md} style={{ marginTop: Space.md }}>
          <Card style={{ flex: 1 }}>
            <Txt variant="h2">
              {passed}/{exams.length}
            </Txt>
            <Txt variant="caption" color="textMuted">
              bestanden
            </Txt>
          </Card>
          <Card style={{ flex: 1 }}>
            <Txt variant="h2">{best}</Txt>
            <Txt variant="caption" color="textMuted">
              bestes Ergebnis (FP)
            </Txt>
          </Card>
          <Card style={{ flex: 1 }}>
            <Txt variant="h2">{streakPassed}</Txt>
            <Txt variant="caption" color="textMuted">
              in Folge bestanden
            </Txt>
          </Card>
        </Row>
      )}

      <SectionHeader title="Letzte Simulationen" />
      {lastFive.length === 0 ? (
        <Card>
          <EmptyState
            icon="document-text-outline"
            title="Noch keine Simulation"
            text="Starte deine erste Prüfungssimulation – Livo zeigt dir danach genau, wo du noch Punkte verlierst."
          />
        </Card>
      ) : (
        <Card style={{ paddingVertical: Space.xs }}>
          {lastFive.map((e, i) => (
            <View key={e.id}>
              {i > 0 && <Divider />}
              <ListRow
                icon={e.passed ? 'checkmark-circle' : 'close-circle'}
                iconTint={e.passed ? c.success : c.danger}
                title={`${e.errorPoints} Fehlerpunkte · ${e.correctCount}/${e.total} richtig`}
                subtitle={formatDateTime(e.finishedAt)}
                right={<Badge label={e.passed ? 'Bestanden' : 'Nicht bestanden'} tone={e.passed ? 'success' : 'danger'} />}
                onPress={() => router.push({ pathname: '/exam-result', params: { id: e.id } })}
              />
            </View>
          ))}
        </Card>
      )}
    </Screen>
  );
}
