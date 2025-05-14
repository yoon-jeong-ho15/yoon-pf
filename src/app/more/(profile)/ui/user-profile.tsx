"use client";

import { User } from "@/lib/definitions";
import { useSession } from "next-auth/react";
import NoProfile from "public/no-profile";

export default function UserProfile() {
  const { data: session, status } = useSession();
  console.log("user-profile > session : ", session);
  if (status === "loading") {
    return <div>loading</div>;
  }
  if (!session || !session.user) {
    return <div>no session</div>;
  }
  const user = session.user as User;

  return (
    <div
      className="
        flex flex-col h-full w-1/2 justify-center items-center py-6"
    >
      <div className="bg-white/60 rounded-[15%] border-8 border-white h-full w-120 flex justify-center items-center">
        <NoProfile size="full" />
      </div>
      <span className="text-6xl pt-3">{user.username}</span>
    </div>
  );
}
