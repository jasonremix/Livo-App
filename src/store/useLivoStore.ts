import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CREDITS_PER_CORRECT_ANSWER } from '@/data/rewards';
import { CHALLENGE_BONUS, CHALLENGE_PASS } from '@/lib/challenge';
import { dayKey } from '@/lib/dates';
import type { ChatMessage } from '@/lib/livia-client';
import { applyAnswer, type QuestionProgress } from '@/lib/srs';
import type { ExamRecord } from '@/lib/stats';

export type ThemePref = 'system' | 'light' | 'dark';

export interface Profile {
  name: string;
  /** Prüfungstermin als YYYY-MM-DD */
  examDate: string | null;
  dailyGoal: number;
  onboarded: boolean;
}

interface PersistedState {
  profile: Profile;
  themePref: ThemePref;
  progress: Record<string, QuestionProgress>;
  credits: number;
  creditedIds: string[];
  marked: string[];
  activity: Record<string, number>;
  exams: ExamRecord[];
  completedModules: string[];
  isPlus: boolean;
  liviaUsage: { day: string; count: number };
  chat: ChatMessage[];
  /** Beta: Express-Modus pro Tag */
  expressLog: Record<string, { rounds: number; cheatSheet: boolean }>;
  /** Beta: Tägliche Challenge pro Tag */
  challenges: Record<string, { correct: number; total: number; rewarded: boolean }>;
}

interface Actions {
  /** Speichert eine Antwort; gibt die dafür erhaltenen Credits zurück. */
  recordAnswer: (questionId: string, correct: boolean) => number;
  toggleMark: (questionId: string) => void;
  saveExam: (exam: ExamRecord) => void;
  completeModule: (moduleId: string) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  setThemePref: (pref: ThemePref) => void;
  setPlus: (isPlus: boolean) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  /** Zählt eine KI-Nachricht an Livia; false, wenn das Tageslimit erreicht ist. */
  consumeLiviaMessage: (limit: number) => boolean;
  recordExpressRound: () => void;
  markCheatSheetSeen: () => void;
  /** Speichert das Challenge-Ergebnis von heute; gibt die Bonus-Credits zurück (einmal pro Tag). */
  completeChallenge: (correct: number, total: number) => number;
  resetProgress: () => void;
}

export type LivoState = PersistedState &
  Actions & {
    hasHydrated: boolean;
    /** Livia schreibt gerade (nicht persistiert) */
    liviaBusy: boolean;
  };

export const initialState: PersistedState = {
  profile: { name: '', examDate: null, dailyGoal: 20, onboarded: false },
  themePref: 'system',
  progress: {},
  credits: 0,
  creditedIds: [],
  marked: [],
  activity: {},
  exams: [],
  completedModules: [],
  isPlus: false,
  liviaUsage: { day: '', count: 0 },
  chat: [],
  expressLog: {},
  challenges: {},
};

export const useLivoStore = create<LivoState>()(
  persist(
    (set, get) => ({
      ...initialState,
      hasHydrated: false,
      liviaBusy: false,

      recordAnswer: (questionId, correct) => {
        const state = get();
        const earn = correct && !state.creditedIds.includes(questionId) ? CREDITS_PER_CORRECT_ANSWER : 0;
        const today = dayKey();
        set({
          progress: { ...state.progress, [questionId]: applyAnswer(state.progress[questionId], correct) },
          activity: { ...state.activity, [today]: (state.activity[today] ?? 0) + 1 },
          credits: state.credits + earn,
          creditedIds: earn ? [...state.creditedIds, questionId] : state.creditedIds,
        });
        return earn;
      },

      toggleMark: (questionId) =>
        set((s) => ({
          marked: s.marked.includes(questionId)
            ? s.marked.filter((id) => id !== questionId)
            : [...s.marked, questionId],
        })),

      saveExam: (exam) => set((s) => ({ exams: [exam, ...s.exams].slice(0, 30) })),

      completeModule: (moduleId) =>
        set((s) =>
          s.completedModules.includes(moduleId) ? s : { completedModules: [...s.completedModules, moduleId] },
        ),

      updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      setThemePref: (themePref) => set({ themePref }),

      setPlus: (isPlus) => set({ isPlus }),

      addChatMessage: (msg) => set((s) => ({ chat: [...s.chat, msg].slice(-60) })),

      clearChat: () => set({ chat: [] }),

      consumeLiviaMessage: (limit) => {
        const s = get();
        if (s.isPlus) return true;
        const today = dayKey();
        const count = s.liviaUsage.day === today ? s.liviaUsage.count : 0;
        if (count >= limit) return false;
        set({ liviaUsage: { day: today, count: count + 1 } });
        return true;
      },

      recordExpressRound: () =>
        set((s) => {
          const today = dayKey();
          const entry = s.expressLog[today] ?? { rounds: 0, cheatSheet: false };
          return { expressLog: { ...s.expressLog, [today]: { ...entry, rounds: entry.rounds + 1 } } };
        }),

      markCheatSheetSeen: () =>
        set((s) => {
          const today = dayKey();
          const entry = s.expressLog[today] ?? { rounds: 0, cheatSheet: false };
          return entry.cheatSheet ? s : { expressLog: { ...s.expressLog, [today]: { ...entry, cheatSheet: true } } };
        }),

      completeChallenge: (correct, total) => {
        const s = get();
        const today = dayKey();
        const prev = s.challenges[today];
        const bonus = !prev?.rewarded && correct >= CHALLENGE_PASS ? CHALLENGE_BONUS : 0;
        const best = prev && prev.correct > correct ? prev : { correct, total, rewarded: false };
        set({
          challenges: { ...s.challenges, [today]: { ...best, rewarded: !!prev?.rewarded || bonus > 0 } },
          credits: s.credits + bonus,
        });
        return bonus;
      },

      resetProgress: () =>
        set({
          progress: {},
          marked: [],
          activity: {},
          exams: [],
          completedModules: [],
          chat: [],
          expressLog: {},
        }),
    }),
    {
      name: 'livo-state',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s): PersistedState => ({
        profile: s.profile,
        themePref: s.themePref,
        progress: s.progress,
        credits: s.credits,
        creditedIds: s.creditedIds,
        marked: s.marked,
        activity: s.activity,
        exams: s.exams,
        completedModules: s.completedModules,
        isPlus: s.isPlus,
        liviaUsage: s.liviaUsage,
        chat: s.chat,
        expressLog: s.expressLog,
        challenges: s.challenges,
      }),
      onRehydrateStorage: () => () => {
        useLivoStore.setState({ hasHydrated: true });
      },
    },
  ),
);
