import { NoteMeta } from "@/types";
import { FrontmatterItem } from "@/components/ui/frontmatter";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { DEFAULT_IMAGE_FALLBACK } from "@/lib/image-fallback";
import { LinkWithPreview } from "@/components/(markdown)/links";
import { getReviewDisplayFields } from "./review-fields";

export default function ReviewItem({ item }: { item: NoteMeta }) {
  const displayFields = getReviewDisplayFields(item.frontmatter);

  return (
    <div className="flex rounded-lg shadow-lg p-6 border border-muted">
      <div className="relative w-80 h-80 justify-center overflow-hidden">
        <ImageWithFallback
          src={item.itemImage || DEFAULT_IMAGE_FALLBACK}
          alt="thumbnail"
          fill={true}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col justify-center space-y-7 min-w-80">
        {displayFields.map(({ key, value }) => {
          const isLinkField = key === "link";
          return (
            <FrontmatterItem
              key={key}
              label={key}
              value={value}
              variant="review"
              layout={isLinkField ? "col" : "auto"}
              renderCustomValue={
                isLinkField ? (url) => <LinkWithPreview url={url} /> : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}
