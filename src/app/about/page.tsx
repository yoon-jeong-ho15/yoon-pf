"use client";
import { useEffect, useState } from "react";

export default function About() {
  const [height, setHeight] = useState<string>("9rem");
  const [bgPosition, setBgPosition] = useState<string>("100% 0");

  useEffect(() => {
    const heightTimeout = setTimeout(() => {
      setHeight("45rem");

      const transitionTimeout = setTimeout(() => {
        setBgPosition("0% 0"); // Move gradient into view
      }, 1000);
      return () => clearTimeout(transitionTimeout);
    }, 1000);
    return () => clearTimeout(heightTimeout);
  }, []);

  return (
    <div
      className="
      relative flex flex-col 
      px-20 py-8 mt-6 w-full 
      text-shadow-sm
      shadow-lg
      bg-gradient-to-r from-sky-400/40 from-5% via-blue-400/40 via-35% to-gray-100/70 to-60%"
      style={{
        height: height,
        backgroundSize: "250% 100%",
        backgroundPosition: bgPosition,
        transition: "height 0.4s ease-out, background-position 0.7s ease-out",
      }}
    >
      <div className="relative z-10">
        <h1 className="text-6xl opacity-0 animate-fade-in">윤정호</h1>
        <h2
          className="text-3xl opacity-0 animate-fade-in"
          style={{ "--delay": "0.3s" } as React.CSSProperties}
        >
          Yoon Jeong Ho
        </h2>
      </div>
    </div>
  );
}
