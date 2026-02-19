import { CategoryFrontmatter } from "@/types";

import { LinkMetadata } from "@/features/(markdown)/lib/metadata";
import FrontmatterList from "./frontmatter-list";

interface CategoryInfoProps {
  type: "mobile" | "desktop";
  mainInfo: {
    title: string;
    description: string;
    frontmatter: CategoryFrontmatter;
  };
  metadataMap?: Record<string, LinkMetadata>;
}

export default function CategoryInfo({
  type,
  mainInfo,
  metadataMap,
}: CategoryInfoProps) {
  const descriptionHtml = mainInfo.description
    ? `<p>${mainInfo.description}</p>`
    : "";

  return (
    <div
      className={`flex flex-col text-sm p-2 gap-2 
        grow-0 shrink-0 basis-92 xl:w-full xl:basis-68
    bg-gradient-to-b from-green-400 to-lime-200
    `}
    >
      <h1 className="text-2xl font-black text-black text-shadow">
        {">"} {mainInfo.title}
      </h1>
      <FrontmatterList
        frontmatter={mainInfo.frontmatter}
        type="category"
        metadataMap={metadataMap}
      />
      <div
        className="p-3 bg-white/30 rounded overflow-auto scrollbar-minimal"
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />
    </div>
  );
}
