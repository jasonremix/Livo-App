import { useLivoStore } from '@/store/useLivoStore';

import { askLivia, FREE_LIVIA_MESSAGES_PER_DAY, LIVIA_AI_ENABLED, type ChatMessage } from './livia-client';

let counter = 0;
const newId = () => `${Date.now()}-${counter++}`;

/**
 * Schickt eine Nachricht an Livia und schreibt Frage und Antwort in den Chatverlauf.
 * Kann von jedem Screen aus aufgerufen werden (z. B. „Frag Livia“ im Quiz).
 */
export async function sendToLivia(
  text: string,
  opts: { questionId?: string; offlineAnswer?: string } = {},
): Promise<void> {
  const store = useLivoStore.getState();
  const trimmed = text.trim();
  if (!trimmed || store.liviaBusy) return;

  const add = (msg: Omit<ChatMessage, 'id' | 'at'>) =>
    useLivoStore.getState().addChatMessage({ ...msg, id: newId(), at: Date.now() });

  add({ role: 'user', text: trimmed });

  if (!LIVIA_AI_ENABLED && opts.offlineAnswer) {
    add({
      role: 'livia',
      text: opts.offlineAnswer,
      related: opts.questionId ? [opts.questionId] : [],
      source: 'offline',
    });
    return;
  }

  if (LIVIA_AI_ENABLED && !store.consumeLiviaMessage(FREE_LIVIA_MESSAGES_PER_DAY)) {
    add({
      role: 'livia',
      text: `Du hast heute schon ${FREE_LIVIA_MESSAGES_PER_DAY} kostenlose Fragen gestellt. Mit Livo Plus chattest du unbegrenzt mit mir – oder du schaust morgen wieder vorbei.`,
    });
    return;
  }

  useLivoStore.setState({ liviaBusy: true });
  try {
    const reply = await askLivia(useLivoStore.getState().chat, opts.questionId);
    add({ role: 'livia', text: reply.text, related: reply.related, source: reply.source });
  } finally {
    useLivoStore.setState({ liviaBusy: false });
  }
}
