"use client";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import QuillType from "quill";
import "node_modules/highlight.js/styles/atom-one-dark.css";
import Categories from "./categories";
import type { Category } from "@/lib/definitions";
import { createBlog } from "@/lib/actions";

export default function Editor({ categories }: { categories?: Category[] }) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [length, setLength] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);

  const handleCategorySelect = (id: number) => {
    setSelectedCategoryId(id);
  };

  const handleSave = () => {
    if (length <= 0) {
      alert("length <= 0");
      return;
    }
    if (title === "") {
      alert("no title");
      return;
    }
    if (selectedCategoryId === 0) {
      alert("no category");
      return;
    }
    // console.log(title);
    // console.log(selectedCategoryId);
    // console.log(length);
    // console.log(content);
    const data = {
      title: title,
      content: content,
      length: length,
      category_id: selectedCategoryId,
    };
    createBlog(data);
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
              ["code-block", "formula"],
              [{ script: "sub" }, { script: "super" }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
            ],
          },
        });

        quillRef.current.on("text-change", () => {
          // const innerText = quillRef.current.root.innerText;

          const delta = quillRef.current?.getContents();
          setContent(JSON.stringify(delta));

          setLength(quillRef?.current?.root.innerText.length || 0);
        });
      });
    }
  }, []);

  if (!categories) {
    return;
  }
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
        <Categories
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={handleCategorySelect}
        />
      </div>
      <div className="my-3 flex flex-row-reverse">
        <button
          onClick={handleSave}
          className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-xl"
        >
          작성
        </button>
      </div>
      <div className="quill-container">
        <div ref={editorRef} className="prose max-w-none" />
      </div>
    </div>
  );
}
