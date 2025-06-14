"use client";
import { useEffect, useState, useRef } from "react";
import { useChatroom } from "./chatroom-provider";
import { User } from "@/lib/definitions";
import { NoProfile } from "public/icon";
import { ChatMessage } from "@/lib/definitions";
import { supabase } from "@/lib/supabase";
import { fetchChatsByChatroomId } from "@/lib/data";
import MessageBoxWelcome from "@/app/ui/motions/message-box-welcome";

export default function MessageBox({ user }: { user: User }) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[] | null>(null);
  const messageDivRef = useRef<HTMLDivElement | null>(null);
  const chatroomContext = useChatroom()!;
  const { setIsSubmitting, selectedChatroom } = chatroomContext;

  const loadPrevChats = async () => {
    if (selectedChatroom) {
      const previousChats = await fetchChatsByChatroomId(selectedChatroom);
      setChatMessages(previousChats);
    }
  };

  useEffect(() => {
    if (messageDivRef.current) {
      messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!selectedChatroom) return;

    loadPrevChats();

    const channel = supabase.channel(`ch${selectedChatroom}`);
    channel.on("broadcast", { event: "new-message" }, (data) => {
      const message = data.payload;

      setChatMessages((prev) => [...(prev ?? []), message]);

      if (message.username === user.username) {
        setIsSubmitting(false);
      }
    });
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChatroom]);

  if (!selectedChatroom) return <MessageBoxWelcome />;
  return (
    <div className="grow overflow-y-scroll pt-2" ref={messageDivRef}>
      <input type="hidden" value={selectedChatroom} />
      {chatMessages?.map((chatMessage) => (
        <Message key={chatMessage.id} {...chatMessage} user={user} />
      ))}
    </div>
  );
}

export function Message({
  username,
  message,
  created_at,
  user,
  profile_pic,
}: ChatMessage & { user: User }) {
  const isMe = username === user.username;

  return (
    <div className={`px-5 pb-6 flex ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      <div className="hidden">{created_at}</div>
      <div
        className={`flex h-fit w-fit rounded-2xl py-1 pl-2 pr-5 max-w-180 bg-linear-to-r
          shadow-lg items-center
          ${
            isMe ? "from-indigo-200 to-blue-200" : "from-zinc-200 to-stone-200"
          }`}
      >
        <div className="flex flex-col justify-center items-center">
          {profile_pic ? (
            <div className="size-12 bg-white">{profile_pic}</div>
          ) : (
            <NoProfile size="md" />
          )}
          <span className="text-xs">{username}</span>
        </div>
        <div className="ml-6 whitespace-normal wrap-anywhere text-shadow-sm">
          {message}
        </div>
      </div>
    </div>
  );
}
