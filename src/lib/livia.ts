/**
 * Livia offline: eine kleine Suchmaschine über die Livo-Wissensbasis
 * (kuratierte FAQ, Kursinhalte und Erklärungen zu allen Übungsfragen).
 * Wenn ein Livia-Server konfiguriert ist, antwortet stattdessen die KI (siehe livia-client.ts).
 */
import { COURSES } from '@/data/courses';
import { LIVIA_FAQ } from '@/data/livia-faq';
import { QUESTION_BY_ID, QUESTIONS } from '@/data/questions';
import type { Question } from '@/data/types';

import { formatSolution, type UserAnswer } from './grading';

export interface LiviaReply {
  text: string;
  related: string[];
  source: 'offline' | 'ai';
}

const STOPWORDS = new Set(
  (
    'der die das dem den des ein eine einer eines einem einen und oder aber ist sind bin bist war ' +
    'was wie wo wann warum wer welche welcher welches welchen ich du er sie es wir ihr man mir mich ' +
    'dir dich mein dein muss musst muessen darf darfst duerfen kann kannst koennen soll sollte ' +
    'sollen bei mit von zu zum zur im in an am auf aus fuer ueber unter vor nach nicht kein keine ' +
    'noch schon auch nur mal denn dann also so sehr gibt hat habe haben wird werden wenn ob dass ' +
    'mehr viel viele wieviel genau eigentlich bitte erklaer erklaere erklaeren livia hallo frage ' +
    'fragen sagen sag mache machen macht richtig gilt gelten heisst bedeutet bedeutung'
  ).split(' '),
);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9,+ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stem(token: string): string {
  if (token.length <= 5) return token;
  for (const suffix of ['en', 'er', 'es', 'e', 'n', 's']) {
    if (token.endsWith(suffix)) return token.slice(0, -suffix.length);
  }
  return token;
}

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t))
    .map(stem);
}

interface KbEntry {
  kind: 'faq' | 'lesson' | 'question';
  title: string;
  phrases: string[]; // normalisierte Mehrwort-Schlüsselbegriffe
  keys: string[]; // gestemmte Schlüsselwörter
  body: Set<string>;
  answer: string;
  related: string[];
}

function buildIndex(): KbEntry[] {
  const entries: KbEntry[] = [];
  for (const f of LIVIA_FAQ) {
    entries.push({
      kind: 'faq',
      title: f.title,
      phrases: f.keywords.filter((k) => k.includes(' ')).map(normalize),
      keys: [...f.keywords.flatMap(tokenize), ...tokenize(f.title)],
      body: new Set(tokenize(f.answer)),
      answer: f.answer,
      related: f.related ?? [],
    });
  }
  for (const course of COURSES) {
    for (const mod of course.modules) {
      for (const s of mod.sections) {
        entries.push({
          kind: 'lesson',
          title: `${s.heading} (Kurs „${course.title}“)`,
          phrases: [],
          keys: tokenize(s.heading),
          body: new Set(tokenize(s.body)),
          answer: `${s.heading}: ${s.body}`,
          related: mod.quiz.slice(0, 2),
        });
      }
    }
  }
  for (const q of QUESTIONS) {
    entries.push({
      kind: 'question',
      title: q.text,
      phrases: [],
      keys: tokenize(q.text),
      body: new Set(tokenize(q.explanation)),
      answer: q.explanation,
      related: [q.id],
    });
  }
  return entries;
}

let INDEX: KbEntry[] | null = null;
function index(): KbEntry[] {
  INDEX ??= buildIndex();
  return INDEX;
}

function fuzzyEqual(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length >= 4 && b.includes(a)) return true;
  if (b.length >= 4 && a.includes(b)) return true;
  return false;
}

function score(entry: KbEntry, normalizedQuery: string, queryTokens: string[]): number {
  let s = 0;
  for (const p of entry.phrases) if (normalizedQuery.includes(p)) s += 6;
  for (const q of queryTokens) {
    let best = 0;
    for (const k of entry.keys) {
      if (k === q) best = Math.max(best, 4);
      else if (fuzzyEqual(q, k)) best = Math.max(best, 2.5);
    }
    if (!best && entry.body.has(q)) best = 0.75;
    s += best;
  }
  const weight = entry.kind === 'faq' ? 1.25 : entry.kind === 'lesson' ? 1 : 0.9;
  return s * weight;
}

const SUGGESTIONS = 'Vorfahrt, Bremsweg, Kreisverkehr, Überholen, Parken, Alkohol, Nebel oder Probezeit';

export function answerOffline(question: string): LiviaReply {
  const normalized = normalize(question);
  if (!normalized) {
    return { text: `Frag mich etwas zu Verkehrsregeln – zum Beispiel zu ${SUGGESTIONS}.`, related: [], source: 'offline' };
  }
  if (/^(hallo|hi|hey|servus|moin|guten (morgen|tag|abend))\b/.test(normalized) && normalized.split(' ').length <= 3) {
    return {
      text: `Hallo! Ich bin Livia. Frag mich alles rund um die Theorieprüfung – zum Beispiel zu ${SUGGESTIONS}.`,
      related: [],
      source: 'offline',
    };
  }
  if (/^(danke|vielen dank|dankeschoen|merci|thx)\b/.test(normalized)) {
    return { text: 'Sehr gern! Viel Erfolg beim Lernen – du schaffst das. 💪', related: [], source: 'offline' };
  }

  const tokens = tokenize(question);
  const ranked = index()
    .map((e) => ({ e, s: score(e, normalized, tokens) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);

  const best = ranked[0];
  if (!best || best.s < 2.5) {
    return {
      text: `Dazu habe ich leider keine passende Erklärung gefunden. Versuch es mit einem Stichwort wie ${SUGGESTIONS}.`,
      related: [],
      source: 'offline',
    };
  }

  const related = [...best.e.related];
  for (const r of ranked.slice(1, 6)) {
    for (const id of r.e.related) if (!related.includes(id)) related.push(id);
  }

  let text = best.e.answer;
  if (best.e.kind === 'question') {
    const q = QUESTION_BY_ID[best.e.related[0]];
    text = `Dazu passt die Frage „${q.text}“\n\nRichtig ist: ${formatSolution(q)}.\n\n${q.explanation}`;
  }
  return { text, related: related.slice(0, 3), source: 'offline' };
}

/** Erklärung zu einer konkreten Frage – z. B. nach „Frag Livia“ im Quiz. */
export function explainQuestion(q: Question, answer?: UserAnswer): string {
  const parts = [`Richtig ist: ${formatSolution(q)}.`, q.explanation];
  if (q.type === 'choice' && answer?.selected?.length) {
    const wrongPicks = q.options.filter((o) => answer.selected!.includes(o.id) && !q.correct.includes(o.id));
    const missed = q.options.filter((o) => q.correct.includes(o.id) && !answer.selected!.includes(o.id));
    if (wrongPicks.length) parts.push(`Nicht richtig war: „${wrongPicks.map((o) => o.text).join('“, „')}“.`);
    if (missed.length) parts.push(`Gefehlt hat: „${missed.map((o) => o.text).join('“, „')}“.`);
  }
  if (q.type === 'number' && answer?.value) {
    parts.push(`Du hattest ${answer.value} ${q.unit} eingetragen.`.trim());
  }
  return parts.join('\n\n');
}
