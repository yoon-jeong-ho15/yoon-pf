import type { ReactNode } from "react";
import type { NoteMeta } from "@/types";
import TopButton from "@/components/top-button";

export default function PostContent({
  meta,
  content,
  children,
}: {
  meta: NoteMeta;
  content: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex-1 flex items-start min-h-screen p-4 mb-16">
      <main className="flex-1 flex flex-col min-h-screen bg-surface border border-default w-full gap-6 py-6">
        <header className="flex justify-center gap-14 items-end">
          <h1 className="text-5xl font-bold">{meta.frontmatter.title}</h1>
          <div className="text-xs text-muted">{meta.frontmatter.date}</div>
        </header>
        {children}
        <article
          className="prose dark:prose-invert my-8 text-sm max-w-[90dvw] md:max-w-xl lg:max-w-2xl xl:text-base xl:max-w-3xl mx-auto px-4 2xl:px-0"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <TopButton />
      </main>
    </div>
  );
}
