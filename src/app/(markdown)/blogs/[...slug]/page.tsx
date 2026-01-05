import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import { markdownToHtml } from "@/lib/markdown";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await markdownToHtml(post.content);

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-4">
          {post.frontmatter.title || post.slug[post.slug.length - 1]}
        </h1>
        <div
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          className="markdown-content"
        />
      </article>
    </main>
  );
}
