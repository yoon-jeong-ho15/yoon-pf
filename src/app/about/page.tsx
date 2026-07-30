import { cn } from "@/lib/utils";
import Project from "@/components/about/project";
import { d2Coding } from "../fonts";
import Image from "next/image";
import { MacosCard } from "@/components/about/macos-card";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToHtml } from "@/lib/markdown";

async function getProjects() {
  try {
    const projectsDir = path.join(process.cwd(), "md", "projects");
    const files = await fs.promises.readdir(projectsDir);
    const projects = await Promise.all(
      files
        .filter((f) => f.endsWith(".md"))
        .map(async (file) => {
          const filePath = path.join(projectsDir, file);
          const fileContent = await fs.promises.readFile(filePath, "utf8");
          const { data, content } = matter(fileContent);
          const htmlContent = await markdownToHtml(content);
          return {
            title: data.title || "",
            github: data.github || "",
            link: data.link,
            about: data.about,
            stack: data.stack || [],
            order: data.order || 99,
            description: data.description || "",
            htmlContent,
          };
        })
    );
    return projects.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Failed to read project markdown files", error);
    return [];
  }
}

export default async function Page() {
  const projects = await getProjects();

  return (
    <div
      id="about-page"
      className={cn(
        d2Coding.className,
        "flex flex-col lg:grid lg:grid-cols-3 gap-4 px-8 items-start mb-16 min-h-screen",
      )}
    >
      <MacosCard title="윤정호 yoon jeong ho" randomizePosition containerSelector="#about-page" className="max-w-xs">
        <div className="flex p-1 bg-surface">
          <Image src="/s.jpg" alt="portrait" width={304} height={304} className="w-full h-auto rounded-sm object-cover" />
        </div>
      </MacosCard>

      <MacosCard title="education" randomizePosition containerSelector="#about-page">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col border border-muted/60 p-4 bg-surface rounded-md shadow-sm transition-colors hover:border-muted">
            <span className="font-semibold text-base mb-0.5">가톨릭대학교 Catholic University of Korea</span>
            <span className="text-text-secondary">철학과, Department of Philosophy</span>
            <span className="text-xs text-text-muted mt-2 font-mono">2021.03 - 2023.03</span>
          </div>
          <div className="flex flex-col border border-muted/60 p-4 bg-surface rounded-md shadow-sm transition-colors hover:border-muted">
            <span className="font-semibold text-base mb-0.5">
              독학학위제 Bachelor&apos;s Degree Examination for Self-Education
            </span>
            <span className="text-text-secondary">영문학 전공, English major</span>
            <span className="text-xs text-text-muted mt-2 font-mono">2020.01 - 2021.01</span>
          </div>
        </div>
      </MacosCard>

      <MacosCard title="experience" randomizePosition containerSelector="#about-page">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-end gap-3.5 p-1 mb-1 text-xs text-text-muted border-b border-muted/40">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-600" />
              <span>service</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>archived</span>
            </div>
          </div>
          {projects.map((project, idx) => (
            <Project key={idx} {...project} />
          ))}
        </div>
      </MacosCard>
    </div>
  );
}