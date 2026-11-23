import type { Question } from '@/data/types';

export interface UserAnswer {
  /** Ausgewählte Antwort-IDs (Multiple Choice) */
  selected?: string[];
  /** Eingetragener Wert (Zahlenfrage) */
  value?: string;
}

/** Akzeptiert „1,5“ und „1.5“ sowie Tausenderpunkte wie „3.500“. */
export function parseNumberInput(raw: string | undefined): number | null {
  if (raw == null) return null;
  let s = raw.trim().replace(/\s/g, '');
  if (!s) return null;
  // „3.500“ → 3500, „1,5“ → 1.5
  if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  s = s.replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  return Number(s);
}

export function isAnswered(question: Question, answer: UserAnswer | undefined): boolean {
  if (!answer) return false;
  if (question.type === 'number') return parseNumberInput(answer.value) !== null;
  return (answer.selected?.length ?? 0) > 0;
}

/**
 * Wie in der amtlichen Prüfung: Eine Frage ist nur richtig, wenn alle richtigen
 * und keine falschen Antworten gewählt wurden.
 */
export function isCorrect(question: Question, answer: UserAnswer | undefined): boolean {
  if (!answer) return false;
  if (question.type === 'number') {
    const n = parseNumberInput(answer.value);
    return n !== null && Math.abs(n - question.answer) < 1e-9;
  }
  const selected = new Set(answer.selected ?? []);
  if (selected.size !== question.correct.length) return false;
  return question.correct.every((id) => selected.has(id));
}

export function formatSolution(question: Question): string {
  if (question.type === 'number') {
    const value = String(question.answer).replace('.', ',');
    return question.unit ? `${value} ${question.unit}` : value;
  }
  return question.options
    .filter((o) => question.correct.includes(o.id))
    .map((o) => o.text)
    .join(' · ');
}
