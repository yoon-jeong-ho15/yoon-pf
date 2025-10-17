import { getAllBlogIds, getBlogData, getCategoryTree } from "@/lib/data/blog";
import CategoryTree from "../ui/category-view/tree";
import "highlight.js/styles/github-dark.css";
import BlogMetaData from "./blog-metadata";

export async function generateStaticParams() {
  const paths = getAllBlogIds();
  return paths;
}

export default async function Page(props: {
  params: Promise<{ id: string[] }>;
}) {
  const params = await props.params;
  const { blog, contentHTML } = await getBlogData(params.id);

  const categoryPath = params.id.slice(0, -1).join("/");

  const { categories } = getCategoryTree();

  return (
    <div className="w-full my-2 md:my-5 md:px-6 flex">
      <CategoryTree categories={categories} selectedCategory={categoryPath} />

      <div className={`w-full mb-15 md:px-25`}>
        <BlogMetaData blog={blog} />
        <article
          dangerouslySetInnerHTML={{ __html: contentHTML }}
          className={`
              prose prose-sm md:prose-base
              max-w-none mt-4
              px-4 pt-5 pb-15
            `}
        />
      </div>
    </div>
  );
}
