"use client";

import { getNotifications, readNotification } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { Notification } from "@/lib/definitions";
import { redirect } from "next/navigation";

export default function Alert() {
  const { data: session, status } = useSession();
  const [notifications, setNotification] = useState<Notification[] | null>(
    null
  );
  const [alertCounts, setAlertCounts] = useState(0);
  const [isShowingNotification, setIsShowingNotification] = useState(false);
  const [readNotifications, setReadNotifications] = useState<Set<number>>(
    new Set()
  );

  const loadNotification = useCallback(async () => {
    if (session && session.user) {
      const data = await getNotifications(session.user.id!);
      if (data) {
        setNotification(data);
        const unreadCount = data.filter(
          (n) => !readNotifications.has(n.id)
        ).length;
        setAlertCounts(unreadCount);
      }
    }
  }, [session, readNotifications]);

  const toggleNotificationView = () => {
    setIsShowingNotification(!isShowingNotification);
  };

  const handleRead = (id: number, type: string) => {
    setReadNotifications((prev) => new Set(prev).add(id));
    readNotification(id);
    if (type === "chat_message") {
      redirect("/more/chat");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadNotification();
      const interval = setInterval(loadNotification, 30000);

      return () => clearInterval(interval);
    }
  }, [status, loadNotification]);

  useEffect(() => {
    if (notifications) {
      const unreadCount = notifications.filter(
        (n) => !readNotifications.has(n.id)
      ).length;
      setAlertCounts(unreadCount);
    }
  }, [readNotifications, notifications]);

  if (status === "loading") return <div>loading</div>;
  if (!session || !session.user) return <div>no session</div>;

  return (
    <div className="">
      <div
        className={`p-1.5 rounded-md hover:bg-indigo-200
        transition-colors flex items-center cursor-pointer
        ${alertCounts > 0 ? "bg-indigo-100" : ""}
        
        `}
        onClick={toggleNotificationView}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        <div
          className={` text-white rounded-full
            text-center size-2 
            ${alertCounts > 0 ? "bg-red-500 animate-pulse-fast" : ""}`}
        />
      </div>
      <AnimatePresence>
        {isShowingNotification && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 border"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 font-bold border-b text-gray-700">알림</div>
            {notifications && notifications.length > 0 ? (
              <ul className="p-2 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <AlertItem
                    key={n.id}
                    alert={n}
                    isRead={readNotifications.has(n.id)}
                    handleRead={handleRead}
                  />
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                새로운 알림이 없습니다.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AlertItem({
  alert,
  isRead,
  handleRead,
}: {
  alert: Notification;
  isRead: boolean;
  handleRead: (id: number, type: string) => void;
}) {
  return (
    <li
      className={`p-2 text-sm rounded-md cursor-pointer 
        ${
          isRead
            ? "text-gray-400 bg-gray-50"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      onClick={() => handleRead(alert.id, alert.type)}
    >
      {alert.type === "chat_message" && (
        <div>
          <div className="">
            {alert.data.chatroom_title && (
              <span className="text-xs text-gray-400">
                {alert.data.chatroom_title}
              </span>
            )}
          </div>
          <div>
            <span>{alert.data.sender_username}</span>
            <span>:</span>
            <span>{alert.data.message_preview}</span>
          </div>
        </div>
      )}
    </li>
  );
}
