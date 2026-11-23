import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { formatDate, parseGermanDate } from '@/lib/dates';
import { Fonts, Radius, Space, useTheme } from '@/theme';

import { Chip, Row, Txt } from './ui';

export const DAILY_GOALS = [10, 20, 30, 50];

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  onBlur,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string | null;
  hint?: string;
  onBlur?: () => void;
  keyboardType?: 'default' | 'numbers-and-punctuation';
}) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Txt variant="label" color="textMuted">
        {label}
      </Txt>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={c.textMuted}
        keyboardType={keyboardType}
        accessibilityLabel={label}
        style={[
          styles.input,
          { color: c.text, backgroundColor: c.surface, borderColor: error ? c.danger : c.border },
        ]}
      />
      {error ? (
        <Txt variant="caption" color="dangerText">
          {error}
        </Txt>
      ) : hint ? (
        <Txt variant="caption" color="textMuted">
          {hint}
        </Txt>
      ) : null}
    </View>
  );
}

/** Eingabe für den Prüfungstermin im Format TT.MM.JJJJ. */
export function useExamDateField(initial: string | null) {
  const [text, setText] = useState(initial ? formatDate(initial) : '');
  const parsed = text.trim() ? parseGermanDate(text) : null;
  const error = text.trim() && !parsed ? 'Bitte im Format TT.MM.JJJJ eingeben.' : null;
  return { text, setText, value: parsed, error };
}

export function GoalPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ gap: 6 }}>
      <Txt variant="label" color="textMuted">
        Tagesziel (Fragen)
      </Txt>
      <Row gap={Space.sm} style={{ flexWrap: 'wrap' }}>
        {DAILY_GOALS.map((g) => (
          <Chip key={g} label={String(g)} selected={value === g} onPress={() => onChange(g)} />
        ))}
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    fontFamily: Fonts.bodySemi,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Space.lg,
    paddingVertical: 14,
  },
});
