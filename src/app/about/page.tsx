import { cn } from "@/lib/utils";
import Project from "./_ui/project";
import { d2Coding } from "../fonts";

export default function Page() {
  return (
    <div
      id="about-page"
      className={cn(
        d2Coding.className,
        "flex flex-col gap-8 px-8 items-start mb-16",
      )}
    >
      <div className="bg-surface border border-gray-500 flex flex-col px-4 py-2">
        <h1 className="text-xl font-black">:: 윤정호 yoon jeong ho</h1>
        <div className="flex w-76 border border-gray-300 p-2">
          <img src="/s.jpg" alt="portrait" className="w-full" />
        </div>
      </div>
      <div className="bg-surface border border-gray-500 px-4">
        <h1 className="text-xl font-black">:: education</h1>
        <div className="flex flex-col gap-6 py-4 italic text-sm">
          <div className="flex flex-col border border-gray-300 p-2">
            <span>가톨릭대학교 Catholic University of Korea</span>
            <span>철학과, Department of Philosophy</span>
            <span>2021.03 - 2023.03</span>
          </div>
          <div className="flex flex-col border border-gray-300 p-2">
            <span>
              독학학위제 Bachelor's Degree Examination for Self-Education
            </span>
            <span>영문학 전공, English major</span>
            <span>2020.01 - 2021.01</span>
          </div>
        </div>
      </div>
      <div className="bg-surface border border-gray-500 flex flex-col px-4">
        <h1 className="text-xl font-black">:: experience</h1>
        <Project {...yoonPf} />
        <Project {...realMan} />
        <Project {...giveHub} />
      </div>
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
