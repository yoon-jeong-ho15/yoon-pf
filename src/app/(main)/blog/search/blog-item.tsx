import { Blog } from "@/lib/definitions";
import Link from "next/link";

export function BlogItem({ id, created_at, title, path }: Blog) {
  const date = new Date(created_at);
  const localDateTime = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(date);

  return (
    <tr className="">
      <td className="hidden">{id}</td>
      <td className="py-2 px-4 text-sm">{localDateTime}</td>
      <td className="py-2 px-4 text-center">
        <Link href={`/blog/${id}`} className="hover:text-blue-600">
          {title}
        </Link>
      </td>
      <td className="py-2 px-4 text-center">{path.join(" > ")}</td>
    </tr>
  );
}
