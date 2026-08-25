"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { categories } from "@/data/categories";
import { Word, QuizType } from "@/lib/types";
import QuizCard from "@/components/QuizCard";
import ProgressBar from "@/components/ProgressBar";
import { saveQuizScore } from "@/lib/progress";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuizQuestions(
  words: Word[],
  quizType: QuizType
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const shuffledWords = shuffleArray(words);

  for (const word of shuffledWords) {
    const otherWords = shuffleArray(
      words.filter((w) => w.id !== word.id)
    ).slice(0, 3);

    if (quizType === "eng_to_uz") {
      const options = shuffleArray([
        word.meaning_uz,
        ...otherWords.map((w) => w.meaning_uz),
      ]);
      questions.push({
        question: `"${word}" so'zining ma'nosi nima?`,
        options,
        correctAnswer: options.indexOf(word.meaning_uz),
      });
    } else if (quizType === "uz_to_eng") {
      const options = shuffleArray([
        word.word,
        ...otherWords.map((w) => w.word),
      ]);
      questions.push({
        question: `"${word.meaning_uz}" inglizchasi nima?`,
        options,
        correctAnswer: options.indexOf(word.word),
      });
    } else if (quizType === "fill_gap") {
      const blank = word.example.replace(
        new RegExp(word.word, "gi"),
        "___"
      );
      const options = shuffleArray([
        word.word,
        ...otherWords.map((w) => w.word),
      ]);
      questions.push({
        question: blank,
        options,
        correctAnswer: options.indexOf(word.word),
      });
    } else if (quizType === "matching") {
      const options = shuffleArray([
        `${word.word} → ${word.meaning_uz}`,
        ...otherWords.map((w) => `${w.word} → ${w.meaning_uz}`),
      ]);
      questions.push({
        question: `"${word}" so'zining to'g'ri juftligini toping:`,
        options,
        correctAnswer: options.indexOf(
          `${word.word} → ${word.meaning_uz}`
        ),
      });
    }
  }

  return questions.slice(0, 10);
}

export default function QuizPage() {
  const params = useParams();
  const topicId = Number(params.topicId);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  let topicName = "";
  for (const cat of categories) {
    const t = cat.topics.find((t) => t.id === topicId);
    if (t) {
      topicName = t.name;
      break;
    }
  }

  const loadWords = async () => {
    if (!topicName) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicName }),
      });
      const data = await res.json();
      if (data.words) {
        setWords(data.words);
      } else {
        alert(data.error || "Xatolik yuz berdi");
      }
    } catch {
      alert("So'zlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (type: QuizType) => {
    setQuizType(type);
    const q = generateQuizQuestions(words, type);
    setQuestions(q);
    setCurrentQuestion(0);
    setScore(0);
    setFinished(false);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion((c) => c + 1);
      } else {
        setFinished(true);
        const finalScore = Math.round(
          ((isCorrect ? score + 1 : score) / questions.length) * 100
        );
        saveQuizScore(topicId, finalScore);
      }
    }, 1000);
  };

  if (words.length === 0 && !loading) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="text-gray-500 hover:text-white text-sm mb-6 block"
          >
            ← Bosh sahifa
          </Link>

          <h1 className="text-2xl font-bold text-white mb-2">{topicName}</h1>
          <p className="text-gray-500 mb-8">Quiz</p>

          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Avval so'zlarni yuklash kerak
            </p>
            <button
              onClick={loadWords}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              So'zlarni yuklash
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">So'zlarni generatsiya qilmoqda...</p>
        </div>
      </main>
    );
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-6xl mb-6">
            {percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "💪"}
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Quiz tugadi!</h1>
          <p className="text-xl text-gray-400 mb-2">
            Natija: {score}/{questions.length}
          </p>
          <p className="text-4xl font-bold text-blue-400 mb-8">{percentage}%</p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => quizType && startQuiz(quizType)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Qaytadan
            </button>
            <Link
              href={`/topic/${topicId}`}
              className="px-6 py-3 bg-[#1a1a2e] hover:bg-[#2a2a3e] text-gray-300 rounded-lg transition-colors"
            >
              So'zlarni ko'rish
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-[#1a1a2e] hover:bg-[#2a2a3e] text-gray-300 rounded-lg transition-colors"
            >
              Bosh sahifa
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (questions.length > 0) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="text-gray-500 hover:text-white text-sm mb-6 block"
          >
            ← Bosh sahifa
          </Link>

          <ProgressBar
            current={currentQuestion + 1}
            total={questions.length}
            label="Savol"
          />

          <div className="mt-8">
            <QuizCard
              question={questions[currentQuestion].question}
              options={questions[currentQuestion].options}
              correctAnswer={questions[currentQuestion].correctAnswer}
              questionNumber={currentQuestion + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Ball: {score}/{currentQuestion + (finished ? 0 : 0)}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-gray-500 hover:text-white text-sm mb-6 block"
        >
          ← Bosh sahifa
        </Link>

        <h1 className="text-2xl font-bold text-white mb-2">{topicName}</h1>
        <p className="text-gray-500 mb-8">Quiz turini tanlang</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              type: "eng_to_uz" as QuizType,
              title: "Ingliz → O'zbek",
              desc: "So'z ma'nosini toping",
              icon: "🇬🇧 → 🇺🇿",
            },
            {
              type: "uz_to_eng" as QuizType,
              title: "O'zbek → Ingliz",
              desc: "Ma'no bo'yicha so'zni toping",
              icon: "🇺🇿 → 🇬🇧",
            },
            {
              type: "fill_gap" as QuizType,
              title: "Fill the Gap",
              desc: "Bo'sh joyni to'ldiring",
              icon: "📝",
            },
            {
              type: "matching" as QuizType,
              title: "Matching",
              desc: "So'z va ma'noni juftlang",
              icon: "🔗",
            },
          ].map((qt) => (
            <button
              key={qt.type}
              onClick={() => startQuiz(qt.type)}
              className="p-6 rounded-xl bg-[#121212] border border-[#2a2a2a] hover:border-blue-500/50 transition-all duration-300 text-left"
            >
              <div className="text-3xl mb-3">{qt.icon}</div>
              <h3 className="text-lg font-bold text-white mb-1">{qt.title}</h3>
              <p className="text-sm text-gray-500">{qt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
