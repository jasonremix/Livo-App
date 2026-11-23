import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QuestionView } from '@/components/QuestionView';
import {
  Button,
  Card,
  EmptyState,
  haptic,
  IconButton,
  ProgressBar,
  ProgressRing,
  Row,
  Screen,
  Txt,
} from '@/components/ui';
import { QUESTION_BY_ID } from '@/data/questions';
import { isAnswered, isCorrect, type UserAnswer } from '@/lib/grading';
import { explainQuestion } from '@/lib/livia';
import { sendToLivia } from '@/lib/livia-chat';
import { buildSession, type QuizMode } from '@/lib/sessions';
import { useLivoStore } from '@/store/useLivoStore';
import { Fonts, MAX_CONTENT_WIDTH, Space, useTheme } from '@/theme';

interface Result {
  id: string;
  correct: boolean;
}

function close() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export default function Quiz() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: QuizMode; id?: string }>();
  const mode = params.mode ?? 'training';
  const [session] = useState(() => buildSession(mode, params.id, useLivoStore.getState()));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<UserAnswer | undefined>();
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [earned, setEarned] = useState(0);
  const [lastEarned, setLastEarned] = useState(0);
  const [finished, setFinished] = useState(false);

  const recordAnswer = useLivoStore((s) => s.recordAnswer);
  const toggleMark = useLivoStore((s) => s.toggleMark);
  const completeModule = useLivoStore((s) => s.completeModule);
  const marked = useLivoStore((s) => s.marked);

  if (!session.ids.length) {
    return (
      <Screen edges={['top', 'bottom']}>
        <Row style={{ justifyContent: 'flex-end' }}>
          <IconButton icon="close" label="Schließen" onPress={close} />
        </Row>
        <EmptyState
          icon="checkmark-done-outline"
          title="Hier gibt es gerade nichts zu üben"
          text="Sobald du Fragen falsch beantwortest oder markierst, findest du sie hier wieder."
          action={<Button title="Zum Training" onPress={() => router.replace({ pathname: '/quiz', params: { mode: 'training' } })} />}
        />
      </Screen>
    );
  }

  const question = QUESTION_BY_ID[session.ids[index]];
  const total = session.ids.length;

  const check = () => {
    const correct = isCorrect(question, answer);
    const credits = recordAnswer(question.id, correct);
    haptic(correct ? 'success' : 'error');
    setLastEarned(credits);
    setEarned((e) => e + credits);
    setResults((r) => [...r, { id: question.id, correct }]);
    setRevealed(true);
  };

  const next = () => {
    if (index + 1 >= total) {
      if (mode === 'module' && params.id) completeModule(params.id);
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setAnswer(undefined);
    setRevealed(false);
  };

  if (finished) {
    const right = results.filter((r) => r.correct).length;
    const wrong = results.filter((r) => !r.correct).map((r) => r.id);
    const pct = right / total;
    return (
      <Screen edges={['top', 'bottom']}>
        <Row style={{ justifyContent: 'flex-end' }}>
          <IconButton icon="close" label="Schließen" onPress={close} />
        </Row>
        <View style={{ alignItems: 'center', gap: Space.md, marginTop: Space.lg }}>
          <ProgressRing value={pct} size={150} stroke={14} color={pct >= 0.8 ? c.success : c.primary}>
            <Txt style={{ fontFamily: Fonts.display, fontSize: 30 }}>
              {right}/{total}
            </Txt>
          </ProgressRing>
          <Txt variant="h1" style={{ textAlign: 'center' }}>
            {pct === 1 ? 'Perfekt!' : pct >= 0.8 ? 'Stark gemacht!' : pct >= 0.5 ? 'Guter Fortschritt' : 'Dranbleiben!'}
          </Txt>
          <Txt color="textMuted" style={{ textAlign: 'center' }}>
            {session.title} abgeschlossen{mode === 'module' ? ' – Modul als erledigt markiert.' : '.'}
          </Txt>
          {earned > 0 && (
            <Row gap={6}>
              <Ionicons name="star" size={18} color="#c79a00" />
              <Txt variant="bodyStrong">+{earned} Credits</Txt>
            </Row>
          )}
        </View>

        {wrong.length > 0 && (
          <Card style={{ marginTop: Space.xl, gap: Space.sm }}>
            <Txt variant="h3">Diese Fragen solltest du wiederholen</Txt>
            {wrong.map((id) => (
              <Row key={id} gap={Space.sm} style={{ alignItems: 'flex-start' }}>
                <Ionicons name="close-circle" size={18} color={c.danger} style={{ marginTop: 2 }} />
                <Txt variant="small" style={{ flex: 1 }}>
                  {QUESTION_BY_ID[id].text}
                </Txt>
              </Row>
            ))}
          </Card>
        )}

        <View style={{ gap: Space.sm, marginTop: Space.xl }}>
          {wrong.length > 0 && (
            <Button
              title="Fehler direkt üben"
              icon="refresh"
              onPress={() => router.replace({ pathname: '/quiz', params: { mode: 'ids', id: wrong.join(',') } })}
            />
          )}
          <Button
            title="Neue Trainingsrunde"
            variant={wrong.length ? 'secondary' : 'primary'}
            icon="flash-outline"
            onPress={() => router.replace({ pathname: '/quiz', params: { mode: 'training' } })}
          />
          <Button title="Fertig" variant="ghost" onPress={close} />
        </View>
      </Screen>
    );
  }

  const correctNow = revealed && results[results.length - 1]?.correct;
  const isMarked = marked.includes(question.id);

  const footer = (
    <View style={[styles.footer, { borderTopColor: c.border, backgroundColor: c.bg, paddingBottom: Space.md + insets.bottom }]}>
      <View style={styles.footerInner}>
        {revealed ? (
          <Button
            title={index + 1 >= total ? 'Ergebnis anzeigen' : 'Weiter'}
            iconRight="arrow-forward"
            onPress={next}
          />
        ) : (
          <Button title="Antwort prüfen" onPress={check} disabled={!isAnswered(question, answer)} />
        )}
      </View>
    </View>
  );

  return (
    <Screen edges={['top']} footer={footer}>
      <Row gap={Space.md}>
        <IconButton icon="close" label="Training beenden" onPress={close} />
        <View style={{ flex: 1, gap: 6 }}>
          <Txt variant="caption" color="textMuted">
            {session.title} · Frage {index + 1} von {total}
          </Txt>
          <ProgressBar value={(index + (revealed ? 1 : 0)) / total} />
        </View>
        <IconButton
          icon={isMarked ? 'bookmark' : 'bookmark-outline'}
          color={isMarked ? c.tealText : undefined}
          label={isMarked ? 'Markierung entfernen' : 'Frage markieren'}
          onPress={() => toggleMark(question.id)}
        />
      </Row>

      <View style={{ marginTop: Space.xl }}>
        <QuestionView key={question.id} question={question} answer={answer} onChange={setAnswer} revealed={revealed} />
      </View>

      {revealed && (
        <View style={{ gap: Space.md, marginTop: Space.xl }}>
          <View
            style={[styles.feedback, { backgroundColor: correctNow ? c.successSoft : c.dangerSoft }]}
            accessibilityLiveRegion="polite">
            <Ionicons
              name={correctNow ? 'checkmark-circle' : 'close-circle'}
              size={26}
              color={correctNow ? c.success : c.danger}
            />
            <View style={{ flex: 1 }}>
              <Txt variant="bodyStrong" color={correctNow ? 'successText' : 'dangerText'}>
                {correctNow ? 'Richtig!' : 'Leider falsch'}
              </Txt>
              <Txt variant="small" color={correctNow ? 'successText' : 'dangerText'}>
                {correctNow
                  ? lastEarned
                    ? `+${lastEarned} Credits`
                    : 'Credits für diese Frage hast du schon erhalten.'
                  : `In der Prüfung wären das ${question.points} Fehlerpunkte.`}
              </Txt>
            </View>
          </View>

          <Card tone="teal">
            <Row gap={Space.sm}>
              <Ionicons name="sparkles" size={18} color={c.tealText} />
              <Txt variant="label" color="tealText">
                Livia erklärt
              </Txt>
            </Row>
            <Txt style={{ marginTop: Space.sm }}>{question.explanation}</Txt>
            <Button
              title="Frag Livia"
              variant="secondary"
              small
              icon="chatbubble-ellipses-outline"
              style={{ marginTop: Space.md, alignSelf: 'flex-start' }}
              onPress={() => {
                sendToLivia(`Erklär mir bitte diese Frage: „${question.text}“`, {
                  questionId: question.id,
                  offlineAnswer: explainQuestion(question, answer),
                });
                router.push('/livia');
              }}
            />
          </Card>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: Space.md, paddingHorizontal: Space.lg, alignItems: 'center' },
  footerInner: { width: '100%', maxWidth: MAX_CONTENT_WIDTH - Space.lg * 2 },
  feedback: { flexDirection: 'row', alignItems: 'center', gap: Space.md, padding: Space.lg, borderRadius: 14 },
});
