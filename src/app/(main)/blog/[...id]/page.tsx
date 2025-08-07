import { getAllBlogIds, getBlogData } from "@/lib/data/blog";
import * as cheerio from "cheerio";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

export async function generateStaticParams() {
  const paths = getAllBlogIds();
  return paths;
}

export default async function Page(props: {
  params: Promise<{ id: string[] }>;
}) {
  const params = await props.params;
  const blog = await getBlogData(params.id);

  const $ = cheerio.load(blog.contentHTML);
  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });

  const contentHTML = $.html();

  return (
    <div className="w-10/12 mb-15">
      <div
        className="flex flex-col
      border border-gray-400 
      my-3 p-2
      rounded-lg"
      >
        <h1 className="text-4xl font-black">{blog.title}</h1>
        <span className="mt-auto ml-auto">
          {new Date(blog.date).toLocaleDateString()}
        </span>
      </div>
      <article
        dangerouslySetInnerHTML={{ __html: contentHTML }}
        className="prose max-w-none bg-gray-50 px-15 pt-8 pb-3"
      />
    </div>
  );
}
