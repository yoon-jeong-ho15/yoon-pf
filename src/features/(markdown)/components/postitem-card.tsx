import { NoteMeta } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { getImgSrc } from "../lib/data";

export default function PostItemCard({ item }: { item: NoteMeta }) {
  const imgSrc = getImgSrc(item.slug[item.slug.length - 1], "thumbnail");

  return (
    <div
      className="border border-gray-500 flex flex-col px-2"
      key={item.slug.join("/")}
    >
      <div className="text-xs border-b w-fit p-1 pr-4 flex gap-2">
        {item.slug.slice(0, -1).map((slugPart, i) => (
          <span
            key={i}
            className="not-last:after:content-['>'] not-last:after:ml-2"
          >
            {slugPart}
          </span>
        ))}
      </div>

      <Link className="" href={`/blogs/${item.slug.join("/")}`}>
        <div className="p-1 overflow-hidden relative w-full h-78 bg-gray-100 flex items-center justify-center my-2 shadow">
          <Image
            src={imgSrc}
            alt="thumbnail"
            fill={true}
            className="object-cover hover:scale-105 transition-all duration-300"
          />
        </div>
        <span className="text-2xl font-bold">{item.frontmatter.title}</span>
      </Link>
      <span className="text-[0.6rem] text-gray-400">
        {item.frontmatter.date}
      </span>
      <div className="text-xs p-3">
        {item.frontmatter.tags?.map((tag, i) => (
          <span
            className="mr-1 not-last:after:content-[','] bg-neutral-100 rounded border border-neutral-300 px-1"
            key={i}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
