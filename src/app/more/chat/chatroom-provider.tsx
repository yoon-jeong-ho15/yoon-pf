"use client";
import React, { createContext, useContext, useState } from "react";

type ChatroomContextType = {
  selectedChatroom: string | null;
  setSelectedChatroom: (id: string | null) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  isShowingAddChatroom: boolean;
  setIsShowingAddChatroom: (isShowingAddChatroom: boolean) => void;
};

const ChatroomContext = createContext<ChatroomContextType | null>(null);

export default function ChatroomProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedChatroom, setSelectedChatroom] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowingAddChatroom, setIsShowingAddChatroom] = useState(false);

  return (
    <ChatroomContext.Provider
      value={{
        selectedChatroom,
        setSelectedChatroom,
        isSubmitting,
        setIsSubmitting,
        isShowingAddChatroom,
        setIsShowingAddChatroom,
      }}
    >
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
