import { NoteFrontmatter } from "@/types";
import Frontmatter from "@/features/(markdown)/components/frontmatter";
import { sortFrontmatter } from "@/features/(markdown)/utils/util";
import { LinkMetadata } from "@/features/(markdown)/lib/metadata";

export default function NoteInfo({
  frontmatter,
  allMetadata,
}: {
  frontmatter: NoteFrontmatter;
  allMetadata: Record<string, LinkMetadata>;
}) {
  return (
    <div className="flex-1 flex flex-col divide-y divide-gray-500">
      <div
        className="flex flex-col justify-center pl-12 h-36 xl:h-46 
          bg-blue-400"
      >
        {sortFrontmatter(frontmatter).map(([key, value]) => (
          <Frontmatter
            key={key}
            type="note"
            label={key}
            value={value}
            metadataMap={allMetadata}
          />
        ))}
      </div>
    </div>
  );
}
