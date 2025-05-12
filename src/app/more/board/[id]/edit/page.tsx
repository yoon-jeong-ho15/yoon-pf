import { fetchBoardById } from "@/lib/data";
import { Board } from "@/lib/definitions";
import { updateBoard } from "@/lib/actions";
import EditorWrapper from "./editor-wrapper";
import Cancle from "./cancle";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const board: Board = await fetchBoardById(params.id);
  return (
    <form
      action={updateBoard}
      className="container mx-auto px-4 py-8 mt-4 bg-gray-200"
    >
      <input type="hidden" name="id" value={params.id}></input>
      <div className="w-full px-10 flex text-3xl items-center relative">
        <div>
          <span>제목</span>
          <input
            name="title"
            defaultValue={board.title}
            className="mx-2 bg-gray-50 rounded-sm py-2
        focus:outline-0 text-center border border-gray-300 shadow"
          ></input>
        </div>
        <div className="flex justify-end gap-2 absolute right-3">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 
          text-white font-medium px-6 py-2 rounded-lg
          text-lg shadow-md"
          >
            수정하기
          </button>
          <Cancle />
        </div>
      </div>
      <div className="my-4 bg-white shadow h-190">
        <EditorWrapper initialValue={board.content} />
      </div>
    </form>
  );
}
