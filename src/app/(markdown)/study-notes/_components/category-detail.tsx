"use client";

import { useParams } from "next/navigation";
import { Category } from "@/types";
import Frontmatter from "../../_components/frontmatter";
import PostItem from "../../_components/post-item";
import { sortFrontmatter } from "../_lib/util";
import { LinkMetadata } from "@/lib/metadata";
import { useMemo } from "react";
import SubCategoryItem from "./sub-category-item";

interface CategoryDetailProps {
  category: Category;
  metadataMap?: Record<string, LinkMetadata>;
}

export default function CategoryDetail({
  category,
  metadataMap,
}: CategoryDetailProps) {
  if (!category) {
    return null;
  }

  const sortedNotes = [...category.notes].sort((a, b) => {
    return (a.frontmatter.order || 0) - (b.frontmatter.order || 0);
  });

  const descriptionHtml = category.description
    ? `<p>${category.description}</p>`
    : "";

  return (
    <>
      <div className="flex-1 xl:flex-none text-sm divide-y divide-gray-300">
        <div className="p-4 bg-gradient-to-l from-violet-400 to-indigo-100">
          {sortFrontmatter(category.frontmatter).map(([key, value]) => (
            <Frontmatter
              key={key}
              type="category"
              label={key}
              value={value}
              metadataMap={metadataMap}
            />
          ))}
        </div>

        <div
          className="text-gray-700 p-5 min-h-56"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      </div>

      <ul
        className="w-1/5 xl:w-full flex flex-col
      overflow-y-scroll scrollbar-minimal
      bg-white/30
      py-2"
      >
        <div className="font-semibold">{category.frontmatter.title}</div>
        {category.subCategories?.map((subCategory) => (
          <SubCategoryItem
            key={subCategory.slug.join("/")}
            subCategory={subCategory}
          />
        ))}
      </ul>

      <ul
        className="w-1/3 xl:w-full flex flex-col 
      overflow-y-scroll scrollbar-minimal 
      bg-white/30"
      >
        {sortedNotes.map((note, i) => (
          <PostItem key={note.slug.join("/")} note={note} i={i} />
        ))}
      </ul>
    </>
  );
}
