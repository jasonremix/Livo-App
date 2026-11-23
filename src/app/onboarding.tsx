import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Field, GoalPicker, useExamDateField } from '@/components/ProfileFields';
import { Button, Card, Row, Screen, Txt, type IconName } from '@/components/ui';
import { QUESTIONS } from '@/data/questions';
import { useLivoStore } from '@/store/useLivoStore';
import { Radius, Space, useTheme } from '@/theme';

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  { icon: 'book-outline', title: 'Lernen & Training', text: `${QUESTIONS.length} Übungsfragen mit smarten Wiederholungen.` },
  { icon: 'ribbon-outline', title: 'Prüfungssimulation', text: '30 Fragen, Fehlerpunkte und Zeitlimit – wie im Original.' },
  { icon: 'chatbubble-ellipses-outline', title: 'Livia erklärt', text: 'Verständliche Erklärungen zu jeder Regel.' },
  { icon: 'star-outline', title: 'Credits sammeln', text: '2 Credits für jede richtige Antwort.' },
];

export default function Onboarding() {
  const { c } = useTheme();
  const profile = useLivoStore((s) => s.profile);
  const updateProfile = useLivoStore((s) => s.updateProfile);
  const [name, setName] = useState(profile.name);
  const [goal, setGoal] = useState(profile.dailyGoal);
  const exam = useExamDateField(profile.examDate);

  const start = () => {
    updateProfile({ name: name.trim(), examDate: exam.value, dailyGoal: goal, onboarded: true });
    router.replace('/');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={{ alignItems: 'center', marginTop: Space.xl, gap: Space.md }}>
        <View style={[styles.logoWrap, { backgroundColor: c.tealSoft }]}>
          <Image
            source={require('@/assets/brand/livo-logo.png')}
            style={{ width: 72, height: 86 }}
            contentFit="contain"
            accessibilityLabel="Livo Logo"
          />
        </View>
        <Txt variant="display" style={{ textAlign: 'center' }}>
          Willkommen bei Livo
        </Txt>
        <Txt color="textMuted" style={{ textAlign: 'center', maxWidth: 420 }}>
          Deine Vorbereitung auf die deutsche Theorieprüfung. Lernen mit Livia.
        </Txt>
      </View>

      <View style={{ gap: Space.md, marginTop: Space.xl }}>
        {FEATURES.map((f) => (
          <Row key={f.title} gap={Space.md} style={{ alignItems: 'flex-start' }}>
            <View style={[styles.featureIcon, { backgroundColor: c.primarySoft }]}>
              <Ionicons name={f.icon} size={20} color={c.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt variant="bodyStrong">{f.title}</Txt>
              <Txt variant="small" color="textMuted">
                {f.text}
              </Txt>
            </View>
          </Row>
        ))}
      </View>

      <Card style={{ marginTop: Space.xl, gap: Space.lg }}>
        <Txt variant="h2">Kurz zu dir</Txt>
        <Field label="Vorname (optional)" value={name} onChangeText={setName} placeholder="z. B. Alex" />
        <Field
          label="Prüfungstermin (optional)"
          value={exam.text}
          onChangeText={exam.setText}
          placeholder="TT.MM.JJJJ"
          keyboardType="numbers-and-punctuation"
          error={exam.error}
          hint="Livo zeigt dir einen Countdown bis zur Prüfung."
        />
        <GoalPicker value={goal} onChange={setGoal} />
      </Card>

      <Button
        title="Los geht’s"
        iconRight="arrow-forward"
        onPress={start}
        disabled={!!exam.error}
        style={{ marginTop: Space.xl }}
      />
      <Txt variant="caption" color="textMuted" style={{ textAlign: 'center', marginTop: Space.md }}>
        Dein Lernfortschritt wird nur auf diesem Gerät gespeichert.
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoWrap: { width: 112, height: 112, borderRadius: 56, alignItems: 'center', justifyContent: 'center' },
  featureIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
});
