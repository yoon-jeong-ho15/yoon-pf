import TopButton from "@/components/top-button";
import { NoteMeta } from "@/types";

interface ThoughtPageProps {
    meta: NoteMeta;
    content: string;
}

export default function ThoughtPage({ meta, content }: ThoughtPageProps) {
    return (
        <div className="flex-1 flex items-start min-h-screen p-4 mb-16">
            <main className="flex-1 flex flex-col min-h-screen bg-surface border border-default w-full gap-6 py-6">
                <div className="flex justify-center gap-14 items-end">
                    <div className="text-5xl font-bold">{meta.frontmatter.title}</div>
                    <div className="text-xs text-muted">{meta.frontmatter.date}</div>
                </div>
                <article
                    className="prose dark:prose-invert my-8 text-sm max-w-[90dvw] md:max-w-xl lg:max-w-2xl xl:text-base xl:max-w-3xl mx-auto px-4 2xl:px-0"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
                <TopButton />
            </main>
        </div>
    )
}