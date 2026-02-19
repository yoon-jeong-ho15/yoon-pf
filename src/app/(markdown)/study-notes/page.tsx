import { getAllNotes } from "@/features/(markdown)/lib/data";
import Link from "next/link";
import Pagination from "./_components/pagination";

const ITEMS_PER_PAGE = 10;

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const allNotes = getAllNotes();
  const sortedNotes = allNotes.sort((a, b) => {
    return (
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
    );
  });

  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const totalPage = Math.ceil(sortedNotes.length / ITEMS_PER_PAGE);

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const slicedNotes = sortedNotes.slice(startIdx, endIdx);

  return (
    <div className="flex-1 flex flex-col">
      <div
        className="flex border-b px-6 border-gray-400 text-2xl 
      font-black py-2  bg-amber-200 justify-between items-center"
      >
        <span className="text-green-500">전체 보기</span>
        <Pagination totalPage={totalPage} currentPage={currentPage} />
      </div>
      <ul className="flex-1 flex flex-col gap-2 divide-y divide-gray-400">
        {slicedNotes.map((note, i) => (
          <li
            key={note.slug.join("/")}
            className="flex items-center justify-between flex-1 shrink-0 grow-0 px-1 md:px-5"
          >
            <Link
              href={`/study-notes/${note.slug.join("/")}`}
              className="flex-1 text-xl "
            >
              <span className="block font-bold">{note.frontmatter.title}</span>
              <span className="text-sm block text-slate-500">
                {note.frontmatter.date}
              </span>
            </Link>

            <div className="flex-1 flex items-center gap-1 text-xs md:text-base md:gap-2 flex-wrap">
              {note.frontmatter.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded h-full py-1 px-2 bg-indigo-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
