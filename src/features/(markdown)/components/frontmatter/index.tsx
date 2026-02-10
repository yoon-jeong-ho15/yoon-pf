import { LinkMetadata } from "@/features/(markdown)/lib/metadata";
import Title from "./title";
import Link from "./link";
import Default from "./default";

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
  if (label === "title") return <Title value={value} type={type} />;
  if (label === "link")
    return <Link value={value} type={type} metadataMap={metadataMap} />;

  return <Default label={label} value={value} type={type} />;
}
