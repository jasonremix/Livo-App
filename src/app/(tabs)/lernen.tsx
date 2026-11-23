import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Badge, BetaBadge, Button, Card, Divider, ListRow, ProgressBar, Row, Screen, SectionHeader, Txt, type IconName } from '@/components/ui';
import { CATEGORIES } from '@/data/categories';
import { COURSES } from '@/data/courses';
import { mistakeIds } from '@/lib/srs';
import { categoryStats } from '@/lib/stats';
import { useLivoStore } from '@/store/useLivoStore';
import { Radius, Space, useTheme } from '@/theme';

export default function Learn() {
  const { c } = useTheme();
  const progress = useLivoStore((s) => s.progress);
  const marked = useLivoStore((s) => s.marked);
  const completed = useLivoStore((s) => s.completedModules);
  const isPlus = useLivoStore((s) => s.isPlus);
  const mistakes = mistakeIds(progress).length;

  return (
    <Screen>
      <Txt variant="h1">Lernen</Txt>
      <Txt color="textMuted" style={{ marginTop: 4 }}>
        Trainiere gezielt, wiederhole Fehler und lerne in Kursen.
      </Txt>

      <Card tone="primary" style={{ marginTop: Space.xl }}>
        <Row gap={Space.sm}>
          <Ionicons name="flash" size={20} color={c.onPrimary} />
          <Txt variant="label" style={{ color: c.onPrimary }}>
            Smartes Training
          </Txt>
        </Row>
        <Txt variant="h2" style={{ color: c.onPrimary, marginTop: Space.sm }}>
          15 Fragen, die du gerade brauchst
        </Txt>
        <Txt variant="small" style={{ color: c.onPrimary, opacity: 0.9, marginTop: 4 }}>
          Fehler zuerst, dann fällige Wiederholungen und neue Fragen – nach dem Karteikasten-Prinzip.
        </Txt>
        <Button
          title="Training starten"
          variant="secondary"
          icon="play"
          onPress={() => router.push({ pathname: '/quiz', params: { mode: 'training' } })}
          style={{ marginTop: Space.lg }}
        />
      </Card>

      <Card style={{ marginTop: Space.md, paddingVertical: Space.xs }}>
        <ListRow
          icon="refresh-outline"
          iconTint={c.dangerText}
          title="Fehler wiederholen"
          subtitle={mistakes ? `${mistakes} Fragen zuletzt falsch beantwortet` : 'Aktuell keine offenen Fehler'}
          onPress={() => router.push({ pathname: '/quiz', params: { mode: 'mistakes' } })}
          disabled={!mistakes}
        />
        <Divider />
        <ListRow
          icon="bookmark-outline"
          iconTint={c.tealText}
          title="Markierte Fragen"
          subtitle={marked.length ? `${marked.length} Fragen gemerkt` : 'Markiere Fragen mit dem Lesezeichen'}
          onPress={() => router.push({ pathname: '/quiz', params: { mode: 'marked' } })}
          disabled={!marked.length}
        />
      </Card>

      <SectionHeader title="Beta-Labor" action={<BetaBadge />} />
      <Card style={{ paddingVertical: Space.xs }}>
        <ListRow
          icon="rocket-outline"
          iconTint={c.primary}
          title="Express-Modus"
          subtitle="Crashkurs für die letzten Tage vor der Prüfung"
          onPress={() => router.push('/express')}
        />
        <Divider />
        <ListRow
          icon="trophy-outline"
          iconTint="#c79a00"
          title="Tages-Challenge"
          subtitle="5 Fragen pro Tag, 10 Bonus-Credits"
          onPress={() => router.push({ pathname: '/quiz', params: { mode: 'challenge' } })}
        />
        <Divider />
        <ListRow
          icon="triangle-outline"
          iconTint={c.tealText}
          title="Schilder-Trainer"
          subtitle="Verkehrszeichen mit Karteikarten"
          onPress={() => router.push('/schilder')}
        />
        <Divider />
        <ListRow
          icon="scan-outline"
          iconTint={c.successText}
          title="Livo Scanner"
          subtitle="Führerschein oder Lernkarte scannen"
          onPress={() => router.push('/scanner')}
        />
      </Card>

      <SectionHeader title="Kurse" />
      <View style={{ gap: Space.md }}>
        {COURSES.map((course) => {
          const done = course.modules.filter((m) => completed.includes(m.id)).length;
          const minutes = course.modules.reduce((s, m) => s + m.minutes, 0);
          return (
            <Card key={course.id} onPress={() => router.push(`/kurs/${course.id}`)} accessibilityLabel={course.title}>
              <Row gap={Space.md}>
                <View style={[styles.icon, { backgroundColor: c.tealSoft }]}>
                  <Ionicons name={course.icon as IconName} size={22} color={c.tealText} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt variant="bodyStrong">{course.title}</Txt>
                  <Txt variant="caption" color="textMuted">
                    {course.modules.length} Module · {minutes} Min{!isPlus ? ' · 1. Modul gratis' : ''}
                  </Txt>
                </View>
                {done === course.modules.length ? (
                  <Badge label="Fertig" tone="success" />
                ) : (
                  <Txt variant="caption" color="textMuted">
                    {done}/{course.modules.length}
                  </Txt>
                )}
              </Row>
              <View style={{ marginTop: Space.md }}>
                <ProgressBar value={done / course.modules.length} color={c.teal} height={6} />
              </View>
            </Card>
          );
        })}
      </View>

      <SectionHeader title="Themen" />
      <Card style={{ paddingVertical: Space.xs }}>
        {CATEGORIES.map((cat, i) => {
          const s = categoryStats(cat.id, progress);
          return (
            <View key={cat.id}>
              {i > 0 && <Divider />}
              <ListRow
                icon={cat.icon as IconName}
                title={cat.title}
                subtitle={`${s.mastered} von ${s.total} sicher · ${s.seen} gesehen`}
                onPress={() => router.push({ pathname: '/quiz', params: { mode: 'category', id: cat.id } })}
              />
              <View style={{ paddingLeft: 52, paddingBottom: Space.sm }}>
                <ProgressBar value={s.total ? s.mastered / s.total : 0} height={5} />
              </View>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  icon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
});
