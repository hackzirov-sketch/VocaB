"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { categories } from "@/data/categories";
import TopicCard from "@/components/TopicCard";

export default function CategoryPage() {
  const params = useParams();
  const catId = Number(params.catId);
  const category = categories.find((c) => c.id === catId);

  if (!category) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">Kategoriya topilmadi</p>
          <Link href="/" className="text-blue-400 hover:underline mt-4 block">
            Bosh sahifaga qaytish
          </Link>
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

        <div className="mb-8">
          <div className="text-4xl mb-3">{category.icon}</div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {category.name_uz}
          </h1>
          <p className="text-gray-500 text-sm">{category.name}</p>
          <p className="text-blue-400 text-sm mt-2">
            {category.topics.length} ta mavzu
          </p>
        </div>

        <div className="space-y-3">
          {category.topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              categoryId={category.id}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
