"use client";
import type Quill from "quill";
import { useEffect, useRef, useState } from "react";
import Editor from "@/app/more/board/write/editor";
// import dynamic from "next/dynamic";

// const DynamicEditor = dynamic(() => import("@/app/more/board/write/editor"), {
//   ssr: false,
// });

export default function EditorWrapper({
  initialValue,
}: {
  initialValue: string;
}) {
  const quillRef = useRef<Quill | null>(null);
  const [editorContent, setEditorContent] = useState(initialValue);

  useEffect(() => {
    if (!quillRef.current) return;

    // try {
    const delta = JSON.parse(initialValue);
    quillRef.current.setContents(delta);
    // } catch (error) {
    //   console.error("Error parsing initialValue", error);
    // }

    const editor = quillRef.current;

    const handleChange = () => {
      const delta = editor.getContents();
      setEditorContent(JSON.stringify(delta));
    };

    editor.on("text-change", handleChange);

    return () => {
      editor.off("text-change", handleChange);
    };
  }, [quillRef.current, initialValue]);

  // useEffect(() => {
  //   const form = document.querySelector("form");
  //   form?.addEventListener("submit", () => {
  //     if (quillRef.current) {
  //       const delta = quillRef.current.getContents();
  //       const input = document.createElement("input");
  //       input.type = "hidden";
  //       input.name = "content";
  //       input.value = JSON.stringify(delta);
  //       form.appendChild(input);
  //     }
  //   });
  // });
  return (
    <>
      <input type="hidden" name="content" value={editorContent} />
      <Editor ref={quillRef} />
    </>
  );
}
