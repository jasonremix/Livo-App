import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { CATEGORY_BY_ID } from '@/data/categories';
import type { Question } from '@/data/types';
import { isCorrect, type UserAnswer } from '@/lib/grading';
import { Fonts, Radius, Space, useTheme } from '@/theme';

import { TrafficSign } from './TrafficSign';
import { Badge, haptic, Row, Txt } from './ui';

export function QuestionView({
  question,
  answer,
  onChange,
  revealed = false,
}: {
  question: Question;
  answer: UserAnswer | undefined;
  onChange: (answer: UserAnswer) => void;
  revealed?: boolean;
}) {
  const { c } = useTheme();
  const category = CATEGORY_BY_ID[question.category];

  return (
    <View style={{ gap: Space.lg }}>
      <Row gap={Space.sm} style={{ flexWrap: 'wrap' }}>
        <Badge label={category.short} tone="teal" />
        <Badge label={`${question.points} Punkte`} tone={question.points === 5 ? 'primary' : 'neutral'} />
        <Badge label={question.pool === 'G' ? 'Grundstoff' : 'Klasse B'} />
      </Row>

      {question.sign && (
        <View style={[styles.signBox, { backgroundColor: c.surfaceAlt }]}>
          <TrafficSign id={question.sign} size={132} />
        </View>
      )}

      <Txt variant="h3" accessibilityRole="header">
        {question.text}
      </Txt>

      {question.type === 'choice' ? (
        <View style={{ gap: Space.sm }}>
          <Txt variant="caption" color="textMuted">
            Eine oder mehrere Antworten können richtig sein.
          </Txt>
          {question.options.map((opt) => {
            const selected = answer?.selected?.includes(opt.id) ?? false;
            const isRight = question.correct.includes(opt.id);
            let bg = c.surface;
            let border = selected ? c.text : c.border;
            let icon: 'checkbox' | 'square-outline' | 'checkmark-circle' | 'close-circle' = selected
              ? 'checkbox'
              : 'square-outline';
            let iconColor = selected ? c.text : c.textMuted;
            let note: string | null = null;
            if (revealed) {
              if (isRight && selected) {
                bg = c.successSoft;
                border = c.success;
                icon = 'checkmark-circle';
                iconColor = c.success;
              } else if (isRight) {
                border = c.success;
                icon = 'checkmark-circle';
                iconColor = c.success;
                note = 'Richtige Antwort';
              } else if (selected) {
                bg = c.dangerSoft;
                border = c.danger;
                icon = 'close-circle';
                iconColor = c.danger;
                note = 'Falsch';
              }
            }
            return (
              <Pressable
                key={opt.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected, disabled: revealed }}
                accessibilityLabel={opt.text}
                disabled={revealed}
                onPress={() => {
                  haptic();
                  const current = new Set(answer?.selected ?? []);
                  if (current.has(opt.id)) current.delete(opt.id);
                  else current.add(opt.id);
                  onChange({ selected: question.options.map((o) => o.id).filter((id) => current.has(id)) });
                }}
                style={({ pressed }) => [
                  styles.option,
                  { backgroundColor: bg, borderColor: border, borderWidth: selected || revealed ? 2 : 1 },
                  pressed && { opacity: 0.85 },
                ]}>
                <Ionicons name={icon} size={24} color={iconColor} />
                <View style={{ flex: 1 }}>
                  <Txt>{opt.text}</Txt>
                  {note ? (
                    <Txt variant="caption" color={note === 'Falsch' ? 'dangerText' : 'successText'}>
                      {note}
                    </Txt>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={{ gap: Space.sm }}>
          <Txt variant="caption" color="textMuted">
            Trage die Zahl ein.
          </Txt>
          <View
            style={[
              styles.numberBox,
              {
                backgroundColor: c.surface,
                borderColor: revealed ? (isCorrect(question, answer) ? c.success : c.danger) : c.border,
              },
            ]}>
            <TextInput
              value={answer?.value ?? ''}
              onChangeText={(value) => onChange({ value })}
              editable={!revealed}
              keyboardType="decimal-pad"
              inputMode="decimal"
              placeholder="Antwort"
              placeholderTextColor={c.textMuted}
              accessibilityLabel={`Antwort in ${question.unit || 'Zahl'}`}
              style={[styles.numberInput, { color: c.text }]}
              maxLength={8}
            />
            {question.unit ? (
              <Txt variant="bodyStrong" color="textMuted">
                {question.unit}
              </Txt>
            ) : null}
          </View>
          {revealed && (
            <Txt variant="small" color="successText">
              Richtig: {String(question.answer).replace('.', ',')} {question.unit}
            </Txt>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  signBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Space.lg,
    borderRadius: Radius.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    padding: Space.lg,
    borderRadius: Radius.md,
    minHeight: 56,
  },
  numberBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: Radius.md,
    paddingHorizontal: Space.lg,
    gap: Space.sm,
  },
  numberInput: {
    flex: 1,
    fontFamily: Fonts.bodyBold,
    fontSize: 22,
    paddingVertical: Space.md,
  },
});
