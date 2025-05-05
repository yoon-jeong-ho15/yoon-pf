"use client";

import { useEffect, useRef, RefObject } from "react";
import Quill from "quill";
import "quill/dist/quill.bubble.css";

export default function Editor({ ref }: { ref: RefObject<Quill | null> }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    let quill: Quill | null = null;
    let container: HTMLDivElement | null = null;

    container = containerRef.current;
    const editorContainer = container.appendChild(
      document.createElement("div")
    );
    quill = new Quill(editorContainer, { theme: "bubble" });
    ref.current = quill;
    console.log("quill : ", quill);
    return () => {
      if (quill && container) {
        ref.current = null;
        container.innerHTML = "";
      }
    };
  }, [ref]);

  return (
    <div className="pt-8 pb-10 overflow-auto h-full">
      <div ref={containerRef} className="ml-20 mr-30 h-full" />
    </div>
  );
}
