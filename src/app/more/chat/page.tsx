import { auth } from "@/auth";
import ChatBox from "./chat-box";
import { SessionProvider } from "next-auth/react";
import { User } from "@/lib/definitions";
import ChatList from "./chat-list";

export default async function Page() {
  const session = await auth();
  console.log("chat/page.tsx > session : ", session);
  if (!session || !session.user) {
    return <div>no session</div>;
  }
  const user = session.user as User;

  return (
    <div className="w-[90%]">
      <h1>chat</h1>
      <SessionProvider>
        <ChatBox />
        {user.username === "윤정호" && <ChatList user={user} />}
      </SessionProvider>
    </div>
  );
}
