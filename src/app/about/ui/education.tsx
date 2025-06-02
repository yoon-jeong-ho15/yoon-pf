"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function Education() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div
      className="
      border border-gray-400 rounded 
      shadow flex flex-col
      overflow-hidden bg-white
      "
    >
      <nav className="flex list-none">
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
        <AnimatePresence mode="wait">
          <motion.div
            className="flex flex-col p-3 h-60"
            key={selectedTab ? selectedTab.title : "empty"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-lg text-blue-600">{selectedTab.title}</span>
            <span className="text-xs text-gray-500">{selectedTab.period}</span>
            <span className="mt-2">{selectedTab.description}</span>
            {selectedTab.more && (
              <>
                <span className="mt-3 text-lg  text-blue-600">
                  {selectedTab.more.title}
                </span>
                <span className="text-xs text-gray-500">
                  {selectedTab.more.period}
                </span>
                <span className="mt-2">{selectedTab.more.description}</span>
              </>
            )}
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
    description: "Java / Oracle DB / Spring-Boot / HTML / CSS / JavaScript",
  },
  {
    title: "가톨릭대학교",
    logo: "🎓",
    type: "학위",
    period: "2023.03 졸업",
    description: "철학",
    more: {
      title: "독학학위제",
      period: "2021.01 졸업",
      description: "영어영문학",
    },
  },
];
