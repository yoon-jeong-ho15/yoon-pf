"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useChatroom } from "./chatroom-provider";
import { User, ChatMessageWithReadStatus } from "@/lib/definitions";
import { NoProfile } from "public/icon";
import { supabase } from "@/lib/supabase";
import { fetchChatsWithReadStatus, markMessageAsRead } from "@/lib/data";
import MessageBoxWelcome from "@/app/ui/motions/message-box-welcome";

export default function MessageBox({ user }: { user: User }) {
  const [chatMessages, setChatMessages] = useState<
    ChatMessageWithReadStatus[] | null
  >(null);
  const messageDivRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const chatroomContext = useChatroom()!;
  const { setIsSubmitting, selectedChatroom } = chatroomContext;

  // Intersection Observer 설정
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const messageId = entry.target.getAttribute("data-message-id");
          if (messageId && entry.isIntersecting) {
            // 내가 보낸 메시지가 아닌 경우만 읽음 처리
            const message = chatMessages?.find((m) => m.id === messageId);
            if (message && message.username !== user.username) {
              markMessageAsRead(messageId, user.id);
            }
          }
        });
      },
      {
        threshold: 0.7, // 메시지의 70%가 보이면 읽음 처리
        rootMargin: "0px",
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [user.id, chatMessages, user.username]);

  const setMessageRef = useCallback(
    (messageId: string, element: HTMLDivElement | null) => {
      if (element) {
        messageRefs.current.set(messageId, element);
        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      } else {
        const existingElement = messageRefs.current.get(messageId);
        if (existingElement && observerRef.current) {
          observerRef.current.unobserve(existingElement);
        }
        messageRefs.current.delete(messageId);
      }
    },
    []
  );

  const loadPrevChats = useCallback(async () => {
    if (selectedChatroom) {
      const previousChats = await fetchChatsWithReadStatus(selectedChatroom);
      setChatMessages(previousChats);
    }
  }, [selectedChatroom]);

  useEffect(() => {
    if (messageDivRef.current) {
      messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!selectedChatroom) return;

    loadPrevChats();

    const channel = supabase.channel(`ch${selectedChatroom}`);
    channel.on("broadcast", { event: "new-message" }, (data) => {
      const message = data.payload;

      // 새 메시지를 ChatMessageWithReadStatus 형태로 변환
      const messageWithReadStatus: ChatMessageWithReadStatus = {
        ...message,
        unread_count: message.username === user.username ? 0 : 1, // 내가 보낸 메시지는 읽음 처리
        total_recipients: 1, // 실제로는 채팅방 멤버 수에서 계산해야 함
      };

      setChatMessages((prev) => [...(prev ?? []), messageWithReadStatus]);

      if (message.username === user.username) {
        setIsSubmitting(false);
      }
    });
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    selectedChatroom,
    user.username,
    user.id,
    loadPrevChats,
    setIsSubmitting,
  ]);

  if (!selectedChatroom) return <MessageBoxWelcome />;

  return (
    <div className="grow overflow-y-scroll pt-2" ref={messageDivRef}>
      <input type="hidden" value={selectedChatroom} />
      {chatMessages?.map((chatMessage) => (
        <div
          key={chatMessage.id}
          ref={(el) => setMessageRef(chatMessage.id, el)}
          data-message-id={chatMessage.id}
        >
          <Message {...chatMessage} user={user} />
        </div>
      ))}
    </div>
  );
}

export function Message({
  id,
  username,
  message,
  created_at,
  user_id,
  profile_pic,
  unread_count,
  total_recipients,
  user,
}: ChatMessageWithReadStatus & { user: User }) {
  const isMe = username === user.username;

  // const getReadStatusDisplay = () => {
  //   if (!isMe) return null;

  //   const readCount = total_recipients - unread_count;

  //   if (unread_count === 0 && total_recipients > 0) {
  //     return <span className="text-blue-500 text-xs ml-2">✓✓ 읽음</span>;
  //   } else if (readCount > 0) {
  //     return (
  //       <span className="text-gray-500 text-xs ml-2">
  //         ✓ {readCount}/{total_recipients}
  //       </span>
  //     );
  //   } else {
  //     return <span className="text-gray-400 text-xs ml-2">✓</span>;
  //   }
  // };

  return (
    <div className={`px-5 pb-6 flex ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-fit w-fit rounded-2xl py-1 pl-2 pr-5 max-w-180 bg-linear-to-r
          shadow-lg items-center
          ${
            isMe ? "from-indigo-200 to-blue-200" : "from-zinc-200 to-stone-200"
          }`}
      >
        <div className="hidden">{created_at}</div>
        <div className="hidden">{id}</div>
        <div className="hidden">{user_id}</div>
        <div className="hidden">{total_recipients}</div>
        <div className="hidden">{unread_count}</div>
        <div className="flex flex-col justify-center items-center">
          {profile_pic ? (
            <div className="size-12 bg-white">{profile_pic}</div>
          ) : (
            <NoProfile size="md" />
          )}
          <span className="text-xs">{username}</span>
        </div>
        <div className="ml-6 whitespace-normal wrap-anywhere text-shadow-sm">
          {message}
        </div>
      </div>
    </div>
  );
}
