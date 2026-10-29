import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { WORK_CATEGORIES, WORKS } from "@/data/works";

export const metadata = {
  title: "Works | 윤정호",
  description: "Works by Yoon Jeong Ho",
};

export default function WorksPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {WORK_CATEGORIES.map((category) => {
        const count = WORKS.filter((work) => work.category === category.slug).length;

        return (
          <Link
            key={category.slug}
            href={`/works/${category.slug}`}
            className="group flex flex-col gap-6 rounded border border-default p-5 md:p-6 transition-colors hover:border-foreground hover:bg-hover-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">{category.title}</h2>
              <ArrowUpRightIcon aria-hidden="true" className="size-5 text-text-muted transition-colors group-hover:text-foreground" />
            </div>
            <p className="text-sm text-text-secondary">{category.description}</p>
            <span className="text-xs text-text-muted">작업 {count}개</span>
          </Link>
        );
      })}
    </div>
  );
}
