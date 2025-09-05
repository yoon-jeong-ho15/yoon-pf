import { getAllBlogIds, getBlogData } from "@/lib/data/blog";
// import * as cheerio from "cheerio";
// import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import localFont from "next/font/local";

const kopub = localFont({
  src: [
    {
      path: "./localfonts/KoPubWorldBatangMedium.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./localfonts/KoPubWorldBatangBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
});

export async function generateStaticParams() {
  const paths = getAllBlogIds();
  return paths;
}

export default async function Page(props: {
  params: Promise<{ id: string[] }>;
}) {
  const params = await props.params;
  const blog = await getBlogData(params.id);

  // const $ = cheerio.load(blog.contentHTML);
  // $("pre code").each((_, elm) => {
  //   const result = hljs.highlightAuto($(elm).text());
  //   $(elm).html(result.value);
  //   $(elm).addClass("hljs");
  // });

  // const contentHTML = $.html();

  return (
    <div
      className={`
      w-full md:w-8/12 
      mb-15 mt-3 md:mt-8
    bg-gray-100
    `}
    >
      <div
        className="
      flex flex-col
      border-b
      p-2 mt-5
      md:my-0
      md:border-b-2
      md:border-gray-300
      md:bg-white
      "
      >
        <h1
          className="
        text-xl 
        text-shadow-sm
        font-black
        md:text-4xl
        md:ml-10
        "
        >
          {blog.title}
        </h1>
        <span className="text-sm md:text-md mt-auto ml-auto">
          {new Date(blog.date).toLocaleDateString()}
        </span>
      </div>
      <article
        dangerouslySetInnerHTML={{ __html: blog.contentHTML }}
        className={`
          ${kopub.className}
          prose prose-sm md:prose-base 
          max-w-none
          px-4 pt-5 pb-15 md:px-15
        `}
      />
    </div>
  );
}
