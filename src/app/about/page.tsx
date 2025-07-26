import Project from "./ui/project";

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="mt-4 grid grid-cols-3 w-[90%]">
        <div className="col-span-2 p-4 bg-gray-50 rounded-lg mx-1">
          <h1>Project</h1>
          <Project {...yoonPf} />
          <Project {...realMan} />
          <Project {...giveHub} />
        </div>
      </div>
    </div>
  );
}
const yoonPf = {
  title: "yoon-pf",
  github: "https://github.com/yoon-jeong-ho15/yoon-pf",
  about: "https://yoon-pf.vercel.app/about/yoon-pf",
  stack: [
    "Next.js",
    "Next.auth",
    "Supabase",
    "TypeScript",
    "TailwindCSS",
    "Vercel",
  ],
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
