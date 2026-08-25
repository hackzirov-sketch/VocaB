import { Progress } from "./types";

const STORAGE_KEY = "vocab_progress";

function getProgress(): Progress {
  if (typeof window === "undefined") {
    return { learnedWords: [], quizScores: {}, lastActivity: "" };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }

  return { learnedWords: [], quizScores: {}, lastActivity: "" };
}

function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markWordLearned(wordId: number): void {
  const progress = getProgress();
  if (!progress.learnedWords.includes(wordId)) {
    progress.learnedWords.push(wordId);
  }
  progress.lastActivity = new Date().toISOString();
  saveProgress(progress);
}

export function isWordLearned(wordId: number): boolean {
  return getProgress().learnedWords.includes(wordId);
}

export function getLearnedCount(): number {
  return getProgress().learnedWords.length;
}

export function saveQuizScore(topicId: number, score: number): void {
  const progress = getProgress();
  progress.quizScores[topicId] = score;
  progress.lastActivity = new Date().toISOString();
  saveProgress(progress);
}

export function getQuizScore(topicId: number): number {
  return getProgress().quizScores[topicId] || 0;
}

export function getProgressData(): Progress {
  return getProgress();
}
