/**
 * Express-Modus (Beta): Wenn die Prüfung kurz bevorsteht, zählt jede Minute.
 * Priorisiert werden 5- und 4-Punkte-Fragen, die noch nicht sicher sitzen, und offene Fehler.
 */
import { QUESTIONS } from '@/data/questions';
import type { Question } from '@/data/types';

import { daysBetween, parseDayKey } from './dates';
import { shuffle, type Rng } from './random';
import { MASTERED_BOX, type QuestionProgress } from './srs';

export const EXPRESS_DAYS = 7;
export const EXPRESS_SIZE = 20;
const MAX_PER_CATEGORY = 6;

export function daysUntilExam(examDate: string | null, today: Date = new Date()): number | null {
  if (!examDate) return null;
  return daysBetween(today, parseDayKey(examDate));
}

/** Express wird hervorgehoben, wenn die Prüfung in höchstens 7 Tagen ist. */
export function isExpressTime(examDate: string | null, today: Date = new Date()): boolean {
  const days = daysUntilExam(examDate, today);
  return days !== null && days >= 0 && days <= EXPRESS_DAYS;
}

/** Je höher, desto dringender sollte die Frage vor der Prüfung noch geübt werden. */
export function expressPriority(q: Question, p: QuestionProgress | undefined): number {
  let score = q.points * 10;
  if (!p) return score + 15; // noch nie gesehen
  if (p.box === 0 && p.wrong > 0) score += 40; // zuletzt falsch
  else if (p.box < MASTERED_BOX) score += 20; // noch unsicher
  else score -= 60 + p.box * 10; // sitzt bereits
  return score;
}

export function buildExpressQueue(
  progress: Record<string, QuestionProgress>,
  size = EXPRESS_SIZE,
  rng: Rng = Math.random,
  pool: Question[] = QUESTIONS,
): string[] {
  // Zufällige Reihenfolge als Tie-Breaker, dann stabil nach Priorität sortieren
  const ranked = shuffle(pool, rng)
    .map((q) => ({ q, score: expressPriority(q, progress[q.id]) }))
    .sort((a, b) => b.score - a.score);
  const perCategory: Record<string, number> = {};
  const picked: string[] = [];
  for (const { q } of ranked) {
    if (picked.length >= size) break;
    if ((perCategory[q.category] ?? 0) >= MAX_PER_CATEGORY) continue;
    perCategory[q.category] = (perCategory[q.category] ?? 0) + 1;
    picked.push(q.id);
  }
  // Falls die Kategorie-Grenze zu wenige Fragen übrig lässt: auffüllen
  for (const { q } of ranked) {
    if (picked.length >= size) break;
    if (!picked.includes(q.id)) picked.push(q.id);
  }
  return picked;
}

export type ExpressTaskId = 'express' | 'exam' | 'mistakes' | 'cheatsheet';

export interface ExpressTask {
  id: ExpressTaskId;
  title: string;
  target: number;
  done: number;
}

export interface ExpressToday {
  expressRounds: number;
  exams: number;
  mistakesOpen: number;
  cheatSheet: boolean;
}

/** Tagesplan je nach verbleibenden Tagen bis zur Prüfung. */
export function expressPlan(daysLeft: number | null, today: ExpressToday): ExpressTask[] {
  const cheat: ExpressTask = { id: 'cheatsheet', title: 'Spickzettel durchgehen', target: 1, done: today.cheatSheet ? 1 : 0 };
  if (daysLeft === 0) return [cheat];
  if (daysLeft !== null && daysLeft <= 3) {
    return [
      { id: 'express', title: 'Express-Runde (20 Fragen)', target: 1, done: Math.min(1, today.expressRounds) },
      { id: 'exam', title: 'Prüfungssimulationen', target: 2, done: Math.min(2, today.exams) },
      { id: 'mistakes', title: 'Alle offenen Fehler wiederholen', target: 1, done: today.mistakesOpen === 0 ? 1 : 0 },
      cheat,
    ];
  }
  return [
    { id: 'express', title: 'Express-Runden (je 20 Fragen)', target: 2, done: Math.min(2, today.expressRounds) },
    { id: 'exam', title: 'Prüfungssimulation', target: 1, done: Math.min(1, today.exams) },
    cheat,
  ];
}
