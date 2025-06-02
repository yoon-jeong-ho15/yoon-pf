"use client";

import { User } from "@/lib/definitions";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Alert() {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  // const [count, setCount] = useState<number>(0);

  // useEffect(() => {
  //   console.log("userId : ", user?.id);

  //   const connection = new EventSource(`/api/alert/connect?id=${user?.id}`);

  //   connection.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log("Received alert:", data);
  //     // Handle the alert data here (show notification, update UI, etc.)
  //   };

  //   connection.onerror = (error) => {
  //     console.error("SSE Error:", error);
  //     connection.close();
  //   };

  //   return () => {
  //     connection.close();
  //   };
  // }, [user?.id]);

  if (status === "loading") return <div>loading</div>;
  if (!session || !session.user) return <div>no session</div>;
  return (
    <form>
      <button className="hover:bg-indigo-200 p-1.5 rounded-md transition-colors flex items-center">
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
        <div>0</div>
      </button>
    </form>
  );
}
