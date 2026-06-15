import { NoteMeta } from "@/types";
import { sortFrontmatter, parseReviewItemFrontmatter } from "../utils/util";
import { FrontmatterItem } from "@/components/ui/frontmatter";
import ImageWithFallback from "@/components/ui/image-with-fallback";

export default function ReviewItem({ item }: { item: NoteMeta }) {
  const fileName = item.slug[item.slug.length - 1];
  const sortedFrontmatter = sortFrontmatter(
    parseReviewItemFrontmatter(item.frontmatter),
  );

  return (
    <div className="flex rounded-lg shadow-lg p-6 border border-muted">
      <div className="relative w-80 h-80 justify-center overflow-hidden">
        <ImageWithFallback
          fileName={fileName}
          type="item"
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
                      className="font-bold text-text-secondary"
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
