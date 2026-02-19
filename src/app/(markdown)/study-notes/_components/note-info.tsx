import { NoteFrontmatter } from "@/types";
import { nanumGothic } from "@/app/fonts";

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
      className="flex flex-col justify-center items-center px-12 min-h-36 xl:min-h-46 
          bg-blue-400 py-5"
    >
      <h1
        className={`text-4xl md:text-5xl font-black text-shadow tracking-wider py-2`}
      >
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
