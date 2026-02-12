import { NoteFrontmatter, CategoryFrontmatter } from "@/types";
import Frontmatter from "@/features/(markdown)/components/frontmatter";
import { sortFrontmatter } from "@/features/(markdown)/utils/util";
import { LinkMetadata } from "@/features/(markdown)/lib/metadata";

interface FrontmatterListProps {
  frontmatter: NoteFrontmatter | CategoryFrontmatter;
  type: "note" | "category";
  metadataMap?: Record<string, LinkMetadata>;
}

export default function FrontmatterList({
  frontmatter,
  type,
  metadataMap,
}: FrontmatterListProps) {
  const sortedFrontmatter = sortFrontmatter(frontmatter).filter(
    ([key]) => key !== "title",
  );

  const containerClass =
    type === "note"
      ? "grid grid-flow-col grid-cols-6 gap-x-4 mt-4 rounded divide-y divide-dotted divide-black/20 bg-transparent divide-y-0 xl:grid-cols-5"
      : "flex flex-col rounded-lg divide-y divide-black/20 divide-dotted bg-white/50";

  return (
    <div className={containerClass}>
      {sortedFrontmatter.map(([key, value]) => (
        <div
          key={key}
          className={`
            ${type === "note" ? "bg-white/50 rounded-lg p-2 shadow-sm" : ""}
            ${key === "tags" ? "col-span-3" : ""}
          `}
        >
          <Frontmatter
            type={type}
            label={key}
            value={value}
            metadataMap={metadataMap}
          />
        </div>
      ))}
    </div>
  );
}
