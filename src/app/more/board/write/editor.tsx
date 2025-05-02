"use client";

import { useEffect, useRef, RefObject } from "react";
import Quill from "quill";
import "quill/dist/quill.bubble.css";

export default function Editor({ ref }: { ref: RefObject<Quill | null> }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      const quill = new Quill(editorContainer, { theme: "bubble" });

      ref.current = quill;

      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }
  }, [ref]);
  return (
    <div className="h-full overflow-auto">
      <div ref={containerRef} className="ml-20 mt-8 mr-30" />
    </div>
  );
}
