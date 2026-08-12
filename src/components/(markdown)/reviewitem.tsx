import { NoteMeta } from "@/types";
import { sortFrontmatter, parseReviewItemFrontmatter } from "@/lib/frontmatter";
import { FrontmatterItem } from "@/components/ui/frontmatter";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { FRONTMATTER_RENDERERS } from "@/lib/frontmatter-renderers";

export default function ReviewItem({ item }: { item: NoteMeta }) {
  const sortedFrontmatter = sortFrontmatter(
    parseReviewItemFrontmatter(item.frontmatter),
  );

  return (
    <div className="flex rounded-lg shadow-lg p-6 border border-muted">
      <div className="relative w-80 h-80 justify-center overflow-hidden">
        <ImageWithFallback
          src={item.itemImage || "/empty.png"}
          alt="thumbnail"
          fill={true}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col justify-center space-y-7 min-w-80">
        {sortedFrontmatter.map(([key, value]) => {
          return (
            <FrontmatterItem
              key={key}
              label={key}
              value={value as string | string[]}
              variant="review"
              layout={key === "link" ? "col" : "auto"}
              renderCustomValue={FRONTMATTER_RENDERERS[key]}
            />
          );
        })}
      </div>
    </div>
  );
}
