import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BetaBadge, Button, Card, ProgressBar, Row, Screen, SectionHeader, Txt } from '@/components/ui';
import { EXAM_DAY_TIPS } from '@/data/cheatsheet';
import { QUESTIONS } from '@/data/questions';
import { dayKey } from '@/lib/dates';
import { daysUntilExam, EXPRESS_DAYS, expressPlan, type ExpressTaskId } from '@/lib/express';
import { isMastered, mistakeIds } from '@/lib/srs';
import { useLivoStore } from '@/store/useLivoStore';
import { Fonts, Radius, Space, useTheme } from '@/theme';

const FIVE_POINTERS = QUESTIONS.filter((q) => q.points === 5);

export default function ExpressScreen() {
  const { c } = useTheme();
  const examDate = useLivoStore((s) => s.profile.examDate);
  const progress = useLivoStore((s) => s.progress);
  const exams = useLivoStore((s) => s.exams);
  const log = useLivoStore((s) => s.expressLog);

  const today = dayKey();
  const daysLeft = daysUntilExam(examDate);
  const mistakesOpen = mistakeIds(progress).length;
  const examsToday = exams.filter((e) => dayKey(new Date(e.finishedAt)) === today).length;
  const plan = expressPlan(daysLeft !== null && daysLeft < 0 ? null : daysLeft, {
    expressRounds: log[today]?.rounds ?? 0,
    exams: examsToday,
    mistakesOpen,
    cheatSheet: log[today]?.cheatSheet ?? false,
  });
  const done = plan.filter((t) => t.done >= t.target).length;
  const fivesMastered = FIVE_POINTERS.filter((q) => isMastered(progress[q.id])).length;

  const start = (id: ExpressTaskId) => {
    if (id === 'express') router.push({ pathname: '/quiz', params: { mode: 'express' } });
    else if (id === 'exam') router.push('/exam');
    else if (id === 'mistakes') router.push({ pathname: '/quiz', params: { mode: 'mistakes' } });
    else router.push('/spickzettel');
  };

  const headline =
    daysLeft === null
      ? 'Dein Crashkurs vor der Prüfung'
      : daysLeft === 0
        ? 'Heute ist Prüfungstag!'
        : daysLeft === 1
          ? 'Morgen ist deine Prüfung'
          : daysLeft > 0
            ? `Noch ${daysLeft} Tage bis zur Prüfung`
            : 'Dein Crashkurs vor der Prüfung';

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: 'Express-Modus', headerTitle: '' }} />

      <View style={[styles.hero, { backgroundColor: c.primary }]}>
        <Row gap={Space.sm}>
          <Ionicons name="rocket" size={22} color={c.onPrimary} />
          <Txt variant="label" style={{ color: c.onPrimary }}>
            Express-Modus
          </Txt>
          <View style={{ backgroundColor: c.onPrimary, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
            <Txt style={{ fontFamily: Fonts.bodyExtra, fontSize: 11, letterSpacing: 0.8, color: c.primary }}>BETA</Txt>
          </View>
        </Row>
        <Txt variant="h1" style={{ color: c.onPrimary, marginTop: Space.sm }}>
          {headline}
        </Txt>
        <Txt style={{ color: c.onPrimary, opacity: 0.92, marginTop: 4 }}>
          Kein Stoff mehr von vorn: Livo konzentriert sich auf das, was in der Prüfung die meisten Punkte kostet –
          5-Punkte-Fragen, offene Fehler und die wichtigsten Fakten.
        </Txt>
      </View>

      {daysLeft === null && (
        <Card style={{ marginTop: Space.md }}>
          <Txt variant="bodyStrong">Kein Prüfungstermin eingetragen</Txt>
          <Txt variant="small" color="textMuted" style={{ marginTop: 4 }}>
            Trag deinen Termin unter „Konto“ ein. Livo zeigt dann den Countdown und passt den Tagesplan an. Der
            Express-Modus ist für die letzten {EXPRESS_DAYS} Tage gedacht.
          </Txt>
          <Button title="Termin eintragen" small variant="secondary" onPress={() => router.push('/konto')} style={{ alignSelf: 'flex-start', marginTop: Space.md }} />
        </Card>
      )}

      <SectionHeader title={`Plan für heute (${done}/${plan.length})`} />
      <Card style={{ gap: Space.md }}>
        {plan.map((t) => {
          const complete = t.done >= t.target;
          return (
            <Row key={t.id} gap={Space.md}>
              <Ionicons
                name={complete ? 'checkmark-circle' : 'ellipse-outline'}
                size={26}
                color={complete ? c.success : c.textMuted}
              />
              <View style={{ flex: 1 }}>
                <Txt variant="bodyStrong" style={complete ? { textDecorationLine: 'line-through', opacity: 0.6 } : undefined}>
                  {t.title}
                </Txt>
                <Txt variant="caption" color="textMuted">
                  {t.done}/{t.target} erledigt
                </Txt>
              </View>
              <Button title={complete ? 'Nochmal' : 'Los'} small variant={complete ? 'secondary' : 'primary'} onPress={() => start(t.id)} />
            </Row>
          );
        })}
      </Card>

      {daysLeft === 0 && (
        <Card tone="teal" style={{ marginTop: Space.md, gap: Space.sm }}>
          <Txt variant="bodyStrong" color="tealText">
            Für heute
          </Txt>
          {EXAM_DAY_TIPS.map((tip) => (
            <Row key={tip} gap={Space.sm} style={{ alignItems: 'flex-start' }}>
              <Ionicons name="checkmark" size={18} color={c.tealText} style={{ marginTop: 2 }} />
              <Txt variant="small" style={{ flex: 1 }}>
                {tip}
              </Txt>
            </Row>
          ))}
        </Card>
      )}

      <SectionHeader title="Stand" />
      <Row gap={Space.md}>
        <Card style={{ flex: 1, gap: Space.sm }}>
          <Txt variant="h2">
            {fivesMastered}/{FIVE_POINTERS.length}
          </Txt>
          <Txt variant="caption" color="textMuted">
            5-Punkte-Fragen sicher
          </Txt>
          <ProgressBar value={fivesMastered / FIVE_POINTERS.length} height={6} />
        </Card>
        <Card style={{ flex: 1, gap: Space.sm }}>
          <Txt variant="h2">{mistakesOpen}</Txt>
          <Txt variant="caption" color="textMuted">
            offene Fehler
          </Txt>
          <Txt variant="caption" color={mistakesOpen ? 'dangerText' : 'successText'}>
            {mistakesOpen ? 'Am besten heute noch wiederholen' : 'Alles wiederholt'}
          </Txt>
        </Card>
      </Row>

      <View style={{ gap: Space.sm, marginTop: Space.xl }}>
        <Button title="Express-Runde starten (20 Fragen)" icon="flash" onPress={() => start('express')} />
        <Button title="Spickzettel öffnen" icon="document-text-outline" variant="secondary" onPress={() => start('cheatsheet')} />
      </View>

      <Row gap={Space.sm} style={{ justifyContent: 'center', marginTop: Space.xl }}>
        <BetaBadge small />
        <Txt variant="caption" color="textMuted">
          Neu und noch im Test – Feedback hilft uns sehr.
        </Txt>
      </Row>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: Radius.xl, padding: Space.xl, marginTop: Space.sm },
});
