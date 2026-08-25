"use client";

import Link from "next/link";
import { Topic } from "@/lib/types";
import { getQuizScore, getProgressData } from "@/lib/progress";

interface TopicCardProps {
  topic: Topic;
  categoryId: number;
}

export default function TopicCard({ topic, categoryId }: TopicCardProps) {
  const score = getQuizScore(topic.id);
  const progress = getProgressData();
  const hasWords = progress.learnedWords.length > 0;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#121212] border border-[#2a2a2a] hover:border-blue-500/50 transition-all duration-300">
      <div className="flex-1">
        <h3 className="text-white font-medium">{topic.name_uz}</h3>
        <p className="text-xs text-gray-500 mt-1">{topic.name}</p>
      </div>

      <div className="flex items-center gap-2">
        {score > 0 && (
          <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full">
            {score}%
          </span>
        )}

        <Link
          href={`/topic/${topic.id}`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
        >
          O'rganish
        </Link>

        <Link
          href={`/quiz/${topic.id}`}
          className="px-4 py-2 bg-[#1a1a2e] hover:bg-[#2a2a3e] text-gray-300 text-sm rounded-lg transition-colors border border-[#3a3a4a]"
        >
          Quiz
        </Link>
      </div>
    </div>
  );
}
