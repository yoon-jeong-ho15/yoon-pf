import { LinkMetadata } from "@/features/(markdown)/lib/metadata";
import Link from "./link";
import Default from "./default";
import Tags from "./tags";

export default function Frontmatter({
  type,
  label,
  value,
  metadataMap,
}: {
  type: "category" | "note";
  label: string;
  value: any;
  metadataMap?: Record<string, LinkMetadata>;
}) {
  if (label === "link")
    return <Link value={value} type={type} metadataMap={metadataMap} />;
  if (label === "tags") return <Tags label={label} value={value} type={type} />;

  return <Default label={label} value={value} type={type} />;
}
