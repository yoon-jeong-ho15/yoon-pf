import Footer from "@/app/(main)/ui/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        flex flex-col flex-grow items-center
        "
    >
      {children}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}
