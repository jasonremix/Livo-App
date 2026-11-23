jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import { QUESTION_BY_ID, QUESTIONS } from '@/data/questions';
import { SIGN_IDS, SIGN_INFO } from '@/data/signs';
import { CHALLENGE_BONUS, challengeQuestionIds } from '@/lib/challenge';
import { addDays, dayKey } from '@/lib/dates';
import { buildExpressQueue, daysUntilExam, expressPlan, isExpressTime } from '@/lib/express';
import { maskNumber, parseClasses, parseLicenseText } from '@/lib/license';
import { seededRng } from '@/lib/random';
import { applyAnswer } from '@/lib/srs';
import { initialState, useLivoStore } from '@/store/useLivoStore';

describe('Express-Modus', () => {
  const today = new Date(2026, 10, 23);

  it('erkennt, wann die Prüfung kurz bevorsteht', () => {
    expect(daysUntilExam(null, today)).toBeNull();
    expect(isExpressTime(dayKey(addDays(today, 3)), today)).toBe(true);
    expect(isExpressTime(dayKey(addDays(today, 7)), today)).toBe(true);
    expect(isExpressTime(dayKey(addDays(today, 8)), today)).toBe(false);
    expect(isExpressTime(dayKey(addDays(today, -1)), today)).toBe(false);
  });

  it('priorisiert offene Fehler und schwere Fragen, lässt sichere Fragen weg', () => {
    const now = Date.now();
    const mastered = applyAnswer(applyAnswer(applyAnswer(undefined, true, now), true, now), true, now);
    const progress: Record<string, ReturnType<typeof applyAnswer>> = {};
    // alle 5-Punkte-Fragen sicher, eine 2-Punkte-Frage zuletzt falsch
    for (const q of QUESTIONS.filter((x) => x.points === 5)) progress[q.id] = mastered;
    const twoPointer = QUESTIONS.find((q) => q.points === 2)!;
    progress[twoPointer.id] = applyAnswer(undefined, false, now);

    const queue = buildExpressQueue(progress, 20, seededRng(3));
    expect(queue).toHaveLength(20);
    expect(new Set(queue).size).toBe(20);
    expect(queue).toContain(twoPointer.id);
    for (const id of queue) expect(progress[id]).not.toBe(mastered);
  });

  it('nimmt ohne Fortschritt zuerst 5-Punkte-Fragen und mischt die Themen', () => {
    const queue = buildExpressQueue({}, 20, seededRng(9));
    expect(QUESTION_BY_ID[queue[0]].points).toBe(5);
    const perCategory: Record<string, number> = {};
    for (const id of queue) perCategory[QUESTION_BY_ID[id].category] = (perCategory[QUESTION_BY_ID[id].category] ?? 0) + 1;
    expect(Math.max(...Object.values(perCategory))).toBeLessThanOrEqual(6);
  });

  it('passt den Tagesplan an die verbleibenden Tage an', () => {
    const none = { expressRounds: 0, exams: 0, mistakesOpen: 2, cheatSheet: false };
    expect(expressPlan(0, none).map((t) => t.id)).toEqual(['cheatsheet']);
    expect(expressPlan(2, none).map((t) => t.id)).toEqual(['express', 'exam', 'mistakes', 'cheatsheet']);
    const week = expressPlan(6, { ...none, expressRounds: 5, exams: 1, cheatSheet: true });
    expect(week.every((t) => t.done === t.target)).toBe(true);
  });
});

describe('Tages-Challenge', () => {
  it('liefert pro Tag dieselben fünf verschiedenen Fragen', () => {
    const a = challengeQuestionIds('2026-11-23');
    expect(a).toEqual(challengeQuestionIds('2026-11-23'));
    expect(new Set(a).size).toBe(5);
    expect(challengeQuestionIds('2026-11-24')).not.toEqual(a);
    for (const id of a) expect(QUESTION_BY_ID[id]).toBeDefined();
  });

  it('vergibt den Bonus nur ab 4 richtigen und nur einmal pro Tag', () => {
    useLivoStore.setState({ ...initialState });
    const { completeChallenge } = useLivoStore.getState();
    expect(completeChallenge(3, 5)).toBe(0);
    expect(useLivoStore.getState().credits).toBe(0);
    expect(completeChallenge(4, 5)).toBe(CHALLENGE_BONUS);
    expect(completeChallenge(5, 5)).toBe(0);
    const s = useLivoStore.getState();
    expect(s.credits).toBe(CHALLENGE_BONUS);
    expect(s.challenges[dayKey()]).toMatchObject({ correct: 5, rewarded: true });
  });
});

