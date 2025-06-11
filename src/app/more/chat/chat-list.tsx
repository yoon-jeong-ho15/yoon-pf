"use client";

import { Chatroom, ChatroomMap, ChatroomUser, User } from "@/lib/definitions";
import { NoProfile } from "public/icon";
import { useChatroom } from "./chatroom-provider";
import { MessageIcon } from "public/icon";
import AddChatroom from "./add-chatroom";
import { AnimatePresence } from "motion/react";

export default function ChatList({
  chatrooms,
  friends,
}: {
  chatrooms: ChatroomMap | null;
  friends?: User[];
}) {
  const chatroomContext = useChatroom()!;
  const { setSelectedChatroom, setIsShowingAddChatroom, isShowingAddChatroom } =
    chatroomContext;

  return (
    <div className="bg-gray-100 rounded-xl w-[25%] ml-3 relative">
      <AnimatePresence>
        {isShowingAddChatroom && <AddChatroom friends={friends} />}
      </AnimatePresence>
      <div className="h-fit flex justify-between px-3 pt-2">
        <button
          onClick={() => {
            setSelectedChatroom(null);
          }}
          className="w-fit rounded-xl border-1 text-md text-center px-2
          hover:bg-gray-200"
        >
          메인
        </button>
        <button
          className="rounded-xl border-1 text-center px-2 
        hover:bg-gray-200"
          onClick={() => {
            if (isShowingAddChatroom) {
              setIsShowingAddChatroom(false);
            } else {
              setIsShowingAddChatroom(true);
            }
          }}
        >
          +
        </button>
      </div>
      <nav className="p-4 flex flex-col overflow-y-scroll">
        {[...(chatrooms?.entries() || [])].map(([chatroom, users]) => (
          <Chat
            key={chatroom.id}
            chatroom={chatroom}
            users={users}
            setSelectedChatroom={setSelectedChatroom ?? (() => {})}
          />
        ))}
      </nav>
    </div>
  );
}

export function Chat({
  chatroom,
  setSelectedChatroom,
  users,
}: {
  chatroom: Chatroom;
  setSelectedChatroom: (id: string | null) => void;
  users: ChatroomUser[];
}) {
  return (
    <div
      onClick={() => {
        setSelectedChatroom(chatroom.id);
      }}
      className="flex w-full items-center hover:bg-zinc-200"
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
