"use client";

export default function Keyword({ keyword }: { keyword: string }) {
  return (
    <span
      className="
    p-1 rounded-lg border mr-2
    hover:bg-sky-300/50
    hover:shadow -[2px_2px_0px_0px_rgba(0,0,0,1)]
    italic text-xs
    "
    >
      # {keyword}
    </span>
  );
}
