"use client";
import type { Category } from "@/lib/definitions";
import { useState } from "react";

function CategoryItem({
  category,
  selectedCategoryId,
  onCategorySelect,
}: {
  category: Category;
  selectedCategoryId: number;
  onCategorySelect: (id: number) => void;
}) {
  const [showChildren, setShowchildren] = useState(true);
  return (
    <div>
      <div style={{ paddingLeft: `${(category.level - 1) * 10}px` }}>
        <input
          type="radio"
          name="category"
          value={category.id}
          checked={selectedCategoryId === category.id}
          onChange={(e) => {
            onCategorySelect(Number(e.currentTarget.value));
          }}
        ></input>
        <span>{category.name}</span>
        <span
          onClick={() => {
            setShowchildren(!showChildren);
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
              <CategoryItem
                key={child.id}
                category={child}
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={onCategorySelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Categories({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: {
  categories: Category[] | null;
  selectedCategoryId: number;
  onCategorySelect: (id: number) => void;
}) {
  return (
    <div>
      {categories?.map((item) => (
        <CategoryItem
          key={item.id}
          category={item}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={onCategorySelect}
        />
      ))}
    </div>
  );
}
