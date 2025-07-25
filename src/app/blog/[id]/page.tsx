import { fetchBlogById } from "@/lib/data";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import "quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import * as cheerio from "cheerio";
import Edit from "./ui/edit";
import Delete from "./ui/delete";
import { Blog } from "@/lib/definitions";

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const blog = (await fetchBlogById(params.id)) as Blog;

  if (!blog) {
    return <div>blog not found</div>;
  }

  const date = new Date(blog.created_at);
  const localDateTime = date.toLocaleString();

  let converter = null;
  if (blog.content) {
    converter = new QuillDeltaToHtmlConverter(blog.content.ops, {});
  }

  const html = converter ? converter.convert() : "";

  const $ = cheerio.load(html);
  const llines: string[][] = [];
  $("pre").each((i, el) => {
    const codeText = $(el).text();
    const lines = codeText.split("\n");
    const firstLine = lines[0].trim();
    let language = "plaintext";
    let codeToHighlight = codeText;

    llines.push(lines);

    if (firstLine.startsWith("lang:")) {
      const specifiedLang = firstLine.replace("lang:", "").trim();
      if (hljs.getLanguage(specifiedLang)) {
        language = specifiedLang;
        codeToHighlight = lines.slice(1).join("\n");
      }
    }

    const highlightedCode =
      language === "plaintext"
        ? hljs.highlightAuto(codeToHighlight).value
        : hljs.highlight(codeToHighlight, { language, ignoreIllegals: true })
            .value;

    $(el).html(highlightedCode);
    $(el).addClass("hljs");
  });

  const contentHtml = $.html();

  return (
    <div className="container mx-auto px-4 py-8 mt-4">
      <div className="mx-33 flex text-3xl items-center relative">
        <span
          className="py-2 mt-3
          text-center border-b-2 border-gray-700"
        >
          {blog.title}
        </span>
        <span className="text-sm max-w-50 absolute bottom-2 right-14">
          {localDateTime}
        </span>
      </div>
      <div
        className="
        h-20 flex flex-row-reverse items-center mx-33 border-b border-gray-300"
      >
        <Delete id={blog.id} />
        <Edit id={blog.id} />
      </div>
      <article
        className="h-190 ml-20 mr-25 mt-5 prose prose-lg prose-blog max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      ></article>
      {/* <div>{html}</div>
      <div>
        {llines.map((tag: string[]) =>
          tag.map((item: string, i: number) => {
            return <div key={i}>{item}</div>;
          })
        )}
      </div> */}
    </div>
  );
}
