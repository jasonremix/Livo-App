import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, router, Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { SIGN_NAMES, TrafficSign } from '@/components/TrafficSign';
import { Badge, Button, Card, EmptyState, Row, Screen, Txt } from '@/components/ui';
import { COURSES, findModule, isModuleFree } from '@/data/courses';
import { useLivoStore } from '@/store/useLivoStore';
import { Space, useTheme } from '@/theme';

export default function ModuleScreen() {
  const { c } = useTheme();
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const mod = findModule(moduleId);
  const isPlus = useLivoStore((s) => s.isPlus);
  const completed = useLivoStore((s) => s.completedModules);

  if (!mod) {
    return (
      <Screen edges={[]}>
        <EmptyState icon="book-outline" title="Modul nicht gefunden" text="Dieses Lernmodul gibt es nicht." />
      </Screen>
    );
  }
  if (!isModuleFree(mod.id) && !isPlus) return <Redirect href="/plus" />;

  const course = COURSES.find((co) => co.id === mod.courseId)!;
  const next = course.modules[mod.index + 1];
  const isDone = completed.includes(mod.id);

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: `Modul ${mod.index + 1}` }} />
      <Txt variant="caption" color="textMuted" style={{ marginTop: Space.sm }}>
        {course.title} · Modul {mod.index + 1} von {course.modules.length} · {mod.minutes} Min
      </Txt>
      <Row gap={Space.sm} style={{ marginTop: 4, flexWrap: 'wrap' }}>
        <Txt variant="h1" style={{ flexShrink: 1 }}>
          {mod.title}
        </Txt>
        {isDone && <Badge label="Abgeschlossen" tone="success" />}
      </Row>
      <Txt color="textMuted" style={{ marginTop: Space.sm }}>
        {mod.summary}
      </Txt>

      <View style={{ gap: Space.xl, marginTop: Space.xl }}>
        {mod.sections.map((s) => (
          <View key={s.heading} style={{ gap: Space.sm }}>
            <Txt variant="h2">{s.heading}</Txt>
            <Txt>{s.body}</Txt>
            {s.signs && (
              <Row gap={Space.lg} style={{ flexWrap: 'wrap', marginTop: Space.sm }}>
                {s.signs.map((id) => (
                  <View key={id} style={{ alignItems: 'center', width: 104, gap: 6 }}>
                    <TrafficSign id={id} size={80} />
                    <Txt variant="caption" color="textMuted" style={{ textAlign: 'center' }}>
                      {SIGN_NAMES[id].replace(/ \(Zeichen.*\)$/, '')}
                    </Txt>
                  </View>
                ))}
              </Row>
            )}
          </View>
        ))}
      </View>

      <Card tone="teal" style={{ marginTop: Space.xl, gap: Space.sm }}>
        <Row gap={Space.sm}>
          <Ionicons name="sparkles" size={18} color={c.tealText} />
          <Txt variant="label" color="tealText">
            Das solltest du dir merken
          </Txt>
        </Row>
        {mod.takeaways.map((t) => (
          <Row key={t} gap={Space.sm} style={{ alignItems: 'flex-start' }}>
            <Ionicons name="checkmark-circle" size={18} color={c.tealText} style={{ marginTop: 3 }} />
            <Txt style={{ flex: 1 }}>{t}</Txt>
          </Row>
        ))}
      </Card>

      <Button
        title={`Quiz starten (${mod.quiz.length} Fragen)`}
        icon="play"
        onPress={() => router.push({ pathname: '/quiz', params: { mode: 'module', id: mod.id } })}
        style={{ marginTop: Space.xl }}
      />
      {next && (
        <Button
          title={`Weiter: ${next.title}`}
          variant="secondary"
          iconRight={!isPlus ? 'lock-closed' : 'arrow-forward'}
          onPress={() => router.replace(isPlus ? `/modul/${next.id}` : '/plus')}
          style={{ marginTop: Space.sm }}
        />
      )}
    </Screen>
  );
}
