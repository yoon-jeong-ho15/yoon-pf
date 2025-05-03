import { fetchBoardById } from "@/lib/data";
import Viewer from "./viewer";
import { auth } from "@/auth";
import type { User } from "@/lib/definitions";
import Edit from "./ui/edit";
import Delete from "./ui/delete";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const board = await fetchBoardById(id);
  const session = await auth();
  const user: User | null = (session?.user as User) || null;
  const isEditable = board.writer === user.username;

  const timestamp = new Date(board.created_at);
  const date = `${timestamp.getFullYear()}년 ${
    timestamp.getMonth() + 1
  }월 ${timestamp.getDate()}일`;
  const time = `
    ${timestamp.getHours().toString()}시 
    ${timestamp.getMinutes().toString()}분`;

  return (
    <div className="container mx-auto px-4 py-8 mt-4 bg-gray-200">
      <div className="w-full px-10 flex text-3xl items-center relative">
        <span
          className="ml-11 py-2 mt-3
          text-center border-b-2 border-gray-700"
        >
          {board.title}
        </span>
        <span className="text-sm absolute right-3 bottom-2 max-w-50">
          {date} {time}
        </span>
      </div>
      <div
        className="
        h-20 flex justify-between items-center px-10 border-b border-gray-300"
      >
        <div className="flex items-center ml-10 bg-stone-300/70 p-3 rounded-xl">
          <span>작성자:</span>
          <div>
            <div></div>
            <span> {board.writer}</span>
          </div>
        </div>
        {isEditable ? (
          <div className="flex items-center p-3 space-x-3 mr-10">
            <Edit />
            <Delete />
          </div>
        ) : null}
      </div>
      <div className="h-190">
        <Viewer content={board.content} />
      </div>
    </div>
  );
}
