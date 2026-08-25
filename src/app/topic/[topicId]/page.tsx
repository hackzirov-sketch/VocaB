"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { categories } from "@/data/categories";
import { Word } from "@/lib/types";
import WordCard from "@/components/WordCard";
import ProgressBar from "@/components/ProgressBar";
import { getLearnedCount } from "@/lib/progress";

export default function TopicPage() {
  const params = useParams();
  const topicId = Number(params.topicId);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "A2" | "B1" | "B2" | "C1" | "phrasal" | "idiom">("all");

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
    setError("");
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
        setError(data.error || "Xatolik yuz berdi");
      }
    } catch {
      setError("So'zlarni yuklashda xatolik. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const filteredWords = words.filter((w) => {
    if (filter === "all") return true;
    if (filter === "A2") return w.level === "A2";
    if (filter === "B1") return w.level === "B1";
    if (filter === "B2") return w.level === "B2";
    if (filter === "C1") return w.level === "C1";
    if (filter === "phrasal") return w.type === "phrasal_verb";
    if (filter === "idiom") return w.type === "idiom";
    return true;
  });

  const learnedInTopic = words.filter((w) => {
    try {
      const progress = JSON.parse(
        localStorage.getItem("vocab_progress") || "{}"
      );
      return progress.learnedWords?.includes(w.id);
    } catch {
      return false;
    }
  }).length;

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-gray-500 hover:text-white text-sm mb-6 block"
        >
          ← Bosh sahifa
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{topicName}</h1>
          {words.length > 0 && (
            <ProgressBar
              current={learnedInTopic}
              total={words.length}
              label="O'rganilgan"
            />
          )}
        </div>

        {words.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Bu mavzu uchun so'zlar hali yuklanmagan
            </p>
            <button
              onClick={loadWords}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              So'zlarni yuklash
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">So'zlarni generatsiya qilmoqda...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={loadWords}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Qaytadan urinish
            </button>
          </div>
        )}

        {words.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: "all", label: "Hammasi" },
                { key: "A2", label: "A2" },
                { key: "B1", label: "B1" },
                { key: "B2", label: "B2" },
                { key: "C1", label: "C1" },
                { key: "phrasal", label: "Phrasal" },
                { key: "idiom", label: "Idioms" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as typeof filter)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    filter === f.key
                      ? "bg-blue-600 text-white"
                      : "bg-[#1a1a2e] text-gray-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWords.map((word, index) => (
                <WordCard key={word.id} word={word} index={index} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href={`/quiz/${topicId}`}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors inline-block"
              >
                Quizni boshlash →
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
