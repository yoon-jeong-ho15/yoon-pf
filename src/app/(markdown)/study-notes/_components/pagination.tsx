import Link from "next/link";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  baseUrl?: string;
}

export default function Pagination({
  totalPage,
  currentPage,
  baseUrl = "/study-notes",
}: PaginationProps) {
  if (totalPage <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-2 text-gray-600">
      {currentPage > 1 ? (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="px-2 py-1 border"
        >
          {"<"}
        </Link>
      ) : (
        <span className="px-2 py-1 border">{"<"}</span>
      )}
      <div>
        {currentPage} / {totalPage}
      </div>
      {currentPage < totalPage ? (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="px-2 py-1 border"
        >
          {">"}
        </Link>
      ) : (
        <span className="px-2 py-1 border">{">"}</span>
      )}
    </div>
  );
}
