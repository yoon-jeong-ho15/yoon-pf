"use client";

// import { motion } from "motion/react";

export default function ChatPage() {
  return (
    <div
      className="
    bg-gradient-to-r from-blue-200 to-indigo-200
    rounded-xl p-2 border border-gray-400
    "
    >
      <div className="text-sm">page.tsx</div>
      <div
        className="
        flex flex-col
        border rounded-xl p-1
        border-gray-400"
      >
        <div className="text-sm">chatroom-provider.tsx</div>
        <div className="flex">
          <div
            className="
          flex flex-col 
          w-8/12 bg-white/30 
          rounded-lg p-1 border
          mr-2 border-gray-400"
          >
            <div className="md:h-130 bg-white/30 rounded m-1">
              message-box.tsx
            </div>
            <div className="bg-white/30 rounded m-1">message-form.tsx</div>
          </div>
          <div
            className="
          flex w-4/12 bg-white/30 
          rounded-lg p-1 border
          border-gray-400"
          >
            chat-list.tsx
          </div>
        </div>
      </div>
    </div>
  );
}
