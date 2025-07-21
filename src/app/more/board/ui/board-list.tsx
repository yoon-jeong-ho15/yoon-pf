"use-client";
import { fetchBlogs } from "@/lib/data";
import Link from "next/link";

export default async function BoardList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const boards = await fetchBlogs(query, currentPage);

  return (
    <div className="w-full flex justify-center">
      <div className="w-5/6 overflow-hidden">
        <table className="hidden w-full md:table table-fixed">
          <thead className="bg-gray-100 rounded-md text-md">
            <tr>
              <th className="px-4 py-3 font-medium w-28">작성일</th>
              <th className="px-4 py-3 font-medium w-1/2">제목</th>
              <th className="px-4 py-3 font-medium w-24">작성자</th>
              <th className="px-4 py-3 font-medium">기타</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-gray-50">
            {boards?.map((board) => (
              <tr key={board.id} className="">
                <td className="px-4 py-2 text-sm text-center">
                  {board.created_at.substring(0, board.created_at.indexOf("T"))}
                </td>
                <td className="px-4 py-2 truncate text-center hover:bg-indigo-100/20">
                  <Link
                    href={`/more/board/${board.id}`}
                    className="hover:text-blue-600"
                  >
                    {board.title}
                  </Link>
                </td>
                <td className="px-4 py-2 truncate text-center">
                  {board.writer}
                </td>
                <td className="px-4 py-2 overflow-hidden relative">
                  <div className=""></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
