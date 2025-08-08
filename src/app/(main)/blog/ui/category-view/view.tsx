"use client";
import { Category, CategoryMap } from "@/lib/definitions";
import { useEffect, useState } from "react";
import BlogList from "./blog-list";
import CategoryTree from "./tree";
import { motion } from "motion/react";
import { MobileCategoryItem } from "./item";

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState("mobile");

  useEffect(() => {
    const updateBreakpoint = () => {
      if (window.innerWidth >= 1024) setBreakpoint("desktop");
      else if (window.innerWidth >= 768) setBreakpoint("tablet");
      else setBreakpoint("mobile");
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}

export default function CategoryView({
  categories,
  categoryMap,
}: {
  categories: Category[];
  categoryMap: CategoryMap;
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const breakpoint = useBreakpoint();

  const handleSelect = (name: string) => {
    setSelectedCategory(name);
  };

  if (breakpoint === "mobile") {
    return (
      <motion.ul className="p-1">
        {categories.map((category, i) => (
          <MobileCategoryItem key={i} category={category} level={1} />
        ))}
      </motion.ul>
    );
  }

  return (
    <div className="flex justify-around">
      <CategoryTree
        categories={categories}
        selectedCategory={selectedCategory}
        handleSelect={handleSelect}
      />
      <BlogList categoryMap={categoryMap} selectedCategory={selectedCategory} />
    </div>
  );
}
