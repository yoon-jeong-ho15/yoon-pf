"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";

export default function Search() {
  const [term, setTerm] = useState("");
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      if (searchRef.current) {
        params.delete("query");
      }
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center mt-5 relative">
      <input
        ref={searchRef}
        className="
        w-full rounded-md border-2 border-gray-400 
        py-2 pl-6 pr-12 text-md outline-gray-600
        overflow-hidden
        "
        placeholder="전체 검색"
        onChange={(e) => {
          setTerm(e.target.value);
        }}
        onKeyDown={(e) => (e.key === "Enter" ? handleSearch(term) : null)}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <button
        className="
        flex p-2 border-l-2 border-gray-400 absolute right-0
        cursor-pointer"
        onClick={() => handleSearch(term)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>
    </div>
  );
}
