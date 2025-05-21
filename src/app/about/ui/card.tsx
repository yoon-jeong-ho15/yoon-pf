"use client";

import { useEffect, useState } from "react";

interface RowData {
  logo: string;
  period: string;
  description: string;
  etc?: string;
}

const rowDataMap: Record<string, RowData> = {
  "KH 정보교육원": {
    logo: "🖥️",
    period: "2025.03 수료",
    description: "자바, SQL, HTML, CSS, JavaScript, React",
  },
  가톨릭대학교: {
    logo: "🎓",
    period: "2023.03 졸업",
    description: "철학",
  },
  독학학위제: {
    logo: "📚",
    period: "2021.01 졸업",
    description: "영어영문학",
  },
};

const Row = ({ title }: { title: string }) => {
  const data = rowDataMap[title];

  return (
    <div
      className="
          overflow-hidden
          flex flex-col justify-center
          p-5 hover:bg-white/20 transition-colors
          "
    >
      <div
        className={`flex opacity-0 animate-fade-in`}
        style={{ "--delay": "3.7s" } as React.CSSProperties}
      >
        <span className="text-3xl">{data.logo}</span>
        <span className="text-lg text-shadow-sm">{title}</span>
      </div>
      <div
        className={`flex opacity-0 flex-col animate-fade-in`}
        style={{ "--delay": "4s" } as React.CSSProperties}
      >
        <span className="text-sm text-slate-600">{data.period}</span>
        <span className="text-white">{data.etc}</span>
        <span>{data.description}</span>
      </div>
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
        bg-blue-400/60
        rounded-3xl p2 mt-14
        shadow-lg h-102
        overflow-y-hidden
        flex-col divide-y divide-blue-800
        "
      style={{
        width: width,
        transition: "width 0.2s ease-out",
      }}
    >
      <Row title="KH 정보교육원" />
      <Row title="가톨릭대학교" />
      <Row title="독학학위제" />
    </div>
  );
}
