import { markdownToHtml } from "@/lib/markdown";
import { FrontmatterSection } from "../_components/fields";
import { getNoteBySlug } from "../_lib/data";
import { sortFrontmatter } from "../_lib/util";
import Frontmatter from "../../_components/frontmatter";
import PostItem from "../../_components/post-item";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const { type, data } = getNoteBySlug(slug);
  const { category, note } = data;
  const description = await markdownToHtml(category?.description || "");
  const content = await markdownToHtml(note?.body || "");

  return (
    <>
      <div className="w-1/4 h-fitflex flex-col border-t border-r sticky top-20">
        {sortFrontmatter(category.frontmatter).map(([key, value]) => (
          <Frontmatter key={key} type="category" label={key} value={value} />
        ))}
        <div
          className="mt-2 prose-category-desc"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <ul className="mt-2 pl-2 gap-2 py-2">
          {category.notes.map((note, i) => (
            <PostItem key={note.slug.join("/")} note={note} i={i} />
          ))}
        </ul>
      </div>

      <div className="w-3/4 max-w-none">
        {note && (
          <>
            <FrontmatterSection
              data={note.frontmatter}
              type="note"
              parentData={note}
            />
            <article
              className="prose mt-8 max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </>
        )}
      </div>
    </>
  );
}
