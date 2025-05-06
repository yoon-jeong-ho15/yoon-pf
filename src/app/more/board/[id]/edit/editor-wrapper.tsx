"use client";
import Quill from "quill";
import { useEffect, useRef } from "react";
import Editor from "@/app/more/board/write/editor";

export default function EditorWrapper({
  initialValue,
}: {
  initialValue: string;
}) {
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!quillRef.current) return;
    try {
      const delta = JSON.parse(initialValue);
      quillRef.current.setContents(delta);
    } catch (error) {
      console.error("Error parsing initialValue", error);
    }
  }, [quillRef.current, initialValue]);

  useEffect(() => {
    const form = document.querySelector("form");
    form?.addEventListener("submit", () => {
      if (quillRef.current) {
        const delta = quillRef.current.getContents();
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "content";
        input.value = JSON.stringify(delta);
        form.appendChild(input);
      }
    });
  });
  return <Editor ref={quillRef} />;
}
