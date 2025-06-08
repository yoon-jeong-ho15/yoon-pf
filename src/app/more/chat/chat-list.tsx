"use client";

import { Chatroom, ChatroomMap, ChatroomUser } from "@/lib/definitions";
import { NoProfile } from "public/icon";
import { useChatroom } from "./chatroom-provider";
import { MessageIcon } from "public/icon";

export default function ChatList({
  chatrooms,
}: {
  chatrooms: ChatroomMap | null;
}) {
  const selectChatroom = useChatroom()?.selectChatroom;

  return (
    <div className="bg-gray-100 rounded-xl w-[25%] ml-3">
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

      <nav className="p-4 flex flex-col overflow-x-scroll">
        {[...(chatrooms?.entries() || [])].map(([chatroom, users]) => (
          <Chat
            key={chatroom.id}
            chatroom={chatroom}
            users={users}
            selectChatroom={selectChatroom ?? (() => {})}
          />
        ))}
        {/* {chatrooms?.map((chatroom) => (
          <Chat
            key={chatroom.id}
            chatroom={chatroom}
            selectChatroom={selectChatroom ?? (() => {})}
          />
        ))} */}
      </nav>
    </div>
  );
}

export function Chat({
  chatroom,
  selectChatroom,
  users,
}: {
  chatroom: Chatroom;
  selectChatroom: (id: string | null) => void;
  users: ChatroomUser[];
}) {
  return (
    <div
      onClick={() => {
        if (selectChatroom) selectChatroom(chatroom.id);
      }}
      className="flex w-full items-center hover:bg-zinc-200
        cursor-pointer"
    >
      <div className="w-10/12 flex">
        {users.length == 1 ? (
          // 1:1 채팅인 경우
          <div className="flex items-center">
            <NoProfile size="md" />
            <span className="ml-2">{users[0].username}</span>
          </div>
        ) : (
          // 그룹 채팅인 경우
          <div className="flex items-center">
            <MessageIcon size="md" />
            <span className="ml-2">
              {chatroom.title
                ? chatroom.title
                : users.map((user) => user.username).join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
