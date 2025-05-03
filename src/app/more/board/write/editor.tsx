"use client";

import { useEffect, useRef, forwardRef, ForwardedRef } from "react";
import Quill from "quill";
import "quill/dist/quill.bubble.css";

const Editor = forwardRef((_props, ref: ForwardedRef<Quill | null>) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      const quill = new Quill(editorContainer, { theme: "bubble" });

      // Set the forwarded ref to the Quill instance
      if (typeof ref === "function") {
        ref(quill);
      } else if (ref) {
        ref.current = quill;
      }

      return () => {
        // Clean up
        if (typeof ref === "function") {
          ref(null);
        } else if (ref) {
          ref.current = null;
        }
        container.innerHTML = "";
      };
    }
  }, [ref]);
  return (
    <div className="h-full overflow-auto">
      <div ref={containerRef} className="ml-20 mt-8 mr-30" />
    </div>
  );
});

// Add display name for better debugging
Editor.displayName = "Editor";

export default Editor;
