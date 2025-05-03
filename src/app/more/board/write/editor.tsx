"use client";

import { useEffect, useRef, forwardRef, ForwardedRef, useState } from "react";
// Import Quill types for TypeScript
import type Quill from "quill";

// Don't import Quill directly, we'll load it dynamically
import "quill/dist/quill.bubble.css";

const Editor = forwardRef((_props, ref: ForwardedRef<any | null>) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're now on the client
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run this effect on the client and after the component has mounted
    if (!isClient || !containerRef.current) return;

    let quill: any = null;

    // Dynamically import Quill
    const loadQuill = async () => {
      try {
        // Dynamic import of the Quill library
        const QuillModule = await import("quill");
        const Quill = QuillModule.default;

        const container = containerRef.current;
        if (!container) return;

        // Create the editor container
        const editorContainer = container.appendChild(
          document.createElement("div")
        );

        // Initialize Quill
        quill = new Quill(editorContainer, { theme: "bubble" });

        // Set the forwarded ref to the Quill instance
        if (typeof ref === "function") {
          ref(quill);
        } else if (ref) {
          ref.current = quill;
        }
      } catch (error) {
        console.error("Error initializing Quill:", error);
      }
    };

    loadQuill();

    // Cleanup function
    return () => {
      if (quill && containerRef.current) {
        if (typeof ref === "function") {
          ref(null);
        } else if (ref) {
          ref.current = null;
        }
        containerRef.current.innerHTML = "";
      }
    };
  }, [ref, isClient]);

  return (
    <div className="h-full overflow-auto">
      <div ref={containerRef} className="ml-20 mt-8 mr-30" />
    </div>
  );
});

// Add display name for better debugging
Editor.displayName = "Editor";

export default Editor;
