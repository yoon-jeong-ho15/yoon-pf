"use client";

import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useState } from "react";

export default function SharedLayoutAnimation() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div className="w-[480px] h-[60vh] max-h-[360px] rounded-lg bg-white overflow-hidden shadow-2xl flex flex-col">
      <nav className="bg-[#fdfdfd] p-[5px_5px_0] rounded-t-lg border-b border-[#eeeeee] h-11">
        <ul className="list-none p-0 m-0 font-medium text-sm flex w-full">
          {tabs.map((item) => (
            <motion.li
              key={item.label}
              initial={false}
              animate={{
                backgroundColor: item === selectedTab ? "#eee" : "#eee0",
              }}
              className="list-none p-0 m-0 font-medium text-sm rounded-t-md w-full px-[15px] py-[10px] relative bg-white cursor-pointer h-6 flex justify-between items-center flex-1 min-w-0 select-none text-[#0f1115]"
              onClick={() => setSelectedTab(item)}
            >
              {`${item.icon} ${item.label}`}
              {item === selectedTab ? (
                <motion.div
                  layoutId="underline"
                  id="underline"
                  className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-blue-400"
                  transition={{
                    type: "spring",
                    duration: 0.3,
                    bounce: 0.5,
                  }}
                />
              ) : null}
            </motion.li>
          ))}
        </ul>
      </nav>
      <main className="flex justify-center items-center flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab ? selectedTab.label : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[128px]"
          >
            {selectedTab ? selectedTab.icon : "😋"}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/**
 * ==============   Data   ================
 */

const allIngredients = [
  { icon: "🍅", label: "Tomato" },
  { icon: "🥬", label: "Lettuce" },
  { icon: "🧀", label: "Cheese" },
  { icon: "🥕", label: "Carrot" },
  { icon: "🍌", label: "Banana" },
  { icon: "🫐", label: "Blueberries" },
  { icon: "🥂", label: "Champers?" },
];

const [tomato, lettuce, cheese] = allIngredients;
const tabs = [tomato, lettuce, cheese];
