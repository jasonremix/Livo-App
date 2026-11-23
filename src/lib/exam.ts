import { QUESTION_BY_ID, QUESTIONS } from '@/data/questions';
import type { Question } from '@/data/types';

import { isCorrect, type UserAnswer } from './grading';
import { sample, shuffle, type Rng } from './random';

/** Aufbau der Theorieprüfung Klasse B (Ersterwerb). */
export const EXAM_CONFIG = {
  basicQuestions: 20,
  classQuestions: 10,
  maxErrorPoints: 10,
  durationMinutes: 45,
} as const;

export const EXAM_SIZE = EXAM_CONFIG.basicQuestions + EXAM_CONFIG.classQuestions;

/** Stellt einen Prüfungsbogen zusammen: 20 Fragen Grundstoff + 10 Fragen Zusatzstoff B. */
export function generateExam(rng: Rng = Math.random, pool: Question[] = QUESTIONS): string[] {
  const basic = pool.filter((q) => q.pool === 'G');
  const classB = pool.filter((q) => q.pool === 'B');
  const picked = [
    ...sample(basic, EXAM_CONFIG.basicQuestions, rng),
    ...sample(classB, EXAM_CONFIG.classQuestions, rng),
  ];
  return shuffle(picked, rng).map((q) => q.id);
}

export interface ExamQuestionResult {
  id: string;
  correct: boolean;
  points: number;
}

export interface ExamScore {
  total: number;
  correctCount: number;
  errorPoints: number;
  wrongFivePointers: number;
  passed: boolean;
  details: ExamQuestionResult[];
}

/**
 * Bewertung wie in der amtlichen Prüfung:
 * nicht bestanden bei mehr als 10 Fehlerpunkten oder zwei falschen 5-Punkte-Fragen.
 */
export function scoreExam(
  questionIds: string[],
  answers: Record<string, UserAnswer | undefined>,
): ExamScore {
  const details = questionIds.map((id) => {
    const q = QUESTION_BY_ID[id];
    return { id, correct: isCorrect(q, answers[id]), points: q.points };
  });
  const wrong = details.filter((d) => !d.correct);
  const errorPoints = wrong.reduce((sum, d) => sum + d.points, 0);
  const wrongFivePointers = wrong.filter((d) => d.points === 5).length;
  return {
    total: details.length,
    correctCount: details.length - wrong.length,
    errorPoints,
    wrongFivePointers,
    passed: errorPoints <= EXAM_CONFIG.maxErrorPoints && wrongFivePointers < 2,
    details,
  };
}

export function failReason(errorPoints: number, wrongFivePointers: number): string | null {
  if (errorPoints > EXAM_CONFIG.maxErrorPoints) return `Mehr als ${EXAM_CONFIG.maxErrorPoints} Fehlerpunkte.`;
  if (wrongFivePointers >= 2) return 'Zwei 5-Punkte-Fragen falsch beantwortet.';
  return null;
}
