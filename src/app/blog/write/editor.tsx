"use client";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import QuillType from "quill";
import hljs from "highlight.js";
import "node_modules/highlight.js/styles/atom-one-dark.css";
import Category from "./category";

export default function Editor() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [length, setLength] = useState(0);

  const handleSave = (title: string, content: string, length: number) => {
    // Implement your save logic here
    console.log("Saving content:", length, content);
  };

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      import("quill").then((QuillModule) => {
        const Quill = QuillModule.default;
        quillRef.current = new Quill(editorRef.current as HTMLDivElement, {
          theme: "snow",
          modules: {
            syntax: { hljs },
            toolbar: [
              [{ header: "1" }, { header: "2" }, { header: "3" }],
              [{ color: [] }, { background: [] }],
              ["bold", "italic", "underline"],
              [{ "code-block": "javascript" }],
              [{ script: "sub" }, { script: "super" }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
            ],
          },
        });

        quillRef.current.on("text-change", () => {
          setContent(JSON.stringify(quillRef.current?.getContents()));
          setLength(quillRef.current?.getLength() || 0);
        });
      });
    }
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-row w-[90%] mt-4 items-center">
        <input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="mx-2 bg-gray-50 rounded-sm py-2
          focus:outline-0 text-center border border-gray-300 shadow
          w-120 text-2xl font-bold"
          placeholder="제목"
        ></input>
      </div>
      <div>
        <Category />
      </div>
      <div className="my-3 flex flex-row-reverse">
        <button
          onClick={() => handleSave(title, content, length)}
          className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-xl"
        >
          작성
        </button>
      </div>
      <div ref={editorRef} />
    </div>
  );
}
