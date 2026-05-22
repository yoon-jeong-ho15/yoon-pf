import { NoteMeta } from "@/types";
import Image from "next/image";
import { sortFrontmatter, parseReviewItemFrontmatter } from "../utils/util";
import { FrontmatterItem } from "@/components/ui/frontmatter";
import { getImgSrc } from "../lib/data";

export default function ReviewItem({ item }: { item: NoteMeta }) {
  const imgSrc = getImgSrc(item.slug[item.slug.length - 1], "item");
  const sortedFrontmatter = sortFrontmatter(
    parseReviewItemFrontmatter(item.frontmatter),
  );

  return (
    <div className="flex rounded-lg shadow-lg p-6 border border-gray-300">
      <div className="relative w-80 h-80 justify-center overflow-hidden">
        <Image
          src={imgSrc}
          alt="thumbnail"
          fill={true}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col justify-center space-y-7 min-w-80">
        {sortedFrontmatter.map(([key, value]) => (
          <FrontmatterItem
            key={key}
            label={key}
            value={value}
            variant="review"
            renderCustomValue={
              key === "link"
                ? (itemUrl) => (
                    <a
                      href={itemUrl}
                      target="_blank"
                      className="font-bold text-slate-600"
                    >
                      {"#"}
                    </a>
                  )
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
