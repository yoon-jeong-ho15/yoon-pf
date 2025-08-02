import { fetchBlogById } from "@/lib/data/blog";
import Editor from "./editor";

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const blog = await fetchBlogById(params.id);
  return (
    <div id="blog-edit-page" className="flex flex-col items-center my-3">
      <div className="flex flex-row w-[90%]">
        <Editor blog={blog} />
      </div>
    </div>
  );
}
