import { remark } from "remark";
import html from "remark-html";

export function markdownToHtml(markdown: string) {
  const result = remark().use(html).processSync(markdown);
  return result.toString();
}
