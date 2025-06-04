import { auth } from "@/auth";
import { User } from "@/lib/definitions";
import ChatList from "./chat-list";
import ChatroomProvider from "./chatroom-provider";
import { fetchChatrooms } from "@/lib/data";
import MessageBox from "./message-box";
import MessageForm from "./message-form";

export default async function Page() {
  const session = await auth();
  // console.log("chat/page.tsx > session : ", session);
  if (!session || !session.user) {
    return <div>no session</div>;
  }
  const user = session.user as User;
  const chatrooms = await fetchChatrooms(user.username);

  return (
    <div className="w-[90%]">
      <h1>chat</h1>
      <ChatroomProvider>
        <div
          className="h-180 w-[70%] flex rounded shadowp-1 container p-1
            bg-gradient-to-r from-blue-400 to-indigo-400"
        >
          <div
            className="w-full h-full bg-white rounded container 
              flex flex-col justify-between shadow"
          >
            <MessageBox user={user} />
            <MessageForm user={user} />
          </div>
        </div>
        <ChatList chatrooms={chatrooms} />
      </ChatroomProvider>
    </div>
  );
}
