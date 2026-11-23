import { QUESTION_BY_ID } from '@/data/questions';

import { formatSolution } from './grading';
import { answerOffline, type LiviaReply } from './livia';

export interface ChatMessage {
  id: string;
  role: 'user' | 'livia';
  text: string;
  related?: string[];
  source?: 'offline' | 'ai';
  at: number;
}

/**
 * URL des Livia-Servers (siehe server/README.md), z. B. https://api.mylivo.app.
 * Ohne Konfiguration antwortet Livia offline aus der Wissensbasis der App.
 */
const API_URL = process.env.EXPO_PUBLIC_LIVIA_API_URL?.replace(/\/+$/, '');

export const LIVIA_AI_ENABLED = Boolean(API_URL);
export const FREE_LIVIA_MESSAGES_PER_DAY = 10;

function questionContext(questionId: string | undefined) {
  const q = questionId ? QUESTION_BY_ID[questionId] : undefined;
  if (!q) return undefined;
  return {
    question: q.text,
    options: q.type === 'choice' ? q.options.map((o) => o.text) : [],
    solution: formatSolution(q),
    explanation: q.explanation,
  };
}

export async function askLivia(history: ChatMessage[], questionId?: string): Promise<LiviaReply> {
  const last = history[history.length - 1];
  if (!API_URL) return answerOffline(last?.text ?? '');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  try {
    const res = await fetch(`${API_URL}/api/livia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        messages: history.slice(-12).map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
        context: questionContext(questionId),
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { reply?: string };
    if (!data.reply) throw new Error('Leere Antwort');
    const offline = answerOffline(last?.text ?? '');
    return { text: data.reply, related: offline.related, source: 'ai' };
  } catch {
    const offline = answerOffline(last?.text ?? '');
    return {
      ...offline,
      text: `${offline.text}\n\n(Livia ist gerade nicht erreichbar – das ist eine Offline-Antwort.)`,
    };
  } finally {
    clearTimeout(timer);
  }
}
