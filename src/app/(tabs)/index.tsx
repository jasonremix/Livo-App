import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, ProgressBar, ProgressRing, Row, Screen, SectionHeader, Txt, type IconName } from '@/components/ui';
import { ALL_MODULES, COURSES } from '@/data/courses';
import { LIVIA_FAQ } from '@/data/livia-faq';
import { dayKey, daysBetween, parseDayKey, streak } from '@/lib/dates';
import { sendToLivia } from '@/lib/livia-chat';
import { mistakeIds } from '@/lib/srs';
import { progressStats, readiness } from '@/lib/stats';
import { useLivoStore } from '@/store/useLivoStore';
import { Fonts, Radius, Space, useTheme } from '@/theme';

/** Wechselt täglich. */
function tipOfTheDay() {
  return LIVIA_FAQ[Math.floor(Date.now() / 86_400_000) % LIVIA_FAQ.length];
}

function examCountdown(examDate: string | null): string | null {
  if (!examDate) return null;
  const days = daysBetween(new Date(), parseDayKey(examDate));
  if (days > 1) return `Noch ${days} Tage bis zur Prüfung`;
  if (days === 1) return 'Morgen ist deine Prüfung – du schaffst das!';
  if (days === 0) return 'Heute ist Prüfungstag. Viel Erfolg!';
  return null;
}

