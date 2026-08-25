"use client";

import { useState } from "react";

interface QuizCardProps {
  question: string;
  options: string[];
  correctAnswer: number;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuizCard({
  question,
  options,
  correctAnswer,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    onAnswer(index === correctAnswer);
  };

  const getOptionStyle = (index: number) => {
    if (!answered) {
      return "bg-[#1a1a2e] border-[#3a3a4a] hover:border-blue-500/50 text-gray-300";
    }
    if (index === correctAnswer) {
      return "bg-green-600/20 border-green-500 text-green-400";
    }
    if (index === selected && index !== correctAnswer) {
      return "bg-red-600/20 border-red-500 text-red-400";
    }
    return "bg-[#1a1a2e] border-[#3a3a4a] text-gray-500";
  };

  return (
    <div className="p-6 rounded-xl bg-[#121212] border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          Savol {questionNumber}/{totalQuestions}
        </span>
        <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full">
          {Math.round((questionNumber / totalQuestions) * 100)}%
        </span>
      </div>

      <h3 className="text-lg font-medium text-white mb-6">{question}</h3>

      <div className="grid grid-cols-1 gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={answered}
            className={`p-4 rounded-lg border text-left transition-all duration-200 ${getOptionStyle(
              index
            )}`}
          >
            <span className="font-medium">{String.fromCharCode(65 + index)}.</span>{" "}
            {option}
          </button>
        ))}
      </div>

      {answered && (
        <div className="mt-4 p-3 rounded-lg bg-[#1a1a2e]">
          <p
            className={`text-sm ${
              selected === correctAnswer ? "text-green-400" : "text-red-400"
            }`}
          >
            {selected === correctAnswer
              ? "To'g'ri! ✓"
              : `Noto'g'ri. To'g'ri javob: ${String.fromCharCode(
                  65 + correctAnswer
                )}. ${options[correctAnswer]}`}
          </p>
        </div>
      )}
    </div>
  );
}
