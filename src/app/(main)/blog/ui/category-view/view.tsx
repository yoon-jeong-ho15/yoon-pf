"use client";
import { CategoryWithDetail, CategoryWithDetailMap } from "@/lib/definitions";
// import { motion } from "motion/react";
import { useEffect, useState } from "react";
import BlogList from "./blog-list";
import CategoryTree from "./tree";

export default function CategoryView({ data }: { data: CategoryWithDetail[] }) {
  const [categories, setCategories] = useState<CategoryWithDetail[]>([]);
  const [categoryMap, setCategoryMap] = useState<CategoryWithDetailMap | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleSelect = (id: number | null) => {
    setSelectedCategory(id);
  };

  useEffect(() => {
    const temp: CategoryWithDetail[] = [];
    const map = new Map(
      data.map((item) => [
        item.id,
        { ...item, children: new Array<CategoryWithDetail>() },
      ])
    );

    for (const item of data) {
      const cur = map.get(item.id)!;
      if (item.parent_id) {
        const parent = map.get(item.parent_id)!;
        parent.children.push(cur);
        parent.count += cur.count;
      } else {
        temp.push(cur);
      }
    }
    setCategoryMap(map);
    setCategories(temp);
  }, [data]);

  return (
    <div className="flex">
      <CategoryTree
        categories={categories}
        selectedCategory={selectedCategory}
        handleSelect={handleSelect}
      />
      <BlogList categoryMap={categoryMap} selectedCategory={selectedCategory} />
    </div>
  );
}
