import Editor from "./editor";

export default async function Page() {
  return (
    <div className="flex flex-col items-center my-3">
      <div className="flex flex-row w-[90%]">
        <Editor />
      </div>
    </div>
  );
}
