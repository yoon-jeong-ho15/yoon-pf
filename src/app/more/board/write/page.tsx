"use client";

import { useState, useCallback } from "react";
import Editor from "./editor";

export default function Board() {
  const [content, setContent] = useState<string>("");

  // useCallback으로 함수 안정화
  const handleTextChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleSave = () => {
    console.log("저장할 내용:", content);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-4 bg-gray-200">
      <div className="w-full px-10 flex text-3xl items-center">
        <span className="">제목:</span>
        <input
          className="mx-2 bg-gray-50 rounded-md
          focus:outline-0 text-center"
        ></input>
      </div>
      <div className="my-4">
        <Editor onTextChange={handleTextChange} />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg"
        >
          저장
        </button>
      </div>
    </div>
  );
}
