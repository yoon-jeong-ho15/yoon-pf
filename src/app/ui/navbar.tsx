"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { robotoMono } from "./fonts";

export default function Navbar() {
  const pathname = usePathname();
  const homeRef = useRef<HTMLAnchorElement>(null);
  const aboutRef = useRef<HTMLAnchorElement>(null);
  const moreRef = useRef<HTMLAnchorElement>(null);
  const [activePosition, setActivePosition] = useState({ left: 0, width: 0 });

  useEffect(() => {
    //현재 주소로 ref 지정해주기
    let currentRef = homeRef;
    if (pathname.startsWith("/about")) {
      currentRef = aboutRef;
    } else if (pathname.startsWith("/more") || pathname.startsWith("/login")) {
      currentRef = moreRef;
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
    <nav
      className={`
          ${robotoMono.className}
          flex justify-around items-center 
          h-14 mt-8 mx-10 text-2xl 
          shadow-lg
          border-gray-400 border-1
          bg-gray-100
          rounded-3xl
          font-[500]
          relative
          overflow-hidden
          text-shadow-xs/10
          `}
    >
      <Link
        href="/"
        ref={homeRef}
        className="
        flex justify-center items-center 
        h-full w-35 my-3
        z-10"
      >
        home
      </Link>
      <Link
        href="/about"
        ref={aboutRef}
        className="flex 
          justify-center items-center 
          h-full w-35 my-3
          z-10"
      >
        about
      </Link>
      <Link
        href="/more"
        ref={moreRef}
        className="flex 
          justify-center items-center 
          h-full w-35 my-3
          z-10"
      >
        more
      </Link>
      <div
        className="
            absolute h-full my-3
            transition-all
            duration-300
            flex items-center justify-between"
        style={{
          left: `${activePosition.left}px`,
          width: `${activePosition.width}px`,
          transitionTimingFunction: "cubic-bezier(0.34, 1.2, 0.64, 1)",
        }}
      >
        <span className="hidden md:block absolute -left-19">print</span>
        <span>(</span>
        <span>)</span>
      </div>
    </nav>
  );
}
