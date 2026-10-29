import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import type { WebWorkItem } from "@/data/works";

export default function WebProjects({ projects }: { projects: WebWorkItem[] }) {
  if (projects.length === 0) {
    return <p className="py-20 text-center text-text-muted">등록된 웹 프로젝트가 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <article key={project.url} className="flex flex-col overflow-hidden rounded border border-default bg-surface">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} 사이트 방문 (새 탭)`}
            className="group relative block aspect-video overflow-hidden border-b border-default bg-layout-bg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground"
          >
            <ImageWithFallback
              src={project.image}
              alt={`${project.title} 프로젝트 썸네일`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
              sizes="(max-width: 767px) 100vw, (max-width: 1280px) 50vw, 600px"
            />
          </a>
          <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
            <div>
              <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{project.description}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium">주요 기능</h4>
              <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-text-secondary">
                {project.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} 사이트 방문 (새 탭)`}
              className="mt-auto flex items-center justify-between gap-3 rounded border border-default px-4 py-3 text-sm transition-colors hover:bg-hover-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="font-medium">사이트 방문</span>
                <span className="truncate text-xs text-text-muted">{new URL(project.url).hostname}</span>
              </span>
              <ArrowUpRightIcon aria-hidden="true" className="size-5 shrink-0" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
