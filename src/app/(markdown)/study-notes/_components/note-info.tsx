import { NoteFrontmatter } from "@/types";

import { LinkMetadata } from "@/features/(markdown)/lib/metadata";
import FrontmatterList from "./frontmatter-list";

export default function NoteInfo({
  frontmatter,
  allMetadata,
}: {
  frontmatter: NoteFrontmatter;
  allMetadata: Record<string, LinkMetadata>;
}) {
  return (
    <div
      className="flex flex-col justify-center px-12 h-36 xl:h-46 
          bg-blue-400"
    >
      <h1 className="text-2xl xl:text-3xl font-semibold text-white text-shadow-lg">
        {frontmatter.title}
      </h1>
      <FrontmatterList
        frontmatter={frontmatter}
        type="note"
        metadataMap={allMetadata}
      />
    </div>
  );
}
