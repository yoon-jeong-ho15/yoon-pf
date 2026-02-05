"use client";

import { Category } from "@/types";

interface SubCategoryItemProps {
  subCategory: Category;
}

export default function SubCategoryItem({ subCategory }: SubCategoryItemProps) {
  return <div>{subCategory.frontmatter.title}</div>;
}
