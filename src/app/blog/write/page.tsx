import { fetchCategories } from "@/lib/data/blog";
import Editor from "./editor";
// import { Category } from "@/lib/definitions";

export default async function Page() {
  const categories = await fetchCategories();

  return (
    <div className="flex flex-col items-center my-3">
      <div className="flex flex-row w-[90%]">
        <Editor categories={categories} />
      </div>
    </div>
  );
}
