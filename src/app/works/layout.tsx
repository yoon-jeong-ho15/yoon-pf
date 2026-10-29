import Link from "next/link";
import WorksNav from "@/components/works/works-nav";

export default function WorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-start min-h-screen p-4 md:p-6 max-w-7xl w-full mx-auto">
      <div className="bg-surface border border-default w-full p-4 md:p-6 rounded-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight border-b border-default pb-3">
          <Link href="/works">Works</Link>
        </h1>
        <WorksNav />
        {children}
      </div>
    </div>
  );
}
