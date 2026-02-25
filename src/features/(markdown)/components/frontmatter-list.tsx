import { NoteFrontmatter, CategoryFrontmatter } from "@/types";
import Frontmatter from "@/features/(markdown)/components/frontmatter";
import { sortFrontmatter } from "@/features/(markdown)/utils/util";

interface FrontmatterListProps {
  frontmatter: NoteFrontmatter | CategoryFrontmatter;
  type: "note" | "category";
}

export default function FrontmatterList({
  frontmatter,
  type,
}: FrontmatterListProps) {
  const sortedFrontmatter = sortFrontmatter(frontmatter).filter(
    ([key]) => key !== "title",
  );

  if (type === "category") {
    return (
      <div className="flex flex-col divide-y divide-gray-500 divide-dotted bg-white/60">
        {sortedFrontmatter.map(([key, value]) => (
          <Frontmatter
            key={key}
            type={type}
            label={key}
            value={value}
            isArray={Array.isArray(value)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex mt-4 gap-3`}>
      {sortedFrontmatter.map(([key, value]) => (
        <Frontmatter
          key={key}
          type={type}
          label={key}
          value={value}
          isArray={Array.isArray(value)}
        />
      ))}
    </div>
  );
}
