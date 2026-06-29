import { cn } from "@/lib/utils";
import Project from "@/features/about/components/project";
import { d2Coding } from "../fonts";
import Image from "next/image";
import { MacosCard } from "@/components/ui/macos-card";

export default function Page() {
  return (
    <div
      id="about-page"
      className={cn(
        d2Coding.className,
        "flex flex-col lg:grid lg:grid-cols-3 gap-4 px-8 items-start mb-16 min-h-screen",
      )}
    >
      <MacosCard title="윤정호 yoon jeong ho" randomizePosition containerSelector="#about-page" className="max-w-xs">
        <div className="flex border border-muted p-2 bg-surface">
          <Image src="/s.jpg" alt="portrait" width={304} height={304} className="w-full h-auto" />
        </div>
      </MacosCard>

      <MacosCard title="education" randomizePosition containerSelector="#about-page">
        <div className="flex flex-col gap-4 italic text-sm">
          <div className="flex flex-col border border-muted p-3 bg-surface rounded">
            <span className="font-semibold not-italic">가톨릭대학교 Catholic University of Korea</span>
            <span>철학과, Department of Philosophy</span>
            <span className="text-xs text-text-muted mt-1">2021.03 - 2023.03</span>
          </div>
          <div className="flex flex-col border border-muted p-3 bg-surface rounded">
            <span className="font-semibold not-italic">
              독학학위제 Bachelor&apos;s Degree Examination for Self-Education
            </span>
            <span>영문학 전공, English major</span>
            <span className="text-xs text-text-muted mt-1">2020.01 - 2021.01</span>
          </div>
        </div>
      </MacosCard>

      <MacosCard title="experience" randomizePosition containerSelector="#about-page">
        <div className="flex flex-col gap-1">
          <Project {...npsToday} />
          <Project {...yoonPf} />
          <Project {...realMan} />
          <Project {...giveHub} />
        </div>
      </MacosCard>
    </div>
  );
}

const yoonPf = {
  title: "yoon-pf",
  github: "https://github.com/yoon-jeong-ho15/yoon-pf",
  stack: ["Next.js", "Next.auth", "TypeScript", "TailwindCSS", "Vercel"],
};

const giveHub = {
  title: "Givehub",
  github: "https://github.com/shpark47/GiveHub",
  stack: ["Spring Boot", "Oracle", "MyBatis", "JavaScript", "CSS"],
  desc: "프로젝트 기반 크라우드펀딩 서비스.",
};
const realMan = {
  title: "RealMan",
  github: "https://github.com/JuHyeong2/RealMan",
  stack: ["Spring Boot", "Oracle", "Firebase", "MyBatis", "JavaScript", "CSS"],
  desc: "WebSocket을 사용한 실시간 채팅 서비스.",
};

const npsToday = {
  title: "NPS Today",
  github: "https://github.com/yoon-jeong-ho15/nps-today-frontend",
  link: "https://nps-today.vercel.app",
  stack: ["React", "PostgreSQL", "TailwindCSS"]
}