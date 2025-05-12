import { auth } from "@/auth";
export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    return <div>no session</div>;
  }

  return (
    <div className="w-[90%]">
      <h1>chat</h1>
      <div
        className="
        h-180 bg-sky-500 flex rounded shadow
        p-1 container
        "
      >
        <div
          className="
          w-full h-full bg-white rounded container
          flex flex-col
          "
        >
          <div className="flex flex-col"></div>
          <form className="bg-gray-200 h-10 flex">
            <input
              name="chat"
              className="
            bg-gray-100
            "
            />
            <input name="user" type="hidden" value={session.user.id} />
            <button type="submit" className="">
              전송
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
