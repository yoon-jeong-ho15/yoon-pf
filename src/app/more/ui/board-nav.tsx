import Link from "next/link";
import Logout from "./logout";
import Alert from "./alert";

export default function MoreNav() {
  return (
    <nav
      className="
        flex flex-row items-center justify-between
        bg-gray-100
        h-14 w-11/12 mt-3 rounded-2xl shadow-md
        border border-gray-400 relative"
    >
      <div className="flex flex-1 h-full items-center justify-around text-2xl">
        <Link href="/more">
          <div>profile</div>
        </Link>
        <Link href="/more/chat">
          <div>chat</div>
        </Link>
        <Link href="/more/board">
          <div>board</div>
        </Link>
      </div>
      <div className="flex flex-row h-full w-fit border-l rounded-lg border-gray-400 items-center px-2">
        <Alert />
        <Logout />
      </div>
    </nav>
  );
}
