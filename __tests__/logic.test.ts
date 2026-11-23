import { QUESTION_BY_ID, QUESTIONS } from '@/data/questions';
import type { ChoiceQuestion, Question } from '@/data/types';
import { addDays, dayKey, streak } from '@/lib/dates';
import { EXAM_SIZE, generateExam, scoreExam } from '@/lib/exam';
import { isCorrect, parseNumberInput, type UserAnswer } from '@/lib/grading';
import { seededRng } from '@/lib/random';
import { applyAnswer, buildTrainingQueue, mistakeIds } from '@/lib/srs';
import { readiness } from '@/lib/stats';

function correctAnswer(q: Question): UserAnswer {
  return q.type === 'choice' ? { selected: [...q.correct] } : { value: String(q.answer) };
}

describe('parseNumberInput', () => {
  it.each([
    ['15', 15],
    [' 1,5 ', 1.5],
    ['1.5', 1.5],
    ['3.500', 3500],
    ['130', 130],
  ])('%s → %d', (raw, expected) => {
    expect(parseNumberInput(raw)).toBe(expected);
  });

  it.each(['', 'abc', '1,5,5', '--3'])('lehnt „%s“ ab', (raw) => {
    expect(parseNumberInput(raw)).toBeNull();
  });
});

describe('isCorrect', () => {
  const multi = QUESTION_BY_ID['gef-01'] as ChoiceQuestion; // zwei richtige Antworten

  it('verlangt alle richtigen und keine falschen Antworten', () => {
    expect(isCorrect(multi, { selected: ['a', 'c'] })).toBe(true);
    expect(isCorrect(multi, { selected: ['a'] })).toBe(false);
    expect(isCorrect(multi, { selected: ['a', 'b', 'c'] })).toBe(false);
    expect(isCorrect(multi, undefined)).toBe(false);
  });

  it('bewertet Zahlenfragen', () => {
    const q = QUESTION_BY_ID['ver-10']; // 1,5 m
    expect(isCorrect(q, { value: '1,5' })).toBe(true);
    expect(isCorrect(q, { value: '2' })).toBe(false);
  });
});

describe('Prüfung', () => {
  it('stellt 20 Grundstoff- und 10 Klasse-B-Fragen ohne Doppelungen zusammen', () => {
    const ids = generateExam(seededRng(42));
    expect(ids).toHaveLength(EXAM_SIZE);
    expect(new Set(ids).size).toBe(EXAM_SIZE);
    expect(ids.filter((id) => QUESTION_BY_ID[id].pool === 'G')).toHaveLength(20);
    expect(ids.filter((id) => QUESTION_BY_ID[id].pool === 'B')).toHaveLength(10);
  });

  const fives = QUESTIONS.filter((q) => q.points === 5).slice(0, 2);
  const fours = QUESTIONS.filter((q) => q.points === 4).slice(0, 2);
  const threes = QUESTIONS.filter((q) => q.points === 3).slice(0, 2);
  const twos = QUESTIONS.filter((q) => q.points === 2).slice(0, 2);
  const all = [...fives, ...fours, ...threes, ...twos];
  const ids = all.map((q) => q.id);
  const answersExcept = (wrong: string[]) =>
    Object.fromEntries(all.filter((q) => !wrong.includes(q.id)).map((q) => [q.id, correctAnswer(q)]));

  it('besteht ohne Fehler', () => {
    const s = scoreExam(ids, answersExcept([]));
    expect(s).toMatchObject({ errorPoints: 0, passed: true, correctCount: all.length });
  });

  it('besteht mit genau 10 Fehlerpunkten ohne zwei 5-Punkte-Fragen', () => {
    const s = scoreExam(ids, answersExcept([fives[0].id, threes[0].id, twos[0].id]));
    expect(s.errorPoints).toBe(10);
    expect(s.passed).toBe(true);
  });

  it('fällt bei zwei falschen 5-Punkte-Fragen durch – obwohl es 10 Punkte sind', () => {
    const s = scoreExam(ids, answersExcept([fives[0].id, fives[1].id]));
    expect(s.errorPoints).toBe(10);
    expect(s.wrongFivePointers).toBe(2);
    expect(s.passed).toBe(false);
  });

  it('fällt bei mehr als 10 Fehlerpunkten durch', () => {
    const s = scoreExam(ids, answersExcept([fours[0].id, fours[1].id, threes[0].id]));
    expect(s.errorPoints).toBe(11);
    expect(s.passed).toBe(false);
  });

  it('wertet unbeantwortete Fragen als falsch', () => {
    const s = scoreExam(ids, {});
    expect(s.correctCount).toBe(0);
    expect(s.passed).toBe(false);
  });
});

describe('Karteikasten', () => {
  it('steigt bei richtigen Antworten auf und fällt bei Fehlern zurück', () => {
    const now = 1_700_000_000_000;
    let p = applyAnswer(undefined, true, now);
    expect(p.box).toBe(1);
    p = applyAnswer(p, true, now);
    expect(p.box).toBe(2);
    expect(p.due).toBeGreaterThan(now);
    p = applyAnswer(p, false, now);
    expect(p).toMatchObject({ box: 0, seen: 3, correct: 2, wrong: 1, due: now });
  });

  it('nimmt Fehler zuerst ins Training', () => {
    const now = Date.now();
    const progress = {
      'vor-01': applyAnswer(undefined, false, now),
      'vor-02': applyAnswer(applyAnswer(undefined, true, now), true, now),
    };
    const queue = buildTrainingQueue(QUESTIONS, progress, 10, now, seededRng(1));
    expect(queue[0]).toBe('vor-01');
    expect(queue).toHaveLength(10);
    expect(queue).not.toContain('vor-02');
    expect(mistakeIds(progress)).toEqual(['vor-01']);
  });
});

describe('Serie & Prüfungsreife', () => {
  it('zählt aufeinanderfolgende Lerntage', () => {
    const today = new Date(2026, 10, 23);
    const activity = {
      [dayKey(today)]: 3,
      [dayKey(addDays(today, -1))]: 5,
      [dayKey(addDays(today, -2))]: 1,
      [dayKey(addDays(today, -4))]: 9,
    };
    expect(streak(activity, today)).toBe(3);
    expect(streak({ [dayKey(addDays(today, -1))]: 2 }, today)).toBe(1);
    expect(streak({}, today)).toBe(0);
  });

  it('liegt zwischen 0 und 100', () => {
    expect(readiness({}, [])).toBe(0);
    const now = Date.now();
    const all = Object.fromEntries(
      QUESTIONS.map((q) => [q.id, applyAnswer(applyAnswer(undefined, true, now), true, now)]),
    );
    const exam = {
      id: 'x',
      finishedAt: now,
      durationSec: 600,
      errorPoints: 0,
      correctCount: 30,
      total: 30,
      passed: true,
      questionIds: [],
      wrongIds: [],
    };
    expect(readiness(all, [])).toBe(65);
    expect(readiness(all, [exam, exam, exam])).toBe(100);
  });
});
