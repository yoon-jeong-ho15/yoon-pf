import { Blog } from "@/lib/definitions";
import Link from "next/link";

export function BlogItem({ id, created_at, title, path }: Blog) {
  const date = new Date(created_at);
  const localDateTime = date.toLocaleString();

  return (
    <tr>
      <td className="hidden">{id}</td>
      <td className="text-sm">{localDateTime}</td>
      <td className="text-center">
        <Link href={`/blog/${id}`} className="hover:text-blue-600">
          {title}
        </Link>
      </td>
      <td className="text-center">{path.join(" > ")}</td>
    </tr>
  );
}
