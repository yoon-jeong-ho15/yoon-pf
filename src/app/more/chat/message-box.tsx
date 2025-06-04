"use client";
import { useEffect, useState, useRef } from "react";
import { useChatroom } from "./chatroom-provider";
import { User } from "@/lib/definitions";
import NoProfile from "public/no-profile";
import { ChatMessage } from "@/lib/definitions";

export default function MessageBox({ user }: { user: User }) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[] | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const messageDivRef = useRef<HTMLDivElement | null>(null);
  const chatroomContext = useChatroom()!;
  const setIsSubmitting = chatroomContext.setIsSubmitting;
  const selectedChatroom = chatroomContext.selectedChatroom;

  useEffect(() => {
    if (messageDivRef.current) {
      messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (selectedChatroom) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const sse = new EventSource(
        `/api/sse/chat?ch=${selectedChatroom}&u=${user.username}`
      );
      eventSourceRef.current = sse;

      sse.onopen = () => {
        console.log("sse connection opened");
      };

      sse.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "previous":
              console.log(data);
              setChatMessages([...data.data]);
              break;
            case "new-message":
              console.log(data);
              setChatMessages((prev) => [...(prev ?? []), data.data]);
              if (data.data.sent === user.username) setIsSubmitting(false);
              break;
            case "connected":
              console.log(data);
              break;
          }
        } catch (error) {
          console.error("Error parsing SSE message : ", error);
        }
      };

      sse.onerror = (error) => {
        console.error("sse error : ", error);
      };

      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
      };
    } else {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setChatMessages(null);
    }
  }, [selectedChatroom, user.username]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  if (!selectedChatroom)
    return (
      <div>
        <span>aadsf</span>
      </div>
    );

  return (
    <div className="grow overflow-y-scroll" ref={messageDivRef}>
      {selectedChatroom}
      {chatMessages?.map((chatMessage) => (
        <Message key={chatMessage.id} {...chatMessage} user={user} />
      ))}
    </div>
  );
}

export function Message({
  sent,
  message,
  created_at,
  user,
  profile_pic,
}: ChatMessage & { user: User }) {
  const isMe = sent === user.username;

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
          <span className="text-xs">{sent}</span>
        </div>
        <div className="ml-6 whitespace-normal wrap-anywhere text-shadow-sm">
          {message}
        </div>
      </div>
    </div>
  );
}
