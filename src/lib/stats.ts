import { QUESTIONS } from '@/data/questions';
import type { CategoryId, Question } from '@/data/types';

import type { UserAnswer } from './grading';
import { isMastered, type QuestionProgress } from './srs';

export interface ExamRecord {
  id: string;
  finishedAt: number;
  durationSec: number;
  errorPoints: number;
  correctCount: number;
  total: number;
  passed: boolean;
  questionIds: string[];
  wrongIds: string[];
  answers?: Record<string, UserAnswer>;
}

export interface ProgressStats {
  total: number;
  seen: number;
  mastered: number;
  answers: number;
  accuracy: number; // 0..1
}

export function progressStats(
  progress: Record<string, QuestionProgress>,
  questions: Question[] = QUESTIONS,
): ProgressStats {
  let seen = 0;
  let mastered = 0;
  let answers = 0;
  let correct = 0;
  for (const q of questions) {
    const p = progress[q.id];
    if (!p) continue;
    seen++;
    if (isMastered(p)) mastered++;
    answers += p.seen;
    correct += p.correct;
  }
  return {
    total: questions.length,
    seen,
    mastered,
    answers,
    accuracy: answers ? correct / answers : 0,
  };
}

export function categoryStats(category: CategoryId, progress: Record<string, QuestionProgress>) {
  return progressStats(
    progress,
    QUESTIONS.filter((q) => q.category === category),
  );
}

/**
 * Prüfungsreife in Prozent:
 * 65 % aus dem Anteil sicher beherrschter Fragen, 35 % aus den letzten drei Simulationen.
 */
export function readiness(progress: Record<string, QuestionProgress>, exams: ExamRecord[]): number {
  const { mastered, total } = progressStats(progress);
  const mastery = total ? mastered / total : 0;
  const recent = exams.slice(0, 3);
  const examScore = recent.length
    ? recent.reduce((s, e) => s + (e.passed ? 1 : Math.max(0, 1 - e.errorPoints / 30)), 0) /
      recent.length
    : 0;
  return Math.round(100 * (0.65 * mastery + 0.35 * examScore));
}
