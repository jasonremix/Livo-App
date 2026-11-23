export type SignId =
  | '101' // Gefahrstelle
  | '201' // Andreaskreuz
  | '205' // Vorfahrt gewähren
  | '206' // Halt. Vorfahrt gewähren (Stop)
  | '209' // Vorgeschriebene Fahrtrichtung rechts
  | '250' // Verbot für Fahrzeuge aller Art
  | '267' // Verbot der Einfahrt
  | '274-30'
  | '274-50'
  | '274-70'
  | '276' // Überholverbot
  | '282' // Ende sämtlicher Streckenverbote
  | '283' // Absolutes Haltverbot
  | '286' // Eingeschränktes Haltverbot
  | '301' // Vorfahrt an der nächsten Kreuzung
  | '306' // Vorfahrtstraße
  | '307' // Ende der Vorfahrtstraße
  | '310' // Ortstafel
  | '314' // Parken
  | '357' // Sackgasse
  | '380'; // Richtgeschwindigkeit

export type CategoryId =
  | 'gefahren'
  | 'verhalten'
  | 'vorfahrt'
  | 'zeichen'
  | 'umwelt'
  | 'technik'
  | 'fahrer';

/** G = Grundstoff (alle Klassen), B = Zusatzstoff Klasse B */
export type Pool = 'G' | 'B';

export type Points = 2 | 3 | 4 | 5;

export interface AnswerOption {
  id: string;
  text: string;
}

interface QuestionBase {
  id: string;
  category: CategoryId;
  pool: Pool;
  /** Fehlerpunkte bei falscher Antwort (wie in der amtlichen Prüfung: 2–5) */
  points: Points;
  text: string;
  /** Verkehrszeichen, das zur Frage angezeigt wird */
  sign?: SignId;
  /** Erklärung von Livia */
  explanation: string;
}

export interface ChoiceQuestion extends QuestionBase {
  type: 'choice';
  options: AnswerOption[];
  /** IDs aller richtigen Antworten – es können mehrere sein */
  correct: string[];
}

export interface NumberQuestion extends QuestionBase {
  type: 'number';
  answer: number;
  unit: string;
}

export type Question = ChoiceQuestion | NumberQuestion;

export interface Category {
  id: CategoryId;
  title: string;
  short: string;
  description: string;
  icon: string; // Ionicons name
}

export interface LessonSection {
  heading: string;
  body: string;
  signs?: SignId[];
}

export interface CourseModule {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  sections: LessonSection[];
  takeaways: string[];
  /** Fragen aus dem Fragenkatalog, die am Ende des Moduls geübt werden */
  quiz: string[];
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  icon: string; // Ionicons name
  modules: CourseModule[];
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  kind: 'discount' | 'plus' | 'payout';
}
