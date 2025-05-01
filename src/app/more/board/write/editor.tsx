"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface EditorProps {
  onTextChange?: (content: string) => void;
  initialValue?: string;
}

export default function Editor({
  onTextChange,
  initialValue = "",
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  // 에디터가 이미 초기화되었는지 확인하는 플래그
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    // 이미 초기화되었으면 중복 생성을 방지
    if (isInitialized.current || !editorRef.current) return;

    // Quill 에디터 생성
    const quill = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      },
      placeholder: "내용을 입력하세요...",
    });

    quillRef.current = quill;
    isInitialized.current = true;

    if (initialValue) {
      quill.root.innerHTML = initialValue;
    }

    // 텍스트 변경 이벤트 리스너
    const textChangeHandler = () => {
      if (onTextChange) {
        onTextChange(quill.root.innerHTML);
      }
    };

    quill.on("text-change", textChangeHandler);

    // Cleanup function
    return () => {
      quill.off("text-change", textChangeHandler);
      // Quill을 완전히 제거하지 않고 이벤트 리스너만 제거
    };
  }, []); // 빈 의존성 배열로 한 번만 실행

  // onTextChange가 변경될 때 이벤트 리스너 업데이트
  useEffect(() => {
    if (!quillRef.current || !onTextChange) return;

    const textChangeHandler = () => {
      onTextChange(quillRef.current!.root.innerHTML);
    };

    quillRef.current.on("text-change", textChangeHandler);

    return () => {
      quillRef.current?.off("text-change", textChangeHandler);
    };
  }, [onTextChange]);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div ref={editorRef} className="h-64" />
    </div>
  );
}
