"use client";
import type { CategoryWithDetail } from "@/lib/definitions";

export default function Categories({
  categories,
}: {
  categories?: CategoryWithDetail[];
}) {
  console.log(categories);
  return (
    <div>
      {categories?.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
}

export function CategoryItem({ category }: { category: CategoryWithDetail }) {
  return (
    <div>
      <div>{category.name}</div>
      {category.children && (
        <div>
          {category.children.map((child) => (
            <CategoryItem key={child.id} category={child} />
          ))}
        </div>
      )}
    </div>
  );
}
