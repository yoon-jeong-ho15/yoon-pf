import Project from "./ui/project";

export default function Page() {
  return (
    <div id="about-page" className="flex flex-col flex-grow">
      <div className="mt-4 mx-3 flex flex-col">
        <div className="p-4 my-3 rounded-lg border border-gray-300">
          <h1 className="text-xl font-black">:: 프로젝트</h1>
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
  // about: "/aboutthispage",
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
