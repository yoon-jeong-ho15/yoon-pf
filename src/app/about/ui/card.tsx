"use client";

import { useEffect, useState } from "react";

const Row = ({ title, logo }: { title: string; logo: string }) => {
  return (
    <div
      className="
          overflow-hidden
          flex items-center
          p-5
          "
    >
      {logo}
      <span className="text-lg text-shadow-sm">{title}</span>
    </div>
  );
};

export default function Card() {
  const [width, setWidth] = useState<string>("0");

  useEffect(() => {
    setTimeout(() => {
      setWidth("20rem");
    }, 3000);
  });

  return (
    <div
      className="
        bg-blue-400/60 h-110
        rounded-3xl p2 mt-14
        shadow-lg
        overflow-hidden
        flex-col divide-y-2
        "
      style={{
        width: width,
        transition: "width 0.3s ease-out",
      }}
    >
      <Row title="가톨릭대학교 철학과" logo="" />
    </div>
  );
}
