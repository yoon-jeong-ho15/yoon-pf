import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorksGallery from "@/components/works/works-gallery";
import WebProjects from "@/components/works/web-projects";
import { WORK_CATEGORIES, WORKS } from "@/data/works";

type Props = { params: Promise<{ category: string }> };

function getCategory(slug: string) {
  const category = WORK_CATEGORIES.find((item) => item.slug === slug);
  if (!category) notFound();
  return category;
}

export function generateStaticParams() {
  return WORK_CATEGORIES.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).category);
  return {
    title: `${category.title} | Works | 윤정호`,
    description: category.description,
  };
}

export default async function WorkCategoryPage({ params }: Props) {
  const category = getCategory((await params).category);
  const works = WORKS.filter((work) => work.category === category.slug);

  return (
    <section className="flex flex-col gap-6" aria-labelledby="category-title">
      <div className="flex flex-col gap-2">
        <h2 id="category-title" className="text-xl font-bold">{category.title}</h2>
        <p className="text-sm text-text-secondary">{category.description}</p>
      </div>
      {category.slug === "web" ? (
        <WebProjects projects={works.filter((work) => work.category === "web")} />
      ) : (
        <WorksGallery initialWorks={works} />
      )}
    </section>
  );
}
