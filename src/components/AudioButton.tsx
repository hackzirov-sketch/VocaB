"use client";

import { speak, stopSpeaking } from "@/lib/speech";
import { useState } from "react";

interface AudioButtonProps {
  text: string;
  size?: "sm" | "md" | "lg";
}

export default function AudioButton({ text, size = "md" }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speak(text);
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  return (
    <button
      onClick={handleSpeak}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 transition-colors`}
      title="Talaffuzni eshitting"
    >
      {isPlaying ? "⏸️" : "🔊"}
    </button>
  );
}
