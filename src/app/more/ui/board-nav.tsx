import Link from "next/link";

export default function BoardNav() {
  return (
    <nav
      className="
        flex flex-row items-center justify-around
        bg-gray-300
        h-14 mt-6 mx-12 rounded-2xl shadow-md
        border border-gray-400"
    >
      <Link href="/more">
        <div>profile</div>
      </Link>
      <Link href="/more/chat">
        <div>chat</div>
      </Link>
      <Link href="/more/letter">
        <div>letter</div>
      </Link>
      <Link href="/more/board">
        <div>open board</div>
      </Link>
    </nav>
  );
}
