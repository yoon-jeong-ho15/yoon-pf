import Link from "next/link";

export default function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4">
      {pages.map((page) => (
        <Link key={page} href={`/blog/search?page=${page}`}>
          <span
            className={`px-3 py-1 mx-1 rounded border ${
              currentPage === page ? "bg-gray-300" : ""
            }`}
          >
            {page}
          </span>
        </Link>
      ))}
    </div>
  );
}
