"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Category, Note } from "@/types";
import Frontmatter from "../../_components/frontmatter";
import PostItem from "../../_components/post-item";
import { sortFrontmatter } from "../_lib/util";
import { LinkMetadata } from "@/lib/metadata";

const ITEMS_PER_PAGE = 5;

interface CategoryDetailProps {
  category: Category;
  descriptionHtml: string;
  metadataMap?: Record<string, LinkMetadata>;
}

export default function CategoryDetail({
  category,
  descriptionHtml,
  metadataMap,
}: CategoryDetailProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const pageStr = searchParams.get("page");
  const currentPage = parseInt(pageStr || "1");

  const sortedNotes = [...category.notes].sort((a, b) => {
    return (a.frontmatter.order || 0) - (b.frontmatter.order || 0);
  });

  const totalPages = Math.ceil(sortedNotes.length / ITEMS_PER_PAGE);
  const paginatedNotes = sortedNotes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-between items-center mt-1 pt-1 h-1/10">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className={`px-2 py-1 border rounded border-gray-500 ${
            currentPage <= 1
              ? "opacity-50 bg-gray-100 cursor-not-allowed"
              : "hover:bg-gray-50"
          }`}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-gray-600">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage >= totalPages}
          className={`px-2 py-1 border rounded border-gray-500 ${
            currentPage >= totalPages
              ? "opacity-50 bg-gray-100 cursor-not-allowed"
              : "hover:bg-gray-50"
          }`}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <>
      {/* xl */}
      <div className="h-fit hidden xl:flex flex-col min-w-52 border-t border-r sticky top-10">
        <div className="flex gap-2 text-gray-700">
          {category.slug.slice(0, -1).map((part) => (
            <span key={part} className="flex gap-2">
              <span>{part}</span>
              <span>{">"}</span>
            </span>
          ))}
        </div>
        {sortFrontmatter(category.frontmatter).map(([key, value]) => (
          <Frontmatter
            key={key}
            type="category"
            label={key}
            value={value}
            metadataMap={metadataMap}
          />
        ))}
        <div
          className="mt-2 prose-category-desc"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
        <ul className="mt-2 pl-2 gap-2 py-2">
          {sortedNotes.map((note, i) => (
            <PostItem key={note.slug.join("/")} note={note} i={i} />
          ))}
        </ul>
      </div>

      {/* lg */}
      <div className={`flex xl:hidden border p-4 h-80 w-full`}>
        <div className="flex gap-2 text-gray-700 flex-col w-4/10">
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
        <div className="w-6/10">
          <ul className="gap-2 h-9/10 grid grid-cols-1 grid-rows-5">
            {paginatedNotes.map((note, i) => (
              <PostItem
                key={note.slug.join("/")}
                note={note}
                i={(currentPage - 1) * ITEMS_PER_PAGE + i}
              />
            ))}
          </ul>
          {renderPagination()}
        </div>
      </div>
    </>
  );
}
