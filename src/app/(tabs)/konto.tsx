import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Field, GoalPicker, useExamDateField } from '@/components/ProfileFields';
import { Badge, Card, Chip, ConfirmDialog, Divider, ListRow, Row, Screen, SectionHeader, Txt } from '@/components/ui';
import { LINKS, openLink } from '@/lib/links';
import { progressStats } from '@/lib/stats';
import { useLivoStore, type ThemePref } from '@/store/useLivoStore';
import { Space, useTheme } from '@/theme';

const THEMES: { value: ThemePref; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Hell' },
  { value: 'dark', label: 'Dunkel' },
];

export default function Account() {
  const { c } = useTheme();
  const profile = useLivoStore((s) => s.profile);
  const updateProfile = useLivoStore((s) => s.updateProfile);
  const credits = useLivoStore((s) => s.credits);
  const isPlus = useLivoStore((s) => s.isPlus);
  const setPlus = useLivoStore((s) => s.setPlus);
  const themePref = useLivoStore((s) => s.themePref);
  const setThemePref = useLivoStore((s) => s.setThemePref);
  const progress = useLivoStore((s) => s.progress);
  const exams = useLivoStore((s) => s.exams);
  const resetProgress = useLivoStore((s) => s.resetProgress);
  const [confirmReset, setConfirmReset] = useState(false);
  const exam = useExamDateField(profile.examDate);
  const stats = progressStats(progress);

  return (
    <Screen>
      <Txt variant="h1">Konto</Txt>

      <Card style={{ marginTop: Space.xl, gap: Space.lg }}>
        <Field
          label="Vorname"
          value={profile.name}
          onChangeText={(name) => updateProfile({ name })}
          placeholder="Wie dürfen wir dich nennen?"
        />
        <Field
          label="Prüfungstermin"
          value={exam.text}
          onChangeText={(t) => {
            exam.setText(t);
            if (!t.trim()) updateProfile({ examDate: null });
          }}
          onBlur={() => exam.value && updateProfile({ examDate: exam.value })}
          placeholder="TT.MM.JJJJ"
          keyboardType="numbers-and-punctuation"
          error={exam.error}
        />
        <GoalPicker value={profile.dailyGoal} onChange={(dailyGoal) => updateProfile({ dailyGoal })} />
      </Card>

      <Card style={{ marginTop: Space.md, paddingVertical: Space.xs }}>
        <ListRow
          icon="star"
          iconTint="#c79a00"
          title={`${credits} Credits`}
          subtitle="2 Credits für jede richtige Antwort"
          onPress={() => router.push('/credits')}
        />
        <Divider />
        <ListRow
          icon="sparkles"
          iconTint={c.primary}
          title="Livo Plus"
          subtitle={isPlus ? 'Aktiv – alle Module freigeschaltet' : 'Alle Kursmodule und unbegrenzt Livia'}
          right={isPlus ? <Badge label="Aktiv" tone="success" /> : undefined}
          onPress={() => router.push('/plus')}
        />
      </Card>

      <SectionHeader title="Statistik" />
      <Row gap={Space.md}>
        <Card style={{ flex: 1 }}>
          <Txt variant="h2">{stats.answers}</Txt>
          <Txt variant="caption" color="textMuted">
            Antworten
          </Txt>
        </Card>
        <Card style={{ flex: 1 }}>
          <Txt variant="h2">{Math.round(stats.accuracy * 100)}%</Txt>
          <Txt variant="caption" color="textMuted">
            Trefferquote
          </Txt>
        </Card>
        <Card style={{ flex: 1 }}>
          <Txt variant="h2">{exams.length}</Txt>
          <Txt variant="caption" color="textMuted">
            Prüfungen
          </Txt>
        </Card>
      </Row>

      <SectionHeader title="Darstellung" />
      <Row gap={Space.sm}>
        {THEMES.map((t) => (
          <Chip key={t.value} label={t.label} selected={themePref === t.value} onPress={() => setThemePref(t.value)} />
        ))}
      </Row>

      <SectionHeader title="Livo" />
      <Card style={{ paddingVertical: Space.xs }}>
        <ListRow icon="globe-outline" title="mylivo.app" onPress={() => openLink(LINKS.website)} />
        <Divider />
        <ListRow icon="medkit-outline" title="Erste Hilfe" onPress={() => openLink(LINKS.ersteHilfe)} />
        <Divider />
        <ListRow icon="help-buoy-outline" title="Support" onPress={() => openLink(LINKS.support)} />
        <Divider />
        <ListRow icon="document-text-outline" title="Impressum" onPress={() => openLink(LINKS.impressum)} />
        <Divider />
        <ListRow icon="shield-checkmark-outline" title="Datenschutz" onPress={() => openLink(LINKS.datenschutz)} />
        <Divider />
        <ListRow icon="reader-outline" title="AGB" onPress={() => openLink(LINKS.agb)} />
      </Card>

      <SectionHeader title="Daten" />
      <Card style={{ paddingVertical: Space.xs }}>
        <ListRow
          icon="refresh-circle-outline"
          iconTint={c.dangerText}
          title="Lernfortschritt zurücksetzen"
          subtitle="Antworten, Simulationen und Kursfortschritt löschen. Credits bleiben erhalten."
          onPress={() => setConfirmReset(true)}
        />
        {__DEV__ && (
          <>
            <Divider />
            <ListRow
              icon="code-slash-outline"
              title="Entwicklung: Plus simulieren"
              subtitle="Nur in Entwicklungs-Builds sichtbar"
              right={<Chip label={isPlus ? 'An' : 'Aus'} selected={isPlus} onPress={() => setPlus(!isPlus)} />}
            />
          </>
        )}
      </Card>

      <View style={{ alignItems: 'center', marginTop: Space.xl, gap: 4 }}>
        <Row gap={6}>
          <Ionicons name="heart" size={14} color={c.primary} />
          <Txt variant="caption" color="textMuted">
            Lernen mit Livia.
          </Txt>
        </Row>
        <Txt variant="caption" color="textMuted">
          Livo {Constants.expoConfig?.version ?? ''} · Fortschritt wird lokal gespeichert
        </Txt>
      </View>

      <ConfirmDialog
        visible={confirmReset}
        title="Fortschritt zurücksetzen?"
        message="Alle Antworten, Prüfungssimulationen, markierten Fragen und abgeschlossenen Module werden gelöscht. Das lässt sich nicht rückgängig machen."
        confirmLabel="Zurücksetzen"
        destructive
        onConfirm={() => {
          resetProgress();
          setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </Screen>
  );
}
