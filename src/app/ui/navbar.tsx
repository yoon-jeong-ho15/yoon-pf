"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const homeRef = useRef<HTMLAnchorElement>(null);
  const aboutRef = useRef<HTMLAnchorElement>(null);
  const boardRef = useRef<HTMLAnchorElement>(null);
  const [activePosition, setActivePosition] = useState({ left: 0, width: 0 });

  useEffect(() => {
    //현재 주소로 ref 지정해주기
    let currentRef = homeRef;
    if (pathname === "/about") {
      currentRef = aboutRef;
    } else if (pathname === "/board") {
      currentRef = boardRef;
    }

    //div 크기,위치 설정
    if (currentRef && currentRef.current) {
      const rect = currentRef.current.getBoundingClientRect();
      const navRect = currentRef.current.parentElement?.getBoundingClientRect();
      console.log("currentRef : ", currentRef);
      console.log("rect : ", rect);

      if (rect && navRect) {
        setActivePosition({
          left: rect.left - navRect.left,
          width: rect.width,
        });
      }
    }
  }, [pathname]);

  return (
    <>
      <nav
        className="
            flex justify-around
            items-center h-14
            bg-linear-to-b
            from-green-500 to-green-600
            mt-8 mx-10 text-2xl
            rounded-3xl
            font-[500]
            relative
            text-shadow-xs/10"
      >
        <Link
          href="/"
          ref={homeRef}
          className="flex 
          justify-center items-center 
          h-full min-w-40
          z-10"
        >
          home
        </Link>
        <Link
          href="/about"
          ref={aboutRef}
          className="flex 
          justify-center items-center 
          h-full min-w-40
          z-10"
        >
          about
        </Link>
        <Link
          href="/board"
          ref={boardRef}
          className="flex 
          justify-center items-center 
          h-full min-w-40
          z-10"
        >
          board
        </Link>
        <div
          className="
            absolute bg-lime-400
            h-full
            rounded-4xl
            transition-all
            duration-300"
          style={{
            left: `${activePosition.left}px`,
            width: `${activePosition.width}px`,
            transitionTimingFunction: "cubic-bezier(0.34, 1.2, 0.64, 1)",
          }}
        ></div>
      </nav>
    </>
  );
}
