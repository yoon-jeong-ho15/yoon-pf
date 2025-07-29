"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { enterChatroom } from "@/lib/data/chatroom";
import { getUnreadCountsMap } from "@/lib/actions";

type ChatroomContextType = {
  selectedChatroom: string | null;
  setSelectedChatroom: (id: string | null) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  isShowingAddChatroom: boolean;
  setIsShowingAddChatroom: (isShowingAddChatroom: boolean) => void;
  unreadCounts: Map<string, number>;
  setUnreadCounts: React.Dispatch<React.SetStateAction<Map<string, number>>>;
};

const ChatroomContext = createContext<ChatroomContextType | null>(null);

export const useChatroom = () => {
  const context = useContext(ChatroomContext);
  if (!context) {
    throw new Error("useChatroom must be used within a ChatroomProvider");
  }
  return context;
};

export default function ChatroomProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  // console.log("ChatroomProvider received userId:", userId);
  const [selectedChatroom, setSelectedChatroom] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowingAddChatroom, setIsShowingAddChatroom] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(
    new Map()
  );

  // 안 읽은 메시지 수 주기적 업데이트
  useEffect(() => {
    const loadUnreadCounts = async () => {
      if (!userId) {
        console.log("userId is missing, skipping API call.");
        return;
      }
      const countsMap = await getUnreadCountsMap(userId);
      setUnreadCounts(countsMap);
    };

    loadUnreadCounts();
    const interval = setInterval(loadUnreadCounts, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  // 채팅방 변경 시 읽음 처리
  useEffect(() => {
    if (selectedChatroom && userId) {
      enterChatroom(selectedChatroom, userId);
      // 해당 채팅방의 안 읽은 수를 0으로 설정
      setUnreadCounts((prev) => {
        const newMap = new Map(prev);
        newMap.set(selectedChatroom, 0);
        return newMap;
      });
    }
  }, [selectedChatroom, userId]);

  return (
    <ChatroomContext.Provider
      value={{
        selectedChatroom,
        setSelectedChatroom,
        isSubmitting,
        setIsSubmitting,
        isShowingAddChatroom,
        setIsShowingAddChatroom,
        unreadCounts,
        setUnreadCounts,
      }}
    >
      {children}
    </ChatroomContext.Provider>
  );
}
