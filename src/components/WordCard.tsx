"use client";

import { useState } from "react";
import { Word } from "@/lib/types";
import AudioButton from "./AudioButton";
import { markWordLearned, isWordLearned } from "@/lib/progress";

interface WordCardProps {
  word: Word;
  index: number;
}

export default function WordCard({ word, index }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [learned, setLearned] = useState(isWordLearned(word.id));

  const handleMarkLearned = () => {
    markWordLearned(word.id);
    setLearned(true);
  };

  const typeLabels = {
    word: "So'z",
    phrasal_verb: "Phrasal Verb",
    idiom: "Idiom",
  };

  const typeColors = {
    word: "bg-blue-600",
    phrasal_verb: "bg-purple-600",
    idiom: "bg-amber-600",
  };

  return (
    <div
      className={`relative p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
        isFlipped
          ? "bg-[#1a1a2e] border-blue-500/30"
          : "bg-[#121212] border-[#2a2a2a] hover:border-blue-500/50"
      }`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">#{index + 1}</span>
          <span
            className={`${typeColors[word.type]} text-xs px-2 py-0.5 rounded-full`}
          >
            {typeLabels[word.type]}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              word.level === "A2"
                ? "bg-green-600/20 text-green-400"
                : word.level === "B1"
                ? "bg-teal-600/20 text-teal-400"
                : word.level === "B2"
                ? "bg-blue-600/20 text-blue-400"
                : "bg-orange-600/20 text-orange-400"
            }`}
          >
            {word.level}
          </span>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <AudioButton text={word.word} size="sm" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-1">{word.word}</h3>
      <p className="text-blue-400 text-sm mb-3">{word.meaning_uz}</p>

      {isFlipped && (
        <div className="mt-4 space-y-3 border-t border-[#2a2a2a] pt-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Misol gap:</p>
            <p className="text-gray-300 text-sm italic">{word.example}</p>
            <p className="text-gray-500 text-xs mt-1">{word.example_uz}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Sinonimlar:</p>
            <div className="flex flex-wrap gap-1">
              {word.synonyms.map((syn) => (
                <span
                  key={syn}
                  className="text-xs bg-[#1a1a2e] text-gray-400 px-2 py-1 rounded"
                >
                  {syn}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Talaffuz:</p>
            <p className="text-xs text-green-400">{word.pronunciation_tip}</p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMarkLearned();
            }}
            disabled={learned}
            className={`w-full mt-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              learned
                ? "bg-green-600/20 text-green-400 cursor-default"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {learned ? "O'rgandim ✓" : "O'rgandim belgilash"}
          </button>
        </div>
      )}
    </div>
  );
}
