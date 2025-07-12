"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { enterChatroom } from "@/lib/data";

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
  console.log("ChatroomProvider received userId:", userId);
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
      try {
        console.log("Calling get_unread_message_counts with userId:", userId);
        const { data, error } = await supabase.rpc(
          "get_unread_message_counts",
          {
            p_user_id: userId,
          }
        );
        console.log("unread counts data:", data);
        if (error) {
          console.error("Error fetching unread counts:", error);
          console.error("Full error object:", JSON.stringify(error, null, 2));
          console.error("Data received with error:", data);
        } else if (data) {
          const countsMap = new Map();
          data.forEach(
            (item: { chatroom_id: string; unread_count: number }) => {
              countsMap.set(item.chatroom_id.toString(), item.unread_count);
            }
          );
          setUnreadCounts(countsMap);
        }
      } catch (error) {
        console.error("Failed to load unread counts:", error);
      }
    };

    loadUnreadCounts();
    const interval = setInterval(loadUnreadCounts, 30000); // 30초마다

    return () => clearInterval(interval);
  }, [userId]);

  // 채팅방 변경 시 읽음 처리
  useEffect(() => {
    console.log(
      "Entering chatroom with ID:",
      selectedChatroom,
      "Type:",
      typeof selectedChatroom
    );
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
