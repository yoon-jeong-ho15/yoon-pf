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
    const term = formData.get("query")?.toString().trim();

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
        className="bg-surface border border-default py-2 px-4 outline-0 ring-0"
        defaultValue={searchParams.get("query") || ""}
      />
      <button className="bg-surface border border-default border-l-0 p-2">
        search
      </button>
    </form>
  );
}

export function SearchSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`${className} flex whitespace-nowrap animate-pulse`}>
      <div className="border border-default py-2 px-4 w-[200px] bg-skeleton-bg text-transparent select-none">
        &nbsp;
      </div>
      <div className="border border-default border-l-0 p-2 w-[66px] bg-skeleton-bg text-transparent select-none">
        search
      </div>
    </div>
  );
}
