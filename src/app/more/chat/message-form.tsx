"use client";

import { sendMessage } from "@/lib/actions";
import { User } from "@/lib/definitions";
import { useRef, useState, useEffect } from "react";

export default function MessageForm({ user }: { user: User }) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  //이렇게 안하고 그냥 버튼의 css로 할 수 있지만, 정확히 가운데에 위치시키고 싶었다.
  useEffect(() => {
    if (textareaRef.current && buttonRef.current) {
      const textarea = textareaRef.current;
      const button = buttonRef.current;
      const form = textarea.parentElement;

      if (!form) {
        return;
      }

      const formRect = form.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      const bottomPosition = formRect.height / 2 - buttonRect.height / 2;

      button.style.bottom = `${bottomPosition}px`;

      setIsEmpty(true);
    }
  }, [textareaRef.current, buttonRef.current]);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "auto";
    const newHeight = Math.min(e.currentTarget.scrollHeight, 160);
    e.currentTarget.style.height = newHeight + "px";

    console.log(e.currentTarget.textLength);
    const isZero = e.currentTarget.textLength === 0;
    setIsEmpty(isZero);
  };

  return (
    <div className="mt-auto">
      <form
        action={sendMessage}
        className="bg-gray-200 w-full pt-1 p-0.5 relative rounded-b-md"
      >
        <textarea
          name="chat"
          ref={textareaRef}
          className="
              bg-gray-100 w-full px-4 py-2 resize-none
              min-h-10 max-h-40 focus:outline-1 outline-sky-400 -outline-offset-1
              shadow rounded-lg
              "
          rows={1}
          style={{ height: "auto" }}
          onInput={handleInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const button = buttonRef.current;
              console.log(button);
              if (!isEmpty) {
                button?.click();
                setIsEmpty(true);
              }
            }
          }}
        />
        <input type="hidden" name="username" value={user.username} />
        <button
          type="submit"
          ref={buttonRef}
          disabled={isEmpty}
          className="h-full max-h-8 px-2 drop-shadow-2xl rounded-2xl 
              bg-blue-600 hover:bg-blue-500
              absolute right-4 text-white disabled:bg-gray-300
              "
        >
          전송
        </button>
      </form>
    </div>
  );
}
