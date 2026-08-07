import { NoteMeta } from "@/types";
import { sortFrontmatter, parseReviewItemFrontmatter } from "@/lib/frontmatter";
import { FrontmatterItem } from "@/components/ui/frontmatter";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { SidebarLink } from "./links";

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
          const renderers: Record<string, (val: string) => React.ReactNode> = {
            link: (itemUrl) => <SidebarLink url={itemUrl} />,
          };

          return (
            <FrontmatterItem
              key={key}
              label={key}
              value={value as string | string[]}
              variant="review"
              layout={key === "link" ? "col" : "auto"}
              renderCustomValue={renderers[key]}
            />
          );
        })}
      </div>
    </div>
  );
}
