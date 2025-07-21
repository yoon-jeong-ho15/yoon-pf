"use client";

import Link from "next/link";
import Logout from "./logout";
import Alert from "./alert";
import * as motion from "motion/react-client";
import { usePathname } from "next/navigation";

export default function MoreNav() {
  const pathname = usePathname();
  const selectedTab = tabs.find((tab) => tab.href === pathname);

  return (
    <nav
      className="
        flex flex-row items-center justify-between
        bg-gray-100 overflow-hidden
        h-14 w-11/12 mt-3 rounded-2xl shadow-md
        border border-gray-400 relative"
    >
      <div className="flex flex-1 h-full items-center justify-around text-2xl">
        {tabs.map((item) => (
          <MotionLink
            key={item.title}
            href={item.href}
            animate={{
              backgroundColor: item === selectedTab ? "#000" : "",
              color: item === selectedTab ? "#fff" : "",
            }}
            className="relative rounded px-1"
          >
            <span className="z-10 bg-inherit">{item.title}</span>
            {selectedTab === item && (
              <motion.div
                layoutId="tsx"
                transition={{ type: "spring", duration: 0.4, bouncd: 0.05 }}
                className="absolute -right-10 bottom-0 text-black"
              >
                .tsx
              </motion.div>
            )}
          </MotionLink>
        ))}
      </div>
      <div
        className="
        flex flex-row h-full w-fit border-l 
        border-gray-500 bg-gray-100 items-center px-2 z-10
        "
      >
        <Alert />
        <Logout />
      </div>
    </nav>
  );
}

const tabs = [
  {
    title: "profile",
    href: "/more",
  },
  {
    title: "chat",
    href: "/more/chat",
  },
];

const MotionLink = motion.create(Link);
