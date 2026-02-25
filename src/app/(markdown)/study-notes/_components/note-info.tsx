import { NoteFrontmatter } from "@/types";
import { nanumGothicCoding } from "@/app/fonts";

import { LinkMetadata } from "@/features/(markdown)/lib/metadata";
import FrontmatterList from "../../../../features/(markdown)/components/frontmatter-list";

export default function NoteInfo({
  frontmatter,
}: {
  frontmatter: NoteFrontmatter;
}) {
  return (
    <div
      className="flex flex-col divide-y justify-center items-center px-12 min-h-36 xl:min-h-46 
          bg-blue-400 py-5"
    >
      <h1
        className={`text-4xl md:text-5xl font-bold text-shadow tracking-wide py-2`}
      >
        {frontmatter.title}
      </h1>
      <FrontmatterList frontmatter={frontmatter} type="note" />
    </div>
  );
}
