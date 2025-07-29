import BlogNav from "./ui/blog-nav";
import Write from "./ui/write";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogNav />
      {children}
      <Write />
    </>
  );
}
