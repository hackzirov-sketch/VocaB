"use client";

import { categories } from "@/data/categories";
import CategoryCard from "@/components/CategoryCard";
import { getLearnedCount } from "@/lib/progress";

export default function Home() {
  const learnedCount = getLearnedCount();

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">VocaB</h1>
          <p className="text-gray-500">
            Inglizcha so'zlarni o'rganish
          </p>
          {learnedCount > 0 && (
            <p className="text-sm text-blue-400 mt-2">
              {learnedCount} ta so'z o'rgandingiz
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </main>
  );
}
