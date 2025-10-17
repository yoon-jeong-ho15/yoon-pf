import Project from "./ui/project";

export default function Page() {
  return (
    <div id="about-page" className="flex flex-col flex-grow">
      <div className="mt-8 mx-3 flex flex-col-reverse md:flex-row">
        <div
          className="
        p-4 rounded-lg 
        border w-full 
        md:w-5/12 md:border-0 
        border-gray-300"
        >
          <h1 className="text-xl font-black">:: 프로젝트</h1>
          <Project {...pkmon} />
          <Project {...yoonPf} />
          <Project {...realMan} />
          <Project {...giveHub} />
        </div>
        {/* <div className="w-full md:w-7/12 bg-amber-100 md:mt-3"></div> */}
      </div>
    </div>
  );
}

const yoonPf = {
  title: "yoon-pf",
  github: "https://github.com/yoon-jeong-ho15/yoon-pf",
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
