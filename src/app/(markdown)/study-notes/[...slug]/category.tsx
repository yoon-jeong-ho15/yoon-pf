import { SidebarLink } from "@/features/(markdown)/study-notes/components/frontmatter/links";
import { sortFrontmatter } from "@/features/(markdown)/utils/util";
import { CategoryTree, NoteMeta } from "@/types";
import Link from "next/link";

const getAllNotes = (node: CategoryTree): NoteMeta[] => {
  let allNotes = [...(node.notes || [])];
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      allNotes = allNotes.concat(getAllNotes(child));
    });
  }
  return allNotes;
};

export default function CategoryPage({
  categoryNode,
}: {
  categoryNode: CategoryTree;
}) {
  const sortedFrontmatter = sortFrontmatter(categoryNode.frontmatter);
  const allNotes = getAllNotes(categoryNode);
  const hasNotes = allNotes.length > 0;

  return (
    <div
      className={`flex flex-1 p-4 font-medium min-h-[calc(100vh-4rem)] border-l border-gray-500 pl-16`}
    >
      <div className="flex flex-col flex-1">
        <div className="pl-1 py-3">
          <div className="pl-3 pb-4">
            {sortedFrontmatter.map(([key, value], index) => {
              const hasComma = index < sortedFrontmatter.length - 1 || hasNotes;
              if (key === "link") {
                return (
                  <div key={key} className="flex">
                    <div className="shrink-0 whitespace-pre">
                      <span className={color.key}>{`${key}`}</span>
                      <span>{" : ["}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      {(value as string[]).map((item: string, idx: number) => (
                        <span key={item} className="flex">
                          <SidebarLink
                            url={item}
                            isLast={idx === value.length - 1}
                          />
                          {idx === value.length - 1 ? (
                            <span>{`]${hasComma ? "," : ""}`}</span>
                          ) : (
                            <span>,</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }
              if (Array.isArray(value) && value.length > 1) {
                return (
                  <div key={key} className="flex">
                    <div className="shrink-0 whitespace-pre">
                      <span className={color.key}>{`${key}`}</span>
                      <span>{" : ["}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      {value.map((item: string, idx: number) => (
                        <span key={item}>
                          <span className={color.value}>{`"${item}"`}</span>
                          {idx === value.length - 1 ? (
                            <span>{`]${hasComma ? "," : ""}`}</span>
                          ) : (
                            <span>,</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <div key={key}>
                  <span className={color.key}>{key}</span>
                  <span>{" : "}</span>
                  <span className={color.value}>{`"${value}"`}</span>
                  {hasComma && ","}
                </div>
              );
            })}
            <div className="mt-3">
              <span className={color.key}>{"description"}</span>
              <span>{" : "}</span>
              <span className={color.value}>
                {categoryNode.description
                  ? `"${categoryNode.description}"`
                  : "null"}
              </span>
            </div>
            {hasNotes && (
              <div key="notes" className="mt-3">
                <div className={color.comment}>{"// click to navigate"}</div>
                <span className={color.key}>notes</span>
                <span>{" : ["}</span>
                <div className="pl-3 flex flex-col">
                  {allNotes.map((note, index) => (
                    <span key={note.slug.join("/")}>
                      <Link
                        href={`/study-notes/${note.slug.join("/")}`}
                        className={`${color.value} hover:underline`}
                      >
                        {`"${note.frontmatter?.title || note.slug[note.slug.length - 1]}"`}
                      </Link>
                      {index < allNotes.length - 1 && ","}
                    </span>
                  ))}
                </div>
                <span>{`]`}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const color = {
  comment: "text-green-800",
  const: "text-fuchsia-600",
  brace: "text-blue-500",
  semicolon: "text-gray-500",
  key: "text-blue-800",
  key2: "text-blue-800",
  value: "text-orange-800",
};
