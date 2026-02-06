import { CategoryFrontmatter } from "@/types";
import Frontmatter from "../../_components/frontmatter";
import { sortFrontmatter } from "../_lib/util";
import { LinkMetadata } from "@/lib/metadata";

interface CategoryInfoProps {
  mainInfo: {
    title: string;
    description: string;
    frontmatter: CategoryFrontmatter;
  };
  metadataMap?: Record<string, LinkMetadata>;
}

export default function CategoryInfo({
  mainInfo,
  metadataMap,
}: CategoryInfoProps) {
  const descriptionHtml = mainInfo.description
    ? `<p>${mainInfo.description}</p>`
    : "";

  return (
    <div className="flex-1 xl:flex-none text-sm divide-y divide-gray-300">
      <div className="p-4 bg-gradient-to-l from-violet-400 to-indigo-100 h-36 xl:h-46">
        {sortFrontmatter(mainInfo.frontmatter).map(([key, value]) => (
          <Frontmatter
            key={key}
            type="category"
            label={key}
            value={value}
            metadataMap={metadataMap}
          />
        ))}
      </div>

      <div
        className="p-4 h-28 overflow-auto scrollbar-minimal"
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />
    </div>
  );
}
