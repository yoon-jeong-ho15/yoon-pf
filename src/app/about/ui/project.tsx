"use client";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export default function Project() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  return (
    <div
      className="
        border border-gray-400 rounded 
        shadow flex flex-col
        overflow-hidden bg-white
        "
    >
      <nav className="flex list-none w-full">
        {tabs.map((item) => (
          <motion.li
            key={item.title}
            onClick={() => setSelectedTab(item)}
            animate={{
              backgroundColor: item === selectedTab ? "#eee" : "#eee0",
            }}
            className="cursor-pointer flex flex-1 justify-center
            items-center relative rounded-t-lg"
          >
            <span className="text-3xl">{item.logo}</span>
            <span className="ml-0.5">{item.title}</span>
          </motion.li>
        ))}
      </nav>
      <div className="flex flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab.title}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -5, opacity: 0 }}
            className="h-30"
          >
            {selectedTab.project.map((project) => (
              <div key={project.title} className="mt-3 ml-2 flex">
                <span className="text-xl">{project.title}</span>
                <a
                  href={project.github}
                  className="text-blue-600 text-sm ml-3 
                   border-blue-500 border-1 px-1 py-0.5 
                   rounded-lg hover:bg-amber-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  github
                </a>
                {project.link && (
                  <a
                    href={project.link}
                    className="text-blue-600 text-sm ml-3 
                   border-blue-500 border-1 px-1 py-0.5 
                   rounded-lg hover:bg-teal-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    link
                  </a>
                )}
                <span className="ml-1">{[...project.stack]}</span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const tabs = [
  {
    title: "Spring-Boot",
    logo: "🌱",
    project: [
      {
        title: "GiveHub",
        github: "https://github.com/shpark47/GiveHub",
        link: "",
        stack: ["Oracle", "TinyMce", ""],
      },
      {
        title: "RealMan",
        github: "https://github.com/JuHyeong2/RealMan",
        link: "",
        stack: [],
      },
    ],
  },
  {
    title: "Next.js",
    logo: "◼️",
    project: [
      {
        title: "yoon-pf",
        github: "https://github.com/yoon-jeong-ho15/yoon-pf",
        link: "https://yoon-pf.vercel.app",
        stack: [],
      },
    ],
  },
];
