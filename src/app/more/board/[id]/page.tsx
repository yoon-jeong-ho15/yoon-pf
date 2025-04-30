import { Board } from "@/lib/definitions";
import { fetchBoardById } from "@/lib/data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const board = await fetchBoardById(id);

  const timestamp = new Date(board.created_at);
  const date = `${timestamp.getFullYear()}년 ${
    timestamp.getMonth() + 1
  }월 ${timestamp.getDate()}일`;
  const time = `
    ${timestamp.getHours().toString()}시 
    ${timestamp.getMinutes().toString()}분`;

  return (
    <div className="w-[80%] shadow-lg mt-8">
      <div className="flex text-3xl p-3 px-8 bg-indigo-100 relative">
        <span className="text-shadow-sm">{board.title}</span>
        <span className="text-sm absolute right-3 bottom-2 max-w-50">
          {date} {time}
        </span>
      </div>
      <div
        className="
        h-20 flex items-center px-10"
      >
        {board.writer}
      </div>
      <div className="text-lg px-4 pb-10">{board.content}</div>
    </div>
  );
}
