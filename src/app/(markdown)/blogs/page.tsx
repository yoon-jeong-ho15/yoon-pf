import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";

export default async function BlogIndexPage() {
  const posts = getAllBlogPosts();
  // Take the first 12 posts
  const recentPosts = posts.slice(0, 12);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentPosts.map((post) => (
          <Link
            key={post.slugString}
            href={`/blogs/${post.slugString}`}
            className="block group"
          >
            <article className="h-full border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card text-card-foreground p-6 flex flex-col items-start justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.frontmatter.title || post.slug[post.slug.length - 1]}
                </h2>
                {post.frontmatter.date && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {new Date(post.frontmatter.date).toLocaleDateString()}
                  </p>
                )}
                <p className="text-muted-foreground line-clamp-3 mb-4">
                  {post.frontmatter.description ||
                    post.content.slice(0, 150) + "..."}
                </p>
              </div>
              <div className="text-sm font-medium text-primary mt-auto">
                Read more →
              </div>
            </article>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground mt-12">
          No posts found.
        </p>
      )}
    </div>
  );
}
