import Link from "next/link";
import { robotoMono } from "@/app/fonts";

export default function TopBar() {
  return (
    <div
      className="
    flex flex-row w-full items-center 
    border-b border-slate-500 mb-5
    "
    >
      <Link
        href="/"
        className="
        m-3 p-1 rounded
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </Link>
      <div className="text-xl">
        <span className="font-bold mr-2 tracking-widest">::::</span>
        <span
          className={` mr-3
            ${robotoMono.className}`}
        >
          yoon-pf
        </span>
        <span>프로젝트 소개</span>
      </div>
    </div>
  );
}
