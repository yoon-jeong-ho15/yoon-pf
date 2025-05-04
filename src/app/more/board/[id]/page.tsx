import { fetchBoardById } from "@/lib/data";
// import dynamic from "next/dynamic";
import Viewer from "./viewer";
import { auth } from "@/auth";
import type { User } from "@/lib/definitions";
import Edit from "./ui/edit";
import Delete from "./ui/delete";

// const DynamicViewer = dynamic(() => import("./viewer"), {
//   ssr: false,
//   loading: () => <div className="h-190 bg-gray-100 animate-pulse"></div>,
// });

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
      <div className="mx-33 flex text-3xl items-center relative">
        <span
          className="py-2 mt-3
          text-center border-b-2 border-gray-700"
        >
          {board.title}
        </span>
        <span className="text-sm ml-20 max-w-50 absolute bottom-2 right-14">
          {date} {time}
        </span>
      </div>
      <div
        className="
        h-20 flex justify-between items-center mx-33 border-b border-gray-300"
      >
        <div className="flex items-center bg-stone-300/70 p-3 rounded-xl">
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