export default function Home() {
  const { c } = useTheme();
  const profile = useLivoStore((s) => s.profile);
  const progress = useLivoStore((s) => s.progress);
  const exams = useLivoStore((s) => s.exams);
  const activity = useLivoStore((s) => s.activity);
  const credits = useLivoStore((s) => s.credits);
  const completed = useLivoStore((s) => s.completedModules);

  const stats = progressStats(progress);
  const ready = readiness(progress, exams);
  const today = activity[dayKey()] ?? 0;
  const days = streak(activity);
  const mistakes = mistakeIds(progress).length;
  const countdown = examCountdown(profile.examDate);
  const nextModule = ALL_MODULES.find((m) => !completed.includes(m.id));
  const nextCourse = nextModule ? COURSES.find((co) => co.id === nextModule.courseId) : undefined;
  const tip = tipOfTheDay();

  const actions: { icon: IconName; label: string; sub: string; onPress: () => void; tint: string }[] = [
    {
      icon: 'flash-outline',
      label: 'Training',
      sub: '15 Fragen',
      tint: c.primary,
      onPress: () => router.push({ pathname: '/quiz', params: { mode: 'training' } }),
    },
    {
      icon: 'ribbon-outline',
      label: 'Prüfung',
      sub: '30 Fragen · 45 Min',
      tint: c.tealText,
      onPress: () => router.push('/exam'),
    },
    {
      icon: 'refresh-outline',
      label: 'Fehler',
      sub: mistakes ? `${mistakes} offen` : 'Keine offen',
      tint: c.dangerText,
      onPress: () =>
        mistakes ? router.push({ pathname: '/quiz', params: { mode: 'mistakes' } }) : router.push('/lernen'),
    },
    {
      icon: 'chatbubble-ellipses-outline',
      label: 'Livia',
      sub: 'Frag nach',
      tint: c.successText,
      onPress: () => router.push('/livia'),
    },
  ];

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Txt variant="h1">{profile.name ? `Hallo, ${profile.name}!` : 'Hallo!'}</Txt>
          <Txt color="textMuted">{countdown ?? 'Bereit für ein paar Fragen?'}</Txt>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${credits} Credits`}
          onPress={() => router.push('/credits')}
          style={[styles.creditPill, { backgroundColor: c.warningSoft }]}>
          <Ionicons name="star" size={16} color="#c79a00" />
          <Txt variant="bodyStrong">{credits}</Txt>
        </Pressable>
      </Row>

      <Card style={{ marginTop: Space.xl }}>
        <Row gap={Space.lg}>
          <ProgressRing value={ready / 100} size={112} color={ready >= 80 ? c.success : c.primary}>
            <Txt style={{ fontFamily: Fonts.display, fontSize: 24 }}>{ready}%</Txt>
          </ProgressRing>
          <View style={{ flex: 1, gap: 4 }}>
            <Txt variant="label" color="textMuted">
              Prüfungsreife
            </Txt>
            <Txt variant="h3">
              {stats.mastered} von {stats.total} Fragen sicher
            </Txt>
            <Txt variant="small" color="textMuted">
              {exams.length
                ? `${exams.filter((e) => e.passed).length} von ${exams.length} Simulationen bestanden`
                : 'Mach eine Prüfungssimulation, um deine Reife genauer einzuschätzen.'}
            </Txt>
          </View>
        </Row>
        <Button
          title={stats.seen ? 'Weiterlernen' : 'Erste Fragen starten'}
          icon="play"
          onPress={() => router.push({ pathname: '/quiz', params: { mode: 'training' } })}
          style={{ marginTop: Space.lg }}
        />
      </Card>

      <Row gap={Space.md} style={{ marginTop: Space.md, alignItems: 'stretch' }}>
        <Card style={{ flex: 1, gap: Space.sm }}>
          <Row gap={6}>
            <Ionicons name="flag-outline" size={18} color={c.primary} />
            <Txt variant="label" color="textMuted">
              Heute
            </Txt>
          </Row>
          <Txt variant="h2">
            {today}
            <Txt variant="body" color="textMuted">
              {' '}
              / {profile.dailyGoal}
            </Txt>
          </Txt>
          <ProgressBar value={today / profile.dailyGoal} color={today >= profile.dailyGoal ? c.success : c.primary} />
        </Card>
        <Card style={{ flex: 1, gap: Space.sm }}>
          <Row gap={6}>
            <Ionicons name="flame-outline" size={18} color="#f08a24" />
            <Txt variant="label" color="textMuted">
              Serie
            </Txt>
          </Row>
          <Txt variant="h2">
            {days}
            <Txt variant="body" color="textMuted">
              {days === 1 ? ' Tag' : ' Tage'}
            </Txt>
          </Txt>
          <Txt variant="caption" color="textMuted">
            {today ? 'Heute schon gelernt 👏' : 'Lern heute, um sie zu halten.'}
          </Txt>
        </Card>
      </Row>

      <SectionHeader title="Schnellstart" />
      <View style={styles.grid}>
        {actions.map((a) => (
          <Card key={a.label} onPress={a.onPress} style={styles.gridItem} accessibilityLabel={a.label}>
            <Ionicons name={a.icon} size={24} color={a.tint} />
            <Txt variant="bodyStrong" style={{ marginTop: Space.sm }}>
              {a.label}
            </Txt>
            <Txt variant="caption" color="textMuted">
              {a.sub}
            </Txt>
          </Card>
        ))}
      </View>

      {nextModule && nextCourse && (
        <>
          <SectionHeader title="Weiter im Kurs" />
          <Card onPress={() => router.push(`/modul/${nextModule.id}`)} accessibilityLabel={nextModule.title}>
            <Row gap={Space.md}>
              <View style={[styles.courseIcon, { backgroundColor: c.tealSoft }]}>
                <Ionicons name={nextCourse.icon as IconName} size={22} color={c.tealText} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="caption" color="textMuted">
                  {nextCourse.title} · Modul {nextModule.index + 1}
                </Txt>
                <Txt variant="bodyStrong">{nextModule.title}</Txt>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.textMuted} />
            </Row>
          </Card>
        </>
      )}

      <SectionHeader title="Livias Tipp des Tages" />
      <Card tone="teal">
        <Txt variant="bodyStrong" color="tealText">
          {tip.title}
        </Txt>
        <Txt variant="small" style={{ marginTop: 6 }} numberOfLines={5}>
          {tip.answer}
        </Txt>
        <Button
          title="Livia fragen"
          variant="secondary"
          small
          icon="chatbubble-ellipses-outline"
          onPress={() => {
            sendToLivia(`Erklär mir: ${tip.title}`);
            router.push('/livia');
          }}
          style={{ marginTop: Space.md, alignSelf: 'flex-start' }}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  creditPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.md },
  gridItem: { flexBasis: '47%', flexGrow: 1, minHeight: 112 },
  courseIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
});
