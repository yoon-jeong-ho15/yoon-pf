import { fetchChatrooms, fetchUserByUsername } from "@/lib/data";
import { Chatroom, User } from "@/lib/definitions";
import Link from "next/link";
import NoProfile from "public/no-profile";

export async function Chat({ chatroom }: { chatroom: Chatroom }) {
  const user: User = await fetchUserByUsername(chatroom.user2);
  return (
    <Link
      href={`/more/chat/${chatroom.id}`}
      className="flex flex-col w-1/8 items-center hover:bg-gray-100"
    >
      <div className="w-10/12 flex justify-center">
        <NoProfile />
      </div>
      <span className="text-2xl tracking-widest">{user.username}</span>
    </Link>
  );
}

export default async function ChatList({ user }: { user: User }) {
  const chatrooms = await fetchChatrooms(user.username);

  return (
    <nav className="bg-gray-200 my-6 rounded-xl p-4 flex overflow-x-scroll">
      {chatrooms.map((chatroom) => (
        <Chat key={chatroom.id} chatroom={chatroom} />
      ))}
    </nav>
  );
}
