"use client";

import { User } from "@/lib/definitions";
import * as motion from "motion/react-client";
import { NoProfile } from "public/icon";

export default function AddChatroom({ friends }: { friends?: User[] }) {
  //   const friends = await getFriends(user.friendGroup, user.username);
  //   console.log(friends);

  return (
    <motion.div
      className="absolute z-10 top-15 right-10 bg-white w-130
        border-1 border-gray-600 shadow-lg rounded-xl
        p-3"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", duration: 0.3 }}
    >
      {friends?.map((user) => (
        <Friend key={user.id} user={user} />
      ))}
    </motion.div>
  );
}

export function Friend({ user }: { user: User }) {
  return (
    <div className="flex">
      {user.profilePic ? <div></div> : <NoProfile size="sm" />}
      <span>{user.username}</span>
    </div>
  );
}
