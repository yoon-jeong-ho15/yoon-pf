"use client";

import TopBar from "./ui/top-bar";
import Summary from "./summary/summary";
import Chatting from "./chatting/introduce-chatting";
import { useState } from "react";
import Blog from "./blog/introduce-blog";

export default function Page() {
  const [tab, setTab] = useState("summary");
  const handleSelectTab = (str: string) => {
    setTab(str);
  };
  return (
    <div className="flex flex-col w-full flex-grow">
      <TopBar onSelectTab={handleSelectTab} />
      <div className="flex flex-col prose w-full pl-[2%] max-w-[80%]">
        {tab === "summary" && <Summary />}
        {tab === "chatting" && <Chatting />}
        {tab === "blog" && <Blog />}
      </div>
    </div>
  );
}
