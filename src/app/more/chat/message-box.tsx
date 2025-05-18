"use client";
import { useEffect, useState } from "react";
import { useChatroom } from "./chatroom-provider";
import { Chatroom, User } from "@/lib/definitions";
import NoProfile from "public/no-profile";
import { getChatsByChatroomId } from "@/lib/actions";
import { ChatMessage } from "@/lib/definitions";
import { useSession } from "next-auth/react";

export function Message({ sent, profile_pic, message }: ChatMessage) {
  const { data: session } = useSession();
  const isMe = sent == (session?.user as User)?.username ? true : false;

  return (
    <div className={`px-5 pb-6 flex ${isMe ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-fit w-fit rounded-2xl py-3 px-6 max-w-180 bg-linear-to-r
          shadow-lg
          ${
            isMe ? "from-indigo-200 to-blue-200" : "from-zinc-200 to-stone-200"
          }`}
      >
        <div className="flex flex-col justify-center items-center">
          {profile_pic ? <div>{profile_pic}</div> : <NoProfile size="md" />}
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

  useEffect(() => {
    if (selectedChatroom) {
      async function loadChats() {
        const data = await getChatsByChatroomId(selectedChatroom as string);
        setChatMessages(data);
      }
      loadChats();
    }
  }, [selectedChatroom]);

  if (!selectedChatroom) return <div>no selected chat room</div>;
  return (
    <div className="grow overflow-y-scroll">
      {selectedChatroom}
      {chatMessages?.map((chatMessage) => (
        <Message key={chatMessage.id} {...chatMessage} />
      ))}
    </div>
  );
}
