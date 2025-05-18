"use client";
import { useEffect } from "react";
import { useChatroom } from "./chatroom-provider";

export default function MessageBox() {
  const selectedChatroom = useChatroom()?.selectedChatroom;

  useEffect(() => {
    if (selectedChatroom) {
      console.log("selectedChatroom : ", selectedChatroom);
    }
  }, [selectedChatroom]);

  return <div className="grow overflow-y-scroll">{selectedChatroom}</div>;
}
