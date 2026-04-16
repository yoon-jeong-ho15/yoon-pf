"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function Search({
  path,
  className,
}: {
  path: string;
  className?: string | "";
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const term = formData.get("query")?.toString();

    if (!term || term.trim() === "") return;

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    router.push(`${path}?${params.toString()}`);
  };

  return (
    <form
      className={`${className} flex whitespace-nowrap`}
      onSubmit={handleSearch}
    >
      <input
        name="query"
        className="bg-surface border border-gray-500 py-2 px-4 outline-0 ring-0 underline"
        defaultValue={searchParams.get("query") || ""}
      />
      <button className="bg-surface border border-gray-500 border-l-0 p-2">
        search
      </button>
    </form>
  );
}
