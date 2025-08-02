import BlogNav from "./ui/blog-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogNav />
      {children}
    </>
  );
}
