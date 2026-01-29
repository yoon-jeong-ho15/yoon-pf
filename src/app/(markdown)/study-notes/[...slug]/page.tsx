import Link from "next/link";
import { markdownToHtml } from "@/lib/markdown";
import { FrontmatterSection } from "../_components/fields";
import { getNoteBySlug } from "../_lib/data";
import { sortFrontmatter } from "../_lib/util";
import Frontmatter from "../../_components/frontmatter";
import PostItem from "../../_components/post-item";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

const ITEMS_PER_PAGE = 5;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");

  const { type, data } = getNoteBySlug(slug);
  const { category, note } = data;
  const description = await markdownToHtml(category?.description || "");
  const content = await markdownToHtml(note?.body || "");

  const sortedNotes = category.notes.sort((a, b) => {
    return (a.frontmatter.order || 0) - (b.frontmatter.order || 0);
  });

  const totalPages = Math.ceil(sortedNotes.length / ITEMS_PER_PAGE);
  const paginatedNotes = sortedNotes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <>
      {/* xl */}
      <div className="w-1/4 h-fit hidden xl:flex flex-col min-w-52 border-t border-r sticky top-10">
        <div className="flex gap-2 text-gray-700">
          {category.slug.slice(0, -1).map((part) => (
            <span key={part} className="flex gap-2">
              <span>{part}</span>
              <span>{">"}</span>
            </span>
          ))}
        </div>
        {sortFrontmatter(category.frontmatter).map(([key, value]) => (
          <Frontmatter key={key} type="category" label={key} value={value} />
        ))}
        <div
          className="mt-2 prose-category-desc"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <ul className="mt-2 pl-2 gap-2 py-2">
          {sortedNotes.map((note, i) => (
            <PostItem key={note.slug.join("/")} note={note} i={i} />
          ))}
        </ul>
      </div>

      {/* lg */}
      <div className={`flex xl:hidden border p-4 h-80 lg:flex-1`}>
        <div className="flex gap-2 text-gray-700 flex-col w-4/10">
          {sortFrontmatter(category.frontmatter).map(([key, value]) => (
            <Frontmatter key={key} type="category" label={key} value={value} />
          ))}
        </div>
        {/* <div
          className="mt-2 prose-category-desc"
          dangerouslySetInnerHTML={{ __html: description }}
        /> */}
        <div className="flex flex-col w-6/10">
          <ul className="mt-2 pl-2 gap-2 py-2 h-9/10">
            {paginatedNotes.map((note, i) => (
              <PostItem
                key={note.slug.join("/")}
                note={note}
                i={(currentPage - 1) * ITEMS_PER_PAGE + i}
              />
            ))}
          </ul>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-1 pt-1 h-1/10">
              <Link
                href={`?page=${currentPage - 1}`}
                className={`px-2 py-1 border rounded border-gray-500 ${
                  currentPage <= 1
                    ? "pointer-events-none opacity-50 bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </Link>
              <span className="text-sm font-medium text-gray-600">
                {currentPage} / {totalPages}
              </span>
              <Link
                href={`?page=${currentPage + 1}`}
                className={`px-2 py-1 border rounded border-gray-500 ${
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50 bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="w-3/4 max-w-none">
        {note && (
          <>
            <FrontmatterSection
              data={note.frontmatter}
              type="note"
              parentData={note}
            />
            <article
              className="prose mt-8 max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </>
        )}
      </div>
    </>
  );
}
