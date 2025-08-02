import BlogNav from "./ui/blog-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id="blog-layout" className="flex flex-col items-center">
      <BlogNav />
      {children}
    </div>
  );
}
