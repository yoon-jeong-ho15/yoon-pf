import { NoteMeta } from "@/types";
import { sortFrontmatter, parseReviewItemFrontmatter } from "@/lib/frontmatter";
import { FrontmatterItem } from "@/components/ui/frontmatter";
import ImageWithFallback from "@/components/ui/image-with-fallback";

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
            link: (itemUrl) => {
              let displayLabel = itemUrl;
              try {
                displayLabel = new URL(itemUrl).hostname;
              } catch {}
              return (
                <a
                  href={itemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-text-secondary hover:underline inline-flex items-center gap-1"
                >
                  {displayLabel}
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              );
            }
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
