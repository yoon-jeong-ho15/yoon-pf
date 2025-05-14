"use client";

import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session, status } = useSession();
  console.log("user-info > session : ", session);
  if (!session || !session.user) {
    return <div>no session</div>;
  }

  return (
    <div>
      <h1>{Object.keys(session.user)}</h1>
    </div>
  );
}
