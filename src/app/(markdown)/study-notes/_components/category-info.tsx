import { CategoryFrontmatter } from "@/types";
import Frontmatter from "../../../../features/(markdown)/components/frontmatter";
import { sortFrontmatter } from "../../../../features/(markdown)/utils/util";
import { LinkMetadata } from "@/features/(markdown)/lib/metadata";

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
    <div
      className="flex-1 xl:flex-none flex flex-col text-sm p-2 gap-2 
    bg-gradient-to-b from-green-400 to-lime-200"
    >
      <div className="flex flex-col">
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
        className="p-3 bg-white/20 rounded overflow-auto scrollbar-minimal text-slate-700"
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />
    </div>
  );
}