describe('Führerschein-Scanner', () => {
  const sample = [
    'FÜHRERSCHEIN',
    'BUNDESREPUBLIK DEUTSCHLAND',
    '1. MUSTERMANN',
    '2. ERIKA',
    '3. 12.08.1990 BERLIN',
    '4a. 01.03.2021 4c. Landratsamt Musterstadt',
    '4b. 28.02.2036',
    '5. J010000SF21',
    '9. AM/B/L',
  ].join('\n');

  it('liest die Felder des Kartenführerscheins', () => {
    expect(parseLicenseText(sample)).toEqual({
      surname: 'MUSTERMANN',
      givenNames: 'ERIKA',
      birth: '12.08.1990 BERLIN',
      issued: '2021-03-01',
      expires: '2036-02-28',
      authority: 'Landratsamt Musterstadt',
      number: 'J010000SF21',
      classes: ['AM', 'B', 'L'],
    });
  });

  it('verträgt typische OCR-Ungenauigkeiten', () => {
    const noisy = '1, MUSTERMANN\n4b: 28,02,2036';
    const r = parseLicenseText(noisy);
    expect(r.surname).toBe('MUSTERMANN');
    expect(r.expires).toBe('2036-02-28');
    expect(parseLicenseText('Klassen: AM / BE / L').classes).toEqual(['AM', 'BE', 'L']);
    expect(parseClasses('am/b/be/c1e/xx')).toEqual(['AM', 'B', 'BE', 'C1E']);
  });

  it('liefert leere Klassen, wenn nichts erkannt wird', () => {
    expect(parseLicenseText('Einkaufszettel: Milch, Brot').classes).toEqual([]);
  });

  it('maskiert die Führerscheinnummer', () => {
    expect(maskNumber('J010000SF21')).toBe('J0•••••••21');
  });
});

describe('Schilder-Trainer', () => {
  it('hat zu jedem Zeichen eine Erklärung', () => {
    expect(SIGN_IDS.length).toBeGreaterThanOrEqual(20);
    for (const id of SIGN_IDS) expect(SIGN_INFO[id].meaning.length).toBeGreaterThan(20);
  });
});

describe('OCR-Bridge', () => {
  const { createOcrBridge, buildOcrHtml } = require('@/lib/ocr-html') as typeof import('@/lib/ocr-html');

  it('puffert Anfragen, bis die Seite bereit ist, und ordnet Ergebnisse zu', async () => {
    const sent: string[] = [];
    const bridge = createOcrBridge();
    const promise = bridge.recognize('data:image/jpeg;base64,AAAA');
    bridge.setSender((m) => sent.push(m));
    expect(sent).toHaveLength(0); // Seite noch nicht bereit
    bridge.handle(JSON.stringify({ type: 'ready' }));
    expect(sent).toHaveLength(1);
    const { id } = JSON.parse(sent[0]);
    bridge.handle(JSON.stringify({ type: 'result', id, text: '9. AM/B/L', confidence: 88 }));
    await expect(promise).resolves.toEqual({ text: '9. AM/B/L', confidence: 88 });
  });

  it('meldet Ladefehler (z. B. offline) an alle wartenden Anfragen', async () => {
    const bridge = createOcrBridge();
    bridge.setSender(() => {});
    const promise = bridge.recognize('x');
    bridge.handle(JSON.stringify({ type: 'error', message: 'offline' }));
    await expect(promise).rejects.toThrow('offline');
    await expect(bridge.recognize('y')).rejects.toThrow('offline');
  });

  it('lädt tesseract.js mit festen Versionen und deutschem Sprachpaket', () => {
    const html = buildOcrHtml();
    expect(html).toContain('tesseract.js@7.0.0/dist/tesseract.min.js');
    expect(html).toContain('@tesseract.js-data/deu/4.0.0_best_int');
  });
});
