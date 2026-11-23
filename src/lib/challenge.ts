/**
 * Tägliche Challenge (Beta): jeden Tag fünf neue Fragen.
 * Mindestens vier richtig bringen 10 Bonus-Credits – einmal pro Tag (wie auf mylivo.app/challenge).
 */
import { QUESTIONS } from '@/data/questions';

import { sample, seededRng } from './random';

export const CHALLENGE_SIZE = 5;
export const CHALLENGE_PASS = 4;
export const CHALLENGE_BONUS = 10;

/** FNV-1a – stabiler 32-Bit-Hash für den Tages-Seed. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Für alle Nutzer am selben Tag dieselben fünf Fragen. */
export function challengeQuestionIds(day: string): string[] {
  return sample(QUESTIONS, CHALLENGE_SIZE, seededRng(hashString(`livo-challenge-${day}`))).map((q) => q.id);
}
