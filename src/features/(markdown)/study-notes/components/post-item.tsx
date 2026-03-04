"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PostItem({
  variant,
  title,
  order,
  slug,
  i,
  onSelect,
}: {
  variant: "mobile" | "desktop";
  title: string;
  order?: number;
  slug: string[];
  i: number;
  onSelect?: () => void;
}) {
  const pathname = usePathname();
  const isCurrent = pathname.endsWith(slug.join("/"));
  const href = `/study-notes/${slug.join("/")}`;

  if (variant === "desktop") {
    return (
      <Link href={href}>
        <span
          className={`text-orange-800 hover:bg-zinc-100 ${
            isCurrent
              ? "bg-zinc-200 underline decoration-red-500 decoration-dotted decoration-2"
              : ""
          }`}
        >{`"${order ? order : i + 1}. ${title}"`}</span>
      </Link>
    );
  }

  if (variant === "mobile") {
    return (
      <li className="">
        <Link
          href={href}
          onClick={onSelect}
          className={`flex w-full py-2 px-2 pr-6 items-center gap-1
          ${isCurrent ? "bg-blue-100" : ""}`}
        >
          <span className="text-slate-700">{order ? order : i + 1}.</span>
          <span className="whitespace-nowrap">{title}</span>
        </Link>
      </li>
    );
  }
}
