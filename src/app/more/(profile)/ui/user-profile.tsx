"use client";

import { User } from "@/lib/definitions";
import { useSession } from "next-auth/react";
import NoProfile from "public/no-profile";

export default function UserProfile() {
  const { data: session, status } = useSession();
  console.log("user-profile > session : ", session);
  if (!session || !session.user) {
    return <div>no session</div>;
  }
  const user = session.user as User;

  return (
    <div
      className="
        flex flex-row h-full w-2/3"
    >
      <div className="bg-white/60 rounded-[15%] border-8 border-white h-full w-auto">
        <NoProfile size="full" />
      </div>
      <ul className="flex flex-col mx-10 items-center h-full text-2xl">
        <li>
          <span>{user.from}</span>
        </li>
        <li>
          <span>{user.username}</span>
        </li>
      </ul>
    </div>
  );
}
