import { CATEGORY_BY_ID } from '@/data/categories';
import { COURSES } from '@/data/courses';
import { LIVIA_FAQ } from '@/data/livia-faq';
import { QUESTION_BY_ID, QUESTIONS } from '@/data/questions';
import { SIGN_NAMES } from '@/data/signs';
import { EXAM_CONFIG } from '@/lib/exam';

describe('Fragenkatalog', () => {
  it('hat eindeutige IDs', () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
  });

  it('enthält genug Fragen für eine vollständige Prüfung', () => {
    expect(QUESTIONS.filter((q) => q.pool === 'G').length).toBeGreaterThanOrEqual(EXAM_CONFIG.basicQuestions);
    expect(QUESTIONS.filter((q) => q.pool === 'B').length).toBeGreaterThanOrEqual(EXAM_CONFIG.classQuestions);
  });

  it.each(QUESTIONS.map((q) => [q.id, q] as const))('%s ist gültig', (_id, q) => {
    expect(CATEGORY_BY_ID[q.category]).toBeDefined();
    expect([2, 3, 4, 5]).toContain(q.points);
    expect(q.text.length).toBeGreaterThan(10);
    expect(q.explanation.length).toBeGreaterThan(40);
    if (q.sign) expect(SIGN_NAMES[q.sign]).toBeDefined();
    if (q.type === 'choice') {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correct.length).toBeGreaterThanOrEqual(1);
      expect(q.correct.length).toBeLessThan(q.options.length);
      const ids = q.options.map((o) => o.id);
      for (const c of q.correct) expect(ids).toContain(c);
    } else {
      expect(Number.isFinite(q.answer)).toBe(true);
    }
  });
});

describe('Kurse', () => {
  it('bilden die vier Kurse mit je drei Modulen ab', () => {
    expect(COURSES).toHaveLength(4);
    for (const c of COURSES) expect(c.modules).toHaveLength(3);
  });

  it('verweisen nur auf existierende Fragen und Zeichen', () => {
    for (const c of COURSES) {
      for (const m of c.modules) {
        expect(m.quiz.length).toBeGreaterThan(0);
        for (const id of m.quiz) expect(QUESTION_BY_ID[id]).toBeDefined();
        for (const s of m.sections) for (const sign of s.signs ?? []) expect(SIGN_NAMES[sign]).toBeDefined();
      }
    }
  });
});

describe('Livia-FAQ', () => {
  it('verweist nur auf existierende Fragen', () => {
    for (const f of LIVIA_FAQ) for (const id of f.related ?? []) expect(QUESTION_BY_ID[id]).toBeDefined();
  });
});
