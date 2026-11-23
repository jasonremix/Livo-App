import { CATEGORY_BY_ID } from '@/data/categories';
import { findModule } from '@/data/courses';
import { QUESTION_BY_ID, QUESTIONS } from '@/data/questions';
import type { CategoryId } from '@/data/types';

import { buildTrainingQueue, mistakeIds, type QuestionProgress } from './srs';

export type QuizMode = 'training' | 'category' | 'mistakes' | 'marked' | 'module' | 'ids';

export interface QuizSession {
  title: string;
  ids: string[];
}

export const TRAINING_SIZE = 15;

export function buildSession(
  mode: QuizMode,
  param: string | undefined,
  state: { progress: Record<string, QuestionProgress>; marked: string[] },
): QuizSession {
  switch (mode) {
    case 'category': {
      const cat = CATEGORY_BY_ID[param as CategoryId];
      if (!cat) return { title: 'Thema', ids: [] };
      const pool = QUESTIONS.filter((q) => q.category === cat.id);
      return { title: cat.title, ids: buildTrainingQueue(pool, state.progress, pool.length) };
    }
    case 'mistakes':
      return { title: 'Fehler wiederholen', ids: mistakeIds(state.progress).slice(0, 30) };
    case 'marked':
      return { title: 'Markierte Fragen', ids: state.marked.filter((id) => QUESTION_BY_ID[id]) };
    case 'module': {
      const mod = param ? findModule(param) : undefined;
      return { title: mod ? `Quiz: ${mod.title}` : 'Quiz', ids: mod?.quiz ?? [] };
    }
    case 'ids':
      return {
        title: 'Übung',
        ids: (param ?? '').split(',').filter((id) => QUESTION_BY_ID[id]),
      };
    case 'training':
    default:
      return { title: 'Training', ids: buildTrainingQueue(QUESTIONS, state.progress, TRAINING_SIZE) };
  }
}
