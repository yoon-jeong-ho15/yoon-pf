import { LinkIcon } from "@heroicons/react/24/outline";
import { Category } from "@/types";
import NoteList from "./note-list";

export default function CategoryDetail({ category }: { category: Category }) {
  return (
    <div className="flex flex-col w-full">
      <div>{category.slug.slice(0, -1).join(">")}</div>
      <h1 className="text-2xl font-bold mb-4">{category.frontmatter.title}</h1>
      <div className="flex flex-wrap gap-2 bg-gray-100">
        {category.frontmatter.link &&
          category.frontmatter.link.map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              className="bg-gray-200 rounded p-1 hover:bg-gray-300 "
            >
              <LinkIcon className="size-3" />
            </a>
          ))}
      </div>
      <div className="mt-4">
        <p>{category.description}</p>
      </div>
      <div className="mt-4">
        {category.notes.length > 0 && <NoteList notes={category.notes} />}
      </div>
    </div>
  );
}
