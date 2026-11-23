import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { TrafficSign } from '@/components/TrafficSign';
import { Badge, BetaBadge, Button, Card, haptic, ProgressBar, Row, Screen, Txt } from '@/components/ui';
import { SIGN_IDS, SIGN_INFO } from '@/data/signs';
import type { SignId } from '@/data/types';
import { shuffle } from '@/lib/random';
import { Fonts, Radius, Space, useTheme } from '@/theme';

const ROUND_SIZE = 10;

/** Verkehrszeichen-Trainer mit Karteikarten (wie auf mylivo.app/verkehrszeichen). */
export default function SignTrainer() {
  const { c } = useTheme();
  const [deck, setDeck] = useState<SignId[]>(() => shuffle(SIGN_IDS).slice(0, ROUND_SIZE));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<SignId[]>([]);
  const [unknown, setUnknown] = useState<SignId[]>([]);
  const [rotation] = useState(() => new Animated.Value(0));

  const finished = index >= deck.length;
  const sign = deck[Math.min(index, deck.length - 1)];
  const info = SIGN_INFO[sign];

  const flip = () => {
    if (flipped) return;
    haptic();
    Animated.timing(rotation, { toValue: 1, duration: 160, useNativeDriver: true }).start(() => {
      setFlipped(true);
      Animated.timing(rotation, { toValue: 0, duration: 160, useNativeDriver: true }).start();
    });
  };

  const answer = (knewIt: boolean) => {
    haptic(knewIt ? 'success' : 'light');
    if (knewIt) setKnown((k) => [...k, sign]);
    else setUnknown((u) => [...u, sign]);
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  const restart = (signs?: SignId[]) => {
    setDeck(signs?.length ? shuffle(signs) : shuffle(SIGN_IDS).slice(0, ROUND_SIZE));
    setIndex(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
  };

  const rotateY = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] });

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: 'Schilder-Trainer', headerTitle: '' }} />
      <Row gap={Space.sm} style={{ marginTop: Space.sm }}>
        <Txt variant="h1">Schilder-Trainer</Txt>
        <BetaBadge />
      </Row>

      {!finished ? (
        <>
          <Row style={{ justifyContent: 'space-between', marginTop: Space.lg }}>
            <Txt variant="caption" color="textMuted">
              Verkehrszeichen · {index + 1}/{deck.length}
            </Txt>
            <Txt variant="caption" color="textMuted">
              Gewusst: {known.length}
            </Txt>
          </Row>
          <View style={{ marginTop: 6 }}>
            <ProgressBar value={index / deck.length} color={c.teal} />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={flipped ? info.name : 'Karte umdrehen'}
            onPress={flip}
            style={{ marginTop: Space.xl }}>
            <Animated.View
              style={[
                styles.card,
                { backgroundColor: c.surface, borderColor: c.border, transform: [{ perspective: 800 }, { rotateY }] },
              ]}>
              {!flipped ? (
                <>
                  <TrafficSign id={sign} size={170} />
                  <Txt variant="h3" style={{ textAlign: 'center' }}>
                    Was bedeutet dieses Zeichen?
                  </Txt>
                  <Row gap={6}>
                    <Ionicons name="sync-outline" size={16} color={c.textMuted} />
                    <Txt variant="caption" color="textMuted">
                      Tippen zum Umdrehen
                    </Txt>
                  </Row>
                </>
              ) : (
                <>
                  <TrafficSign id={sign} size={96} />
                  <Badge label={info.group} tone="teal" />
                  <Txt variant="h3" style={{ textAlign: 'center' }}>
                    {info.name}
                  </Txt>
                  <Txt style={{ textAlign: 'center' }}>{info.meaning}</Txt>
                </>
              )}
            </Animated.View>
          </Pressable>

          {flipped ? (
            <Row gap={Space.sm} style={{ marginTop: Space.xl }}>
              <Button title="Noch nicht" variant="secondary" icon="refresh" onPress={() => answer(false)} style={{ flex: 1 }} />
              <Button title="Gewusst" icon="checkmark" onPress={() => answer(true)} style={{ flex: 1 }} />
            </Row>
          ) : (
            <Button title="Umdrehen" variant="secondary" icon="sync-outline" onPress={flip} style={{ marginTop: Space.xl }} />
          )}
        </>
      ) : (
        <>
          <Card style={{ alignItems: 'center', gap: Space.sm, marginTop: Space.xl, paddingVertical: Space.xl }}>
            <Txt style={{ fontFamily: Fonts.display, fontSize: 36 }}>
              {known.length}/{deck.length}
            </Txt>
            <Txt variant="h2">{known.length === deck.length ? 'Alle gewusst!' : 'Runde geschafft'}</Txt>
            <Txt color="textMuted" style={{ textAlign: 'center' }}>
              {unknown.length ? 'Wiederhole die Zeichen, die noch nicht sitzen.' : 'Du kennst alle Zeichen dieser Runde.'}
            </Txt>
          </Card>

          {unknown.length > 0 && (
            <Card style={{ marginTop: Space.md, gap: Space.md }}>
              <Txt variant="h3">Noch üben</Txt>
              {unknown.map((id) => (
                <Row key={id} gap={Space.md}>
                  <TrafficSign id={id} size={44} />
                  <Txt variant="small" style={{ flex: 1 }}>
                    {SIGN_INFO[id].name}
                  </Txt>
                </Row>
              ))}
            </Card>
          )}

          <View style={{ gap: Space.sm, marginTop: Space.xl }}>
            {unknown.length > 0 && (
              <Button title={`Diese ${unknown.length} wiederholen`} icon="refresh" onPress={() => restart(unknown)} />
            )}
            <Button title="Neue Runde" variant={unknown.length ? 'secondary' : 'primary'} icon="shuffle" onPress={() => restart()} />
            <Button title="Fertig" variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/lernen'))} />
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 340,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Space.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.md,
  },
});
