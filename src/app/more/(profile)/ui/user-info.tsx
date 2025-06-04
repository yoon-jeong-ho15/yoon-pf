"use client";

import { User } from "@/lib/definitions";

export default function UserInfo({ user }: { user: User }) {
  return (
    <div>
      <h1>{Object.keys(user)}</h1>
    </div>
  );
}
