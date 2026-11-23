import type { Question } from '@/data/types';

import { DAY } from './dates';
import { shuffle, type Rng } from './random';

/** Lernfortschritt einer Frage nach dem Karteikasten-Prinzip (Leitner). */
export interface QuestionProgress {
  box: number;
  seen: number;
  correct: number;
  wrong: number;
  last: number;
  due: number;
}

/** Wiederholungsabstände in Tagen pro Fach. */
export const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30] as const;
export const MAX_BOX = BOX_INTERVAL_DAYS.length - 1;
/** Ab diesem Fach gilt eine Frage als „sicher“. */
export const MASTERED_BOX = 2;

export function applyAnswer(
  prev: QuestionProgress | undefined,
  correct: boolean,
  now: number = Date.now(),
): QuestionProgress {
  const base: QuestionProgress = prev ?? { box: 0, seen: 0, correct: 0, wrong: 0, last: 0, due: 0 };
  const box = correct ? Math.min(base.box + 1, MAX_BOX) : 0;
  return {
    box,
    seen: base.seen + 1,
    correct: base.correct + (correct ? 1 : 0),
    wrong: base.wrong + (correct ? 0 : 1),
    last: now,
    due: now + BOX_INTERVAL_DAYS[box] * DAY,
  };
}

export function isMastered(p: QuestionProgress | undefined): boolean {
  return !!p && p.box >= MASTERED_BOX;
}

/** Fragen, die zuletzt falsch beantwortet wurden. */
export function mistakeIds(progress: Record<string, QuestionProgress>): string[] {
  return Object.entries(progress)
    .filter(([, p]) => p.box === 0 && p.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .map(([id]) => id);
}

/**
 * Stellt eine Trainingsrunde zusammen:
 * 1. zuletzt falsch beantwortete Fragen, 2. fällige Wiederholungen,
 * 3. neue Fragen, 4. Auffüllen mit den unsichersten Fragen.
 */
export function buildTrainingQueue(
  questions: Question[],
  progress: Record<string, QuestionProgress>,
  size = 15,
  now: number = Date.now(),
  rng: Rng = Math.random,
): string[] {
  const queue: string[] = [];
  const add = (ids: string[]) => {
    for (const id of ids) {
      if (queue.length >= size) return;
      if (!queue.includes(id)) queue.push(id);
    }
  };
  const ids = questions.map((q) => q.id);
  const seen = ids.filter((id) => progress[id]);

  add(seen.filter((id) => progress[id].box === 0).sort((a, b) => progress[b].wrong - progress[a].wrong));
  add(seen.filter((id) => progress[id].due <= now).sort((a, b) => progress[a].due - progress[b].due));
  add(shuffle(ids.filter((id) => !progress[id]), rng));
  add(shuffle(seen, rng).sort((a, b) => progress[a].box - progress[b].box));
  return queue;
}
