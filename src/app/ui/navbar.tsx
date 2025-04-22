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
        <Link href="/">home</Link>
        <Link href="/about">about</Link>
        <Link href="/board">board</Link>
      </nav>
    </>
  );
}
