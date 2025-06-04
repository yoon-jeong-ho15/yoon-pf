"use client";

import { Chatroom } from "@/lib/definitions";
import NoProfile from "public/no-profile";
import { useChatroom } from "./chatroom-provider";

export default function ChatList({
  chatrooms,
}: {
  chatrooms: Chatroom[] | null;
}) {
  const selectChatroom = useChatroom()?.selectChatroom;

  return (
    <div className="my-6 bg-gray-200 rounded-xl">
      <div className="h-fit px-3 pt-2">
        <div
          onClick={() => {
            if (selectChatroom) selectChatroom(null);
          }}
          className="w-fit rounded-xl border-1 text-md text-center px-2
          hover:bg-gray-100 cursor-pointer"
        >
          메인
        </div>
      </div>

      <nav className="p-4 flex overflow-x-scroll">
        {chatrooms?.map((chatroom) => (
          <Chat
            key={chatroom.id}
            chatroom={chatroom}
            selectChatroom={selectChatroom ?? (() => {})}
          />
        ))}
      </nav>
    </div>
  );
}

export function Chat({
  chatroom,
  selectChatroom,
}: {
  chatroom: Chatroom;
  selectChatroom: (id: string | null) => void;
}) {
  return (
    <div
      onClick={() => {
        if (selectChatroom) selectChatroom(chatroom.id);
      }}
      className="flex flex-col w-1/8 items-center hover:bg-gray-100
        cursor-pointer"
    >
      <div className="w-10/12 flex justify-center">
        {chatroom.profile_pic ? <div>hello</div> : <NoProfile />}
      </div>
      <span className="text-2xl tracking-widest">{chatroom.other}</span>
    </div>
  );
}
