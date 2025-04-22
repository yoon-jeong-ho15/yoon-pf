import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <nav
        className="
            flex justify-around
            items-center 
            w-full h-14
            bg-green-600
            mt-8 text-2xl"
      >
        <Link
          href="/"
          className="flex 
          justify-center items-center h-full w-1/4
          hover:bg-green-500 transition-color duration-500 rounded-3xl"
        >
          home
        </Link>
        <Link
          href="/about"
          className="flex justify-center items-center h-full w-1/4
          hover:bg-green-500 transition-colors duration-500 rounded-3xl"
        >
          about
        </Link>
        <Link
          href="/board"
          className="flex justify-center items-center h-full w-1/4
          hover:bg-green-500 transition-colors duration-500 rounded-3xl"
        >
          board
        </Link>
      </nav>
    </>
  );
}
