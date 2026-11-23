import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BetaBadge, Button, Card, Row, Screen, Txt, type IconName } from '@/components/ui';
import { SIGN_IDS } from '@/data/signs';
import { CHALLENGE_BONUS, CHALLENGE_PASS, CHALLENGE_SIZE } from '@/lib/challenge';
import { dayKey } from '@/lib/dates';
import { daysUntilExam, EXPRESS_DAYS } from '@/lib/express';
import { LINKS, openLink } from '@/lib/links';
import { useLivoStore } from '@/store/useLivoStore';
import { Radius, Space, useTheme } from '@/theme';

interface Feature {
  icon: IconName;
  title: string;
  text: string;
  status: string;
  href: Href;
  tint: string;
}

export default function BetaLab() {
  const { c } = useTheme();
  const examDate = useLivoStore((s) => s.profile.examDate);
  const challenge = useLivoStore((s) => s.challenges[dayKey()]);
  const days = daysUntilExam(examDate);

  const features: Feature[] = [
    {
      icon: 'rocket-outline',
      title: 'Express-Modus',
      text: 'Crashkurs für die letzten Tage: 5-Punkte-Fragen, offene Fehler, Spickzettel und ein Tagesplan.',
      status:
        days !== null && days >= 0 && days <= EXPRESS_DAYS
          ? `Prüfung in ${days} ${days === 1 ? 'Tag' : 'Tagen'} – jetzt ideal`
          : `Ideal in den letzten ${EXPRESS_DAYS} Tagen vor der Prüfung`,
      href: '/express',
      tint: c.primary,
    },
    {
      icon: 'trophy-outline',
      title: 'Tages-Challenge',
      text: `Jeden Tag ${CHALLENGE_SIZE} neue Fragen. Mindestens ${CHALLENGE_PASS} richtig bringen ${CHALLENGE_BONUS} Bonus-Credits.`,
      status: challenge
        ? `Heute: ${challenge.correct}/${challenge.total} richtig${challenge.rewarded ? ` · +${CHALLENGE_BONUS} Credits erhalten` : ''}`
        : 'Heute noch offen',
      href: { pathname: '/quiz', params: { mode: 'challenge' } },
      tint: '#c79a00',
    },
    {
      icon: 'triangle-outline',
      title: 'Schilder-Trainer',
      text: 'Verkehrszeichen mit Karteikarten lernen: Schild ansehen, umdrehen, Bedeutung merken.',
      status: `${SIGN_IDS.length} Zeichen`,
      href: '/schilder',
      tint: c.tealText,
    },
    {
      icon: 'scan-outline',
      title: 'Livo Scanner',
      text: 'Führerschein oder Lernkarte fotografieren – Texterkennung direkt auf dem Gerät.',
      status: 'Foto bleibt auf dem Gerät',
      href: '/scanner',
      tint: c.successText,
    },
  ];

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: 'Beta-Labor', headerTitle: '' }} />
      <Row gap={Space.sm} style={{ marginTop: Space.sm }}>
        <Txt variant="h1">Beta-Labor</Txt>
        <BetaBadge />
      </Row>
      <Txt color="textMuted" style={{ marginTop: 4 }}>
        Neue Funktionen zum Ausprobieren. Sie sind noch im Test und können sich ändern – sag uns gern, was du denkst.
      </Txt>

      <View style={{ gap: Space.md, marginTop: Space.xl }}>
        {features.map((f) => (
          <Card key={f.title} onPress={() => router.push(f.href)} accessibilityLabel={`${f.title}, Beta`}>
            <Row gap={Space.md} style={{ alignItems: 'flex-start' }}>
              <View style={[styles.icon, { backgroundColor: c.surfaceAlt }]}>
                <Ionicons name={f.icon} size={22} color={f.tint} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Row gap={Space.sm}>
                  <Txt variant="bodyStrong">{f.title}</Txt>
                  <BetaBadge small />
                </Row>
                <Txt variant="small" color="textMuted">
                  {f.text}
                </Txt>
                <Txt variant="caption" style={{ color: f.tint }}>
                  {f.status}
                </Txt>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.textMuted} style={{ marginTop: 12 }} />
            </Row>
          </Card>
        ))}
      </View>

      <Card tone="alt" style={{ marginTop: Space.xl, gap: Space.sm }}>
        <Txt variant="bodyStrong">Feedback zu den Beta-Funktionen</Txt>
        <Txt variant="small" color="textMuted">
          Etwas funktioniert nicht oder du hast eine Idee? Schreib uns über den Support von mylivo.app.
        </Txt>
        <Button title="Feedback geben" icon="chatbox-ellipses-outline" small variant="secondary" onPress={() => openLink(LINKS.support)} style={{ alignSelf: 'flex-start', marginTop: Space.sm }} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  icon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
});
