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
  categories: Category[];
  metadataMap?: Record<string, LinkMetadata>;
}

export default function CategoryDetail({
  categories,
  metadataMap,
}: CategoryDetailProps) {
  const params = useParams();

  // URL의 slug를 안전하게 가져옵니다 (배열 형태)
  const slug = params?.slug as string[] | undefined;

  // slug를 기반으로 현재 카테고리를 찾습니다.
  const category = useMemo(() => {
    if (!slug || !Array.isArray(slug) || slug.length === 0) return null;

    // 트리 탐색 헬퍼 함수
    const findInTree = (
      nodes: Category[],
      targetSlug: string[],
    ): Category | null => {
      if (!nodes) return null; // nodes가 undefined일 경우 방어
      for (const node of nodes) {
        // 현재 노드의 slug와 타겟 slug가 정확히 일치하는지 확인
        if (JSON.stringify(node.slug) === JSON.stringify(targetSlug)) {
          return node;
        }
        // 하위 카테고리 재귀 탐색 (subCategories가 안전한지 확인)
        if (node.subCategories && node.subCategories.length > 0) {
          const found = findInTree(node.subCategories, targetSlug);
          if (found) return found;
        }
      }
      return null;
    };

    // 1. 현재 경로와 정확히 일치하는 카테고리 검색
    // 예: /study-notes/course/6.042j -> course/6.042j 카테고리 찾기
    let found = findInTree(categories, slug);

    // 2. 일치하는 카테고리가 없다면 (예: 노트 상세 페이지인 경우), 부모 카테고리 검색
    // 예: /study-notes/course/6.042j/induction (노트) -> course/6.042j (부모 카테고리) 찾기
    if (!found && slug.length > 1) {
      found = findInTree(categories, slug.slice(0, -1));
    }

    return found;
  }, [categories, slug]);

  // 카테고리를 찾지 못했으면 아무것도 렌더링하지 않음 (또는 빈 상태)
  if (!category) {
    return null;
  }

  // 노트 정렬
  const sortedNotes = [...category.notes].sort((a, b) => {
    return (a.frontmatter.order || 0) - (b.frontmatter.order || 0);
  });

  // HTML 설명이 따로 없다면 frontmatter description 사용
  const descriptionHtml = category.description
    ? `<p>${category.description}</p>`
    : "";

  return (
    <>
      <div className="flex-1 xl:flex-none text-sm p-4">
        <div className="space-y-2">
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

        {descriptionHtml && (
          <div
            className="prose prose-sm prose-gray text-gray-700 mt-2"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}
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
