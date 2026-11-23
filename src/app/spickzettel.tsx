import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { View } from 'react-native';

import { BetaBadge, Button, Card, Row, Screen, Txt, type IconName } from '@/components/ui';
import { CHEAT_SHEET, EXAM_DAY_TIPS } from '@/data/cheatsheet';
import { dayKey } from '@/lib/dates';
import { useLivoStore } from '@/store/useLivoStore';
import { Radius, Space, useTheme } from '@/theme';

export default function CheatSheet() {
  const { c } = useTheme();
  const seenToday = useLivoStore((s) => s.expressLog[dayKey()]?.cheatSheet ?? false);
  const markSeen = useLivoStore((s) => s.markCheatSheetSeen);

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: 'Spickzettel', headerTitle: '' }} />
      <Row gap={Space.sm} style={{ marginTop: Space.sm }}>
        <Txt variant="h1">Spickzettel</Txt>
        <BetaBadge />
      </Row>
      <Txt color="textMuted" style={{ marginTop: 4 }}>
        Die wichtigsten Fakten auf einen Blick – ideal für die letzten Tage vor der Prüfung.
      </Txt>

      <View style={{ gap: Space.md, marginTop: Space.xl }}>
        {CHEAT_SHEET.map((section) => (
          <Card key={section.title} style={{ gap: Space.sm }}>
            <Row gap={Space.sm}>
              <View style={{ width: 34, height: 34, borderRadius: Radius.sm, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={section.icon as IconName} size={18} color={c.primary} />
              </View>
              <Txt variant="h3">{section.title}</Txt>
            </Row>
            {section.facts.map((fact) => (
              <Row key={fact} gap={Space.sm} style={{ alignItems: 'flex-start' }}>
                <Txt color="primary" style={{ lineHeight: 24 }}>
                  •
                </Txt>
                <Txt style={{ flex: 1 }}>{fact}</Txt>
              </Row>
            ))}
          </Card>
        ))}

        <Card tone="teal" style={{ gap: Space.sm }}>
          <Txt variant="h3" color="tealText">
            Am Prüfungstag
          </Txt>
          {EXAM_DAY_TIPS.map((tip) => (
            <Row key={tip} gap={Space.sm} style={{ alignItems: 'flex-start' }}>
              <Ionicons name="checkmark" size={18} color={c.tealText} style={{ marginTop: 3 }} />
              <Txt style={{ flex: 1 }}>{tip}</Txt>
            </Row>
          ))}
        </Card>
      </View>

      <Button
        title={seenToday ? 'Heute schon durchgegangen ✓' : 'Spickzettel durchgegangen'}
        icon={seenToday ? undefined : 'checkmark-done'}
        variant={seenToday ? 'secondary' : 'primary'}
        onPress={() => {
          markSeen();
          if (router.canGoBack()) router.back();
        }}
        style={{ marginTop: Space.xl }}
      />
    </Screen>
  );
}
