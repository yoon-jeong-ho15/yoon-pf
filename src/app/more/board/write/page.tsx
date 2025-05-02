"use client";

import { useState, useCallback, useRef } from "react";
import Editor from "./editor";
import Quill, { Delta } from "quill";
import type { Board } from "@/lib/definitions";
import { auth } from "@/auth";
import { createBoard } from "@/lib/actions";

export default function Page() {
  const quillRef = useRef<Quill | null>(null);
  const [title, setTitle] = useState("");

  const handleSave = () => {
    const delta: Delta | null = quillRef.current?.getContents() || null;
    const content = JSON.stringify(delta);
    console.log("content : ", content);
    if (title && content) {
      createBoard(title, content);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-4 bg-gray-200">
      <div className="w-full px-10 flex text-3xl items-center relative">
        <div>
          <span>제목</span>
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="mx-2 bg-gray-50 rounded-sm py-2
          focus:outline-0 text-center border border-gray-300 shadow"
          ></input>
        </div>
        <div className="flex justify-end gap-2 absolute right-3">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 
            text-white font-medium px-6 py-2 rounded-lg
            text-lg shadow-md"
          >
            작성하기
          </button>
        </div>
      </div>
      <div className="my-4 bg-white shadow h-190">
        <Editor ref={quillRef} />
      </div>
    </div>
  );
}
