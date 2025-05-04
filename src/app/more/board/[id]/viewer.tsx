"use client";
import Quill from "quill";
import { useRef, useEffect } from "react";
import "quill/dist/quill.bubble.css";

export default function Viewer({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      const quill = new Quill(containerRef.current, {
        theme: "bubble",
      });
      quill.enable(false);
      quillRef.current = quill;

      try {
        const delta = JSON.parse(content);
        console.log(delta);
        quill.setContents(delta);
      } catch (error) {
        console.error("Failed to parse content as Delta:", error);
      }
    }
  });

  return (
    <div className="h-full overflow-auto">
      <div ref={containerRef} className="ml-20 mr-30 px-15 outline-none" />
    </div>
  );
}
