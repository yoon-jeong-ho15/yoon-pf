"use client";
import React, { createContext, useContext, useState } from "react";

type ChatroomContextType = {
  selectedChatroom: string | null;
  selectChatroom: (id: string) => void;
};

const ChatroomContext = createContext<ChatroomContextType | null>(null);

export default function ChatroomProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedChatroom, setSelectedChatroom] = useState<string | null>(null);

  const selectChatroom = (id: string) => {
    setSelectedChatroom(id);
  };

  return (
    <ChatroomContext.Provider value={{ selectedChatroom, selectChatroom }}>
      {children}
    </ChatroomContext.Provider>
  );
}

export function useChatroom() {
  const context = useContext(ChatroomContext);
  if (context === undefined) {
    throw new Error("useChatroom must be used within a ChatroomProvider");
  }
  return context;
}
