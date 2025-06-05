"use client";

import { User } from "@/lib/definitions";
import { useRef, useState } from "react";
import { useChatroom } from "./chatroom-provider";
import { sendChatMessage } from "@/lib/actions";

export default function MessageForm({ user }: { user: User }) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const chatroomContext = useChatroom()!;
  const isSubmitting = chatroomContext.isSubmitting;
  const setIsSubmitting = chatroomContext.setIsSubmitting;
  const selectedChatroom = chatroomContext.selectedChatroom;

  // useEffect(() => {
  //   if (textareaRef.current && buttonRef.current) {
  //     const textarea = textareaRef.current;
  //     const button = buttonRef.current;
  //     const form = textarea.parentElement;

  //     if (!form) {
  //       return;
  //     }

  //     const formRect = form.getBoundingClientRect();
  //     const buttonRect = button.getBoundingClientRect();

  //     const bottomPosition = formRect.height / 2 - buttonRect.height / 2;

  //     button.style.bottom = `${bottomPosition}px`;
  //   }
  // }, []);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "auto";
    const newHeight = Math.min(e.currentTarget.scrollHeight, 160);
    e.currentTarget.style.height = newHeight + "px";

    const isZero = e.currentTarget.textLength === 0;
    setIsEmpty(isZero);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isEmpty) {
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await sendChatMessage(formData);

    if (result === "ok") {
      if (textareaRef.current) {
        textareaRef.current.value = "";
        setIsEmpty(true);
      }
    }
  };

  return (
    <div className="mt-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 w-full pt-1 p-0.5 relative rounded-b-md items-center"
      >
        <textarea
          name="message"
          ref={textareaRef}
          className="
              bg-gray-100 w-full px-4 py-3 resize-none
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
              if (!isEmpty) {
                button?.click();
                setIsEmpty(true);
              }
            }
          }}
        />
        {selectedChatroom && (
          <>
            <input type="hidden" name="sent" value={user.username} />
            <input type="hidden" name="chatroom" value={selectedChatroom} />
            <button
              type="submit"
              ref={buttonRef}
              disabled={isEmpty || isSubmitting}
              className={`h-full max-h-8 rounded-2xl shadow w-20 
                  absolute right-4 bottom-3.5 text-white
                  ${
                    isSubmitting
                      ? "bg-blue-400"
                      : isEmpty
                      ? "bg-gray-200 hover:bg-gray-200"
                      : "bg-blue-600 hover:bg-blue-500 cursor-pointer"
                  }
                  `}
            >
              {isSubmitting ? "전송중" : "전송"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
