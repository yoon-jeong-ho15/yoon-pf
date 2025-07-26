"use client";
import type { Category } from "@/lib/definitions";

export default function Categories({
  categories,
}: {
  categories: Category[] | null;
}) {
  console.log(categories);
  return (
    <div>
      <div>Category view</div>
    </div>
  );
}
