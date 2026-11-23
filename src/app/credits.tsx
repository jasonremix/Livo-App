import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { Button, Card, Divider, ProgressBar, Row, Screen, SectionHeader, Txt, type IconName } from '@/components/ui';
import { QUESTIONS } from '@/data/questions';
import { CREDITS_PER_CORRECT_ANSWER, REWARDS } from '@/data/rewards';
import type { Reward } from '@/data/types';
import { LINKS, openLink } from '@/lib/links';
import { useLivoStore } from '@/store/useLivoStore';
import { Fonts, Space, useTheme } from '@/theme';

const KIND_ICON: Record<Reward['kind'], IconName> = {
  discount: 'pricetag-outline',
  plus: 'sparkles-outline',
  payout: 'cash-outline',
};

export default function Credits() {
  const { c } = useTheme();
  const credits = useLivoStore((s) => s.credits);
  const creditedIds = useLivoStore((s) => s.creditedIds);
  const openQuestions = QUESTIONS.filter((q) => !creditedIds.includes(q.id)).length;

  return (
    <Screen edges={[]}>
      <Card tone="alt" style={{ alignItems: 'center', gap: Space.sm, paddingVertical: Space.xl }}>
        <Ionicons name="star" size={36} color="#c79a00" />
        <Txt style={{ fontFamily: Fonts.display, fontSize: 40, lineHeight: 48 }}>{credits}</Txt>
        <Txt color="textMuted">Credits gesammelt</Txt>
      </Card>

      <Card style={{ marginTop: Space.md, gap: Space.sm }}>
        <Txt variant="h3">Lernen zahlt sich aus</Txt>
        <Txt variant="small" color="textMuted">
          Für jede richtig beantwortete Frage bekommst du {CREDITS_PER_CORRECT_ANSWER} Credits – einmal pro Frage. In
          der App kannst du noch {openQuestions * CREDITS_PER_CORRECT_ANSWER} Credits mit {openQuestions} Fragen
          sammeln.
        </Txt>
      </Card>

      <SectionHeader title="Prämien" />
      <Card style={{ paddingVertical: Space.xs }}>
        {REWARDS.map((r, i) => {
          const reached = credits >= r.cost;
          return (
            <View key={r.id}>
              {i > 0 && <Divider />}
              <View style={{ paddingVertical: Space.md, gap: Space.sm }}>
                <Row gap={Space.md}>
                  <Ionicons name={KIND_ICON[r.kind]} size={20} color={reached ? c.successText : c.textMuted} />
                  <Txt variant="bodyStrong" style={{ flex: 1 }}>
                    {r.title}
                  </Txt>
                  <Txt variant="small" color={reached ? 'successText' : 'textMuted'}>
                    {reached ? 'Erreicht' : `${r.cost} Credits`}
                  </Txt>
                </Row>
                <ProgressBar value={credits / r.cost} color={reached ? c.success : c.warning} height={6} />
              </View>
            </View>
          );
        })}
      </Card>

      <Button
        title="Prämien auf mylivo.app ansehen"
        icon="open-outline"
        variant="secondary"
        onPress={() => openLink(LINKS.credits)}
        style={{ marginTop: Space.xl }}
      />
      <Txt variant="caption" color="textMuted" style={{ marginTop: Space.md, textAlign: 'center' }}>
        Credits sind nicht übertragbar und nicht handelbar. Auszahlungen erfolgen nach manueller Prüfung per
        SEPA-Überweisung über mylivo.app.
      </Txt>
    </Screen>
  );
}
