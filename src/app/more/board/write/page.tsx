import Tiptap from "./tiptap";

export default function Page() {
  return (
    <div
      className="w-[85%] mt-4 bg-gray-200 flex flex-col
    justify-center"
    >
      <div className="p-3 flex justify-center border-b-1 shadow-md inset-shadow">
        <input
          className="
          text-center text-7xl
          p-3 border-b border-b-gray-500
          focus:outline-0 focus:inset-shadow-sm
          "
        ></input>
      </div>
      <div>
        <Tiptap />
      </div>
    </div>
  );
}
