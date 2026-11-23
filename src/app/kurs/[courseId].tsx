import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Badge, Button, Card, EmptyState, ProgressBar, Row, Screen, Txt, type IconName } from '@/components/ui';
import { COURSES } from '@/data/courses';
import { useLivoStore } from '@/store/useLivoStore';
import { Radius, Space, useTheme } from '@/theme';

export default function CourseScreen() {
  const { c } = useTheme();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const course = COURSES.find((co) => co.id === courseId);
  const completed = useLivoStore((s) => s.completedModules);
  const isPlus = useLivoStore((s) => s.isPlus);

  if (!course) {
    return (
      <Screen edges={[]}>
        <EmptyState icon="school-outline" title="Kurs nicht gefunden" text="Diesen Kurs gibt es nicht." />
      </Screen>
    );
  }

  const done = course.modules.filter((m) => completed.includes(m.id)).length;
  const minutes = course.modules.reduce((s, m) => s + m.minutes, 0);

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: course.title }} />
      <View style={[styles.hero, { backgroundColor: c.tealSoft }]}>
        <Ionicons name={course.icon as IconName} size={32} color={c.tealText} />
        <Txt variant="h1" style={{ marginTop: Space.sm }}>
          {course.title}
        </Txt>
        <Txt color="textMuted">{course.tagline}</Txt>
        <Txt variant="caption" color="textMuted" style={{ marginTop: Space.sm }}>
          {course.modules.length} Module · {minutes} Minuten · {done} abgeschlossen
        </Txt>
        <View style={{ marginTop: Space.md }}>
          <ProgressBar value={done / course.modules.length} color={c.teal} />
        </View>
      </View>

      <View style={{ gap: Space.md, marginTop: Space.xl }}>
        {course.modules.map((m, i) => {
          const locked = i > 0 && !isPlus;
          const isDone = completed.includes(m.id);
          return (
            <Card
              key={m.id}
              onPress={() => router.push(locked ? '/plus' : `/modul/${m.id}`)}
              accessibilityLabel={`${m.title}${locked ? ', gesperrt' : ''}`}>
              <Row gap={Space.md} style={{ alignItems: 'flex-start' }}>
                <View
                  style={[
                    styles.step,
                    { backgroundColor: isDone ? c.success : locked ? c.surfaceAlt : c.primarySoft },
                  ]}>
                  {isDone ? (
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  ) : locked ? (
                    <Ionicons name="lock-closed" size={16} color={c.textMuted} />
                  ) : (
                    <Txt variant="bodyStrong" color="primary">
                      {i + 1}
                    </Txt>
                  )}
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Row gap={Space.sm} style={{ flexWrap: 'wrap' }}>
                    <Txt variant="bodyStrong">{m.title}</Txt>
                    {i === 0 && !isPlus && <Badge label="Gratis" tone="teal" />}
                  </Row>
                  <Txt variant="small" color="textMuted">
                    {m.summary}
                  </Txt>
                  <Txt variant="caption" color="textMuted">
                    {m.minutes} Min · {m.quiz.length} Quizfragen
                  </Txt>
                </View>
              </Row>
            </Card>
          );
        })}
      </View>

      {!isPlus && (
        <Card tone="alt" style={{ marginTop: Space.xl, gap: Space.sm }}>
          <Txt variant="bodyStrong">Alle Module freischalten</Txt>
          <Txt variant="small" color="textMuted">
            Das erste Modul jedes Kurses ist kostenlos. Alle weiteren Module sind in Livo Plus enthalten.
          </Txt>
          <Button title="Livo Plus ansehen" icon="sparkles" small onPress={() => router.push('/plus')} style={{ alignSelf: 'flex-start', marginTop: Space.sm }} />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: Radius.xl, padding: Space.xl, marginTop: Space.sm },
  step: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
