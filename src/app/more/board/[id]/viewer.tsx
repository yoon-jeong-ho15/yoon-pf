"use client";
import Quill from "quill";
import { useRef, useEffect } from "react";
import "quill/dist/quill.bubble.css";

export default function Viewer({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    console.log("useEffect()");
    console.log("content:", typeof content, content);
    let quill: Quill | null = null;
    let container: HTMLDivElement | null = null;

    const loadQuill = async () => {
      console.log("loadQuill()");
      if (!containerRef.current) return;
      const QuillModule = await import("quill");
      const Quill = QuillModule.default;

      container = containerRef.current;
      const editorContainer = container.appendChild(
        document.createElement("div")
      );
      quill = new Quill(editorContainer, {
        theme: "bubble",
      });
      quill.enable(false);
      quillRef.current = quill;
      const delta = JSON.parse(content);
      quill.setContents(delta);
    };
    loadQuill();
  });

  return (
    <div className="h-full overflow-auto">
      <div ref={containerRef} className="ml-20 mr-30 px-15 outline-none" />
    </div>
  );
}
