"use client";
import { useEffect, useState, useRef } from "react";
import { useChatroom } from "./chatroom-provider";
import { Chatroom, User } from "@/lib/definitions";
import NoProfile from "public/no-profile";
import { ChatMessage } from "@/lib/definitions";
import { useSession } from "next-auth/react";

export function Message({ sent, message, created_at }: ChatMessage) {
  const { data: session } = useSession();
  const isMe = sent === (session?.user as User)?.username;

  return (
    <div className={`px-5 pb-6 flex ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      <div className="hidden">{created_at}</div>
      <div
        className={`flex h-fit w-fit rounded-2xl py-3 px-6 max-w-180 bg-linear-to-r
          shadow-lg
          ${
            isMe ? "from-indigo-200 to-blue-200" : "from-zinc-200 to-stone-200"
          }`}
      >
        <div className="flex flex-col justify-center items-center">
          <NoProfile size="md" />
          <span>{sent}</span>
        </div>
        <div className="ml-6 text-xl whitespace-normal wrap-anywhere text-shadow-sm">
          {message}
        </div>
      </div>
    </div>
  );
}

export default function MessageBox({
  user,
  chatroom,
}: {
  user: User;
  chatroom?: Chatroom;
}) {
  let selectedChatroom = useChatroom()?.selectedChatroom ?? null;
  if (user.username !== "윤정호") {
    selectedChatroom = chatroom?.id ?? null;
  }
  const [chatMessages, setChatMessages] = useState<ChatMessage[] | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const messageDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageDivRef.current) {
      messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (selectedChatroom) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      const sse = new EventSource(
        `/api/sse/chat?ch=${selectedChatroom}&u=${user.username}`
      );

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
    }
  }, [selectedChatroom]);

  if (!selectedChatroom) return <div>no selected chat room</div>;
  return (
    <div className="grow overflow-y-scroll" ref={messageDivRef}>
      {selectedChatroom}
      {chatMessages?.map((chatMessage) => (
        <Message key={chatMessage.id} {...chatMessage} />
      ))}
    </div>
  );
}
