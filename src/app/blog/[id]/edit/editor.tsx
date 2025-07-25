"use client";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import QuillType, { Delta } from "quill";
import "node_modules/highlight.js/styles/atom-one-dark.css";
import { Blog } from "@/lib/definitions";
import { updateBlog } from "@/lib/actions";

export default function Editor({ blog }: { blog: Blog }) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType | null>(null);
  const [content, setContent] = useState<Delta | null>(null);
  const [title, setTitle] = useState(blog.title);
  const [length, setLength] = useState(blog.length);

  const handleSave = () => {
    if (length <= 0) {
      alert("length <= 0");
      return;
    }
    if (title === "") {
      alert("no title");
      return;
    }
    const data = {
      id: blog.id,
      title: title,
      content: content!,
      length: length,
    };
    updateBlog(data);
  };

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      import("quill").then((QuillModule) => {
        const Quill = QuillModule.default;
        quillRef.current = new Quill(editorRef.current as HTMLDivElement, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: "1" }, { header: "2" }, { header: "3" }],
              [{ color: [] }, { background: [] }],
              ["bold", "italic", "underline"],
              [{ "code-block": "typescript" }],
              [{ script: "sub" }, { script: "super" }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
            ],
          },
        });

        quillRef.current.setContents(blog.content);

        quillRef.current.on("text-change", () => {
          let plainText = "";
          const delta = quillRef.current?.getContents();
          if (delta) {
            delta?.ops.forEach((op) => {
              if (op.insert !== "\n") {
                plainText += op.insert;
              }
            });
            setContent(delta);
          }
          setLength(plainText.length || 0);
        });
      });
    }
  }, [blog.content]);

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
          value={title}
        ></input>
      </div>
      <div className="my-3 flex flex-row-reverse">
        <button
          onClick={handleSave}
          className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-xl"
        >
          수정
        </button>
      </div>
      <div ref={editorRef} />
    </div>
  );
}
