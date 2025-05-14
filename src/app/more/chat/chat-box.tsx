"use client";

import { User } from "@/lib/definitions";
import { useSession } from "next-auth/react";

export default function ChatBox() {
  const { data: session, status } = useSession();
  // console.log("chat-box > session : ", session);
  if (!session || !session.user) {
    return <div>no session</div>;
  }

  return (
    <div
      className="
        h-180 bg-sky-500 flex rounded shadow
        p-1 container
        "
    >
      <div
        className="
          w-full h-full bg-white rounded container
          flex flex-col
          "
      >
        <div className="flex flex-col overflow-y-scroll"></div>
        <form className="bg-gray-200 h-10 flex">
          <textarea
            name="chat"
            className="
            bg-gray-100 w-[80%] h-auth px-4 resize-none
            "
          />
          <button type="submit" className="">
            전송
          </button>
        </form>
      </div>
    </div>
  );
}
