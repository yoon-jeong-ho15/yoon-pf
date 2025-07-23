"use client";
import type { Category } from "@/lib/definitions";
import { useState } from "react";

export function Category({ category }: { category: Category }) {
  const [showChildren, setShowchildren] = useState(false);
  return (
    <div>
      <div className={``}>
        <span>{category.name}</span>
        <span
          onClick={() => {
            if (showChildren) {
              setShowchildren(false);
            } else {
              setShowchildren(true);
            }
          }}
          className={`
          ${category.children && category.children.length ? "" : "hidden"}
          text-xs
          `}
        >
          {category.children && showChildren ? "접기" : "열기"}
        </span>
      </div>
      <div className={`${showChildren ? "" : "hidden"}`}>
        {category.children && (
          <div>
            {category.children.map((child) => (
              <Category key={child.id} category={child} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Categories({
  categories,
}: {
  categories: Category[] | null;
}) {
  return (
    <div>
      {categories?.map((item) => (
        <Category key={item.id} category={item} />
      ))}
    </div>
  );
}
