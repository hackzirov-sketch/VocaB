export interface Word {
  id: number;
  word: string;
  type: "word" | "phrasal_verb" | "idiom";
  meaning_uz: string;
  example: string;
  example_uz: string;
  level: "A2" | "B1" | "B2" | "C1";
  synonyms: string[];
  pronunciation_tip: string;
}

export interface Topic {
  id: number;
  name: string;
  name_uz: string;
}

export interface Category {
  id: number;
  name: string;
  name_uz: string;
  icon: string;
  topics: Topic[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  type: "eng_to_uz" | "uz_to_eng" | "fill_gap" | "matching";
}

export interface Progress {
  learnedWords: number[];
  quizScores: Record<number, number>;
  lastActivity: string;
}

export type QuizType = "eng_to_uz" | "uz_to_eng" | "fill_gap" | "matching";
