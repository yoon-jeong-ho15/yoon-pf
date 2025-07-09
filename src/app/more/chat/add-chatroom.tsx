"use client";

import { addChatroom } from "@/lib/actions";
import { User } from "@/lib/definitions";
import * as motion from "motion/react-client";
import { NoProfile } from "public/icon";
import { useRef, useState } from "react";
import { useChatroom } from "./chatroom-provider";
import { PostgrestError } from "@supabase/supabase-js";

export default function AddChatroom({ friends }: { friends?: User[] }) {
  const [selectedFriend, setSelectedFriend] = useState<string[]>([]);
  const [title, setTitle] = useState<string>();
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const chatroomContext = useChatroom()!;
  const { setSelectedChatroom, setIsShowingAddChatroom } = chatroomContext;

  const toggleSelectedFriend = (id: string) => {
    setSelectedFriend((prev) => {
      if (prev.includes(id)) {
        return prev.filter((friendId) => friendId !== id);
      }
      return [...prev, id];
    });
  };

  const handleAddingChatroom = async () => {
    const result = await addChatroom(selectedFriend, title);
    if (result.type === "error") {
      switch (result.msg) {
        case "existing dm":
          setIsShowingAddChatroom(false);
          setSelectedChatroom(result.data!);
          break;
        case "existing group":
          alert(
            "이미 존재하는 그룹채팅 입니다. 대화방 이름을 다르게 지정해주세요."
          );
          titleInputRef.current?.focus();
          break;
      }
    } else {
      setIsShowingAddChatroom(false);
      setSelectedChatroom(result.data!);
    }
  };
  return (
    <motion.div
      className="absolute z-10 top-15 right-10 bg-white w-130
        border-1 border-gray-600 shadow-lg rounded-xl
        p-3 flex flex-col"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", duration: 0.3 }}
    >
      {friends?.map((user) => (
        <Friend
          key={user.id}
          user={user}
          onToggleSelect={toggleSelectedFriend}
          isSelected={selectedFriend.includes(user.id)}
        />
      ))}
      <div className="flex justify-end">
        {selectedFriend.length > 1 && (
          <input
            className="bg-stone-50 mr-8 border-1 border-blue-500 outline-0 rounded px-2"
            placeholder="그룹채팅방 이름을 입력해주세요"
            ref={titleInputRef}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        )}
        <motion.button
          className="rounded bg-blue-500 px-2 py-1 text-white shadow-md
            hover:bg-blue-600"
          animate={{
            opacity: selectedFriend.length == 0 ? 0 : 1,
          }}
          transition={{ type: "spring", duration: 0.2 }}
          onClick={handleAddingChatroom}
        >
          {selectedFriend.length <= 1 ? "메시지 보내기" : "그룹채팅 만들기"}
        </motion.button>
      </div>
    </motion.div>
  );
}

export function Friend({
  user,
  onToggleSelect,
  isSelected,
}: {
  user: User;
  onToggleSelect: (id: string) => void;
  isSelected?: boolean;
}) {
  return (
    <div
      className={`flex my-1 px-1 items-center
        rounded-xl transition-colors
        ${isSelected ? seletedStyle : "hover:bg-stone-100"}`}
      onClick={() => {
        onToggleSelect(user.id);
      }}
    >
      <input type="hidden" value={user.id} />
      {user.profilePic ? <div></div> : <NoProfile size="md" />}
      <span>{user.username}</span>
    </div>
  );
}

const seletedStyle = "bg-gradient-to-b from-blue-100 to-indigo-100 ";
