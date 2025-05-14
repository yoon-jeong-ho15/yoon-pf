import ChatBox from "./chat-box";
import { SessionProvider } from "next-auth/react";

export default async function Page() {
  // const session = await auth();
  // console.log("chat/page.tsx > session : ", session);
  // if (!session || !session.user) {
  //   return <div>no session</div>;
  // }

  return (
    <div className="w-[90%]">
      <h1>chat</h1>
      <SessionProvider>
        <ChatBox />
      </SessionProvider>
    </div>
  );
}
