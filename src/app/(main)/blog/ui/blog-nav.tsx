"use client";
import Link from "next/link";
import { useState } from "react";

export default function BlogNav() {
  const [selectedTab, setSelectedTab] = useState("카테고리");

  return (
    <nav className="flex w-6/12 mt-3 justify-center">
      <div className="bg-gray-100 flex justify-center items-center rounded-full">
        {tabs.map((tab, i) => (
          <Link
            key={tab.title}
            href={tab.href}
            className={`
              px-4 ${selectedTab === tab.title ? "bg-gray-200" : ""}
              ${i === 0 && "rounded-l-full"}
              ${i === tabs.length - 1 && "rounded-r-full"}
              `}
            onClick={() => setSelectedTab(tab.title)}
          >
            {tab.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const tabs = [
  {
    title: "카테고리",
    href: "/blog",
  },
  {
    title: "전체보기",
    href: "/blog/search",
  },
];
