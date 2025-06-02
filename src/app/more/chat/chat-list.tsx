"use client";

import { Chatroom, User } from "@/lib/definitions";
import NoProfile from "public/no-profile";
import { useChatroom } from "./chatroom-provider";
import { useState, useEffect } from "react";
import { getUser } from "@/lib/actions";

export function Chat({ chatroom }: { chatroom: Chatroom }) {
  const selectChatroom = useChatroom()?.selectChatroom;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const user: User = await getUser(chatroom.user2);
      setUser(user);
    }
    loadUser();
  }, [chatroom.user2]);

  if (!user) return <div>no user</div>;

  return (
    <div
      onClick={() => {
        if (selectChatroom) selectChatroom(chatroom.id);
      }}
      className="flex flex-col w-1/8 items-center hover:bg-gray-100"
    >
      <div className="w-10/12 flex justify-center">
        <NoProfile />
      </div>
      <span className="text-2xl tracking-widest">{user.username}</span>
    </div>
  );
}

export default function ChatList({
  chatrooms,
}: {
  chatrooms: Chatroom[] | null;
}) {
  return (
    <nav className="bg-gray-200 my-6 rounded-xl p-4 flex overflow-x-scroll">
      {chatrooms?.map((chatroom) => (
        <Chat key={chatroom.id} chatroom={chatroom} />
      ))}
    </nav>
  );
}
