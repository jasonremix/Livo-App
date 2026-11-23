import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Badge, Button, Card, IconButton, Row, Screen, Txt, type IconName } from '@/components/ui';
import { ALL_MODULES } from '@/data/courses';
import { LINKS, openLink } from '@/lib/links';
import { FREE_LIVIA_MESSAGES_PER_DAY, LIVIA_AI_ENABLED } from '@/lib/livia-client';
import { useLivoStore } from '@/store/useLivoStore';
import { Radius, Space, useTheme } from '@/theme';

export default function Plus() {
  const { c } = useTheme();
  const isPlus = useLivoStore((s) => s.isPlus);

  const benefits: { icon: IconName; title: string; text: string }[] = [
    {
      icon: 'school-outline',
      title: `Alle ${ALL_MODULES.length} Lernmodule`,
      text: 'Alle vier Kurse komplett – das erste Modul jedes Kurses bleibt immer gratis.',
    },
    {
      icon: 'chatbubbles-outline',
      title: 'Unbegrenzt mit Livia chatten',
      text: LIVIA_AI_ENABLED
        ? `Ohne Plus sind es ${FREE_LIVIA_MESSAGES_PER_DAY} KI-Fragen pro Tag.`
        : 'Stell Livia so viele Fragen, wie du möchtest.',
    },
  ];

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen edges={['top', 'bottom']}>
      <Row style={{ justifyContent: 'flex-end' }}>
        <IconButton icon="close" label="Schließen" onPress={close} />
      </Row>

      <View style={{ alignItems: 'center', gap: Space.md }}>
        <View style={[styles.badge, { backgroundColor: c.primarySoft }]}>
          <Ionicons name="sparkles" size={36} color={c.primary} />
        </View>
        <Txt variant="display" style={{ textAlign: 'center' }}>
          Livo Plus
        </Txt>
        <Txt color="textMuted" style={{ textAlign: 'center', maxWidth: 400 }}>
          Alles, was du für eine sichere Theorieprüfung brauchst – in einem Paket.
        </Txt>
        {isPlus && <Badge label="Du bist Plus-Mitglied" tone="success" />}
      </View>

      <Card style={{ marginTop: Space.xl, gap: Space.lg }}>
        {benefits.map((b) => (
          <Row key={b.title} gap={Space.md} style={{ alignItems: 'flex-start' }}>
            <View style={[styles.icon, { backgroundColor: c.tealSoft }]}>
              <Ionicons name={b.icon} size={20} color={c.tealText} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt variant="bodyStrong">{b.title}</Txt>
              <Txt variant="small" color="textMuted">
                {b.text}
              </Txt>
            </View>
          </Row>
        ))}
      </Card>

      {!isPlus && (
        <>
          <Button
            title="Livo Plus auf mylivo.app holen"
            icon="sparkles"
            onPress={() => openLink(LINKS.checkoutPlus)}
            style={{ marginTop: Space.xl }}
          />
          <Txt variant="caption" color="textMuted" style={{ textAlign: 'center', marginTop: Space.md }}>
            Der Kauf erfolgt sicher auf mylivo.app. Die Anmeldung mit deinem mylivo.app-Konto in der App folgt in
            einem kommenden Update.
          </Txt>
        </>
      )}
      <Button title={isPlus ? 'Weiterlernen' : 'Vielleicht später'} variant="ghost" onPress={close} style={{ marginTop: Space.sm }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: Space.md },
  icon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
});
