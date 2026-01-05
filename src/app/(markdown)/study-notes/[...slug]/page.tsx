import { getAllSlugs, getNoteBySlug } from "../data";
import CategoryDetail from "../_components/category-detail";
import NoteDetail from "../_components/note-detail";

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string[];
  }>;
}) {
  const { slug } = await params;
  const { type, data } = getNoteBySlug(slug);

  return (
    <div className="flex w-full">
      <div className="w-1/3 border-r min-h-screen flex">
        <CategoryDetail category={data.category} />
      </div>
      <div className="w-2/3 flex">
        {type === "note" && <NoteDetail note={data.note} />}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  const slugs = getAllSlugs();

  return slugs.map((slug) => ({
    slug: slug,
  }));
}
