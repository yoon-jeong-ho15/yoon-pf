// import { Blog } from "@/lib/definitions";
import Link from "next/link";

export function BlogItem({
  id,
  date,
  title,
  path,
}: {
  id: string;
  date: string;
  title: string;
  path: string[];
}) {
  // const date = new Date(created_at);
  // const localDateTime = new Intl.DateTimeFormat("ko-KR", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  //   hour: "numeric",
  //   minute: "numeric",
  //   hour12: false,
  // }).format(date);

  return (
    <tr className="border">
      <td className="hidden">{id}</td>
      <td className="py-2 px-4 text-sm">
        {new Date(date).toLocaleDateString()}
      </td>
      <td className="py-2 px-4 text-center hover:bg-gray-100">
        <Link href={`/blog/${id}`} className="hover:text-blue-600 ">
          {title}
        </Link>
      </td>
      <td className="py-2 px-4 text-center">
        {path.length > 4
          ? path.splice(path.length - 4).join(" > ")
          : path.join(" > ")}
      </td>
    </tr>
  );
}
