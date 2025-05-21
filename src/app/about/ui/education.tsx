"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function Education() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div
      className="
      border border-gray-400 rounded 
      shadow w-150 flex flex-col
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
            <span className="ml-0.5">{item.type}</span>
            {selectedTab === item && (
              <motion.div
                layoutId="underline"
                className="bg-blue-700 h-[2px] bottom-0 right-0 left-0 absolute"
                transition={{ type: "spring", duration: 0.4, bouncd: 0.2 }}
              />
            )}
          </motion.li>
        ))}
      </nav>
      <div className="flex flex-1">
        <AnimatePresence>
          <motion.div
            className="flex flex-col "
            key={selectedTab ? selectedTab.title : "empty"}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span>{selectedTab.title}</span>
            <span>{selectedTab.description}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const tabs = [
  {
    title: "KH 정보교육원",
    logo: "🖥️",
    type: "교육기관",
    period: "2025.03 수료",
    description: "자바, SQL, HTML, CSS, JavaScript, React",
  },
  {
    title: "가톨릭대학교",
    logo: "🎓",
    type: "학위",
    period: "2023.03 졸업",
    description: "철학",
  },
  {
    title: "독학학위제",
    logo: "📚",
    type: "학위",
    period: "2021.01 졸업",
    description: "영어영문학",
  },
];
