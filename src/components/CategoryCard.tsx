"use client";

import Link from "next/link";
import { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.id}`}>
      <div className="p-6 rounded-xl bg-[#121212] border border-[#2a2a2a] hover:border-blue-500/50 transition-all duration-300 cursor-pointer group">
        <div className="text-4xl mb-3">{category.icon}</div>
        <h2 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
          {category.name_uz}
        </h2>
        <p className="text-sm text-gray-500">{category.topics.length} ta mavzu</p>
      </div>
    </Link>
  );
}
