"use client";

import { useState } from "react";

export default function BlogProcessDiagram() {
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);

  return (
    <div className="my-6 p-4 border rounded-lg bg-gray-50 overflow-x-auto relative">
      <h4 className="text-center font-bold mb-4">
        Markdown 콘텐츠 처리 파이프라인 (빌드 시점)
      </h4>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 720 320"
        className="min-w-[700px]"
      >
        <defs>
          <marker
            id="arrow-teal"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-teal-600" />
          </marker>
        </defs>

        {/* ============== BOXES (drawn first) ============== */}

        {/* Step 1: Markdown File */}
        <g>
          <rect
            x="20"
            y="130"
            width="100"
            height="50"
            rx="5"
            fill="#fff"
            stroke="#6b7280"
          />
          <text x="70" y="150" textAnchor="middle" className="font-bold">
            .md 파일
          </text>
          <text
            x="70"
            y="170"
            textAnchor="middle"
            fontSize="12"
            className="fill-gray-600"
          >
            (Source)
          </text>
        </g>

        {/* Process Column */}
        <g>
          {/* The large container box */}
          <rect
            x="140"
            y="30"
            width="440"
            height="260"
            rx="10"
            fill="#f3f4f6"
            stroke="#d1d5db"
          />
          <text x="360" y="55" textAnchor="middle">
            Next.js Build Environment
          </text>

          {/* gray-matter */}
          <rect
            x="150"
            y="80"
            width="120"
            height="50"
            rx="5"
            fill="#e0e7ff"
            stroke="#a5b4fc"
          />
          <text x="210" y="100" textAnchor="middle" className="font-bold">
            gray-matter
          </text>
          <text
            x="210"
            y="120"
            textAnchor="middle"
            fontSize="11"
            className="fill-gray-600"
          >
            Frontmatter 파싱
          </text>

          {/* remark */}
          <rect
            x="150"
            y="180"
            width="120"
            height="50"
            rx="5"
            fill="#e0e7ff"
            stroke="#a5b4fc"
          />
          <text x="210" y="200" textAnchor="middle" className="font-bold">
            remark
          </text>
          <text
            x="210"
            y="220"
            textAnchor="middle"
            fontSize="11"
            className="fill-gray-600"
          >
            Markdown → HTML
          </text>

          {/* Cheerio */}
          <g
            onMouseEnter={() => setHoveredBox("cheerio")}
            onMouseLeave={() => setHoveredBox(null)}
            className="cursor-pointer"
          >
            <rect
              x="300"
              y="130"
              width="120"
              height="50"
              rx="5"
              fill="#d1fae5"
              stroke="#6ee7b7"
            />
            <text x="360" y="150" textAnchor="middle" className="font-bold">
              cheerio
            </text>
            <text
              x="360"
              y="170"
              textAnchor="middle"
              fontSize="11"
              className="fill-gray-600"
            >
              HTML DOM 접근
            </text>
          </g>

          {/* highlight.js */}
          <g
            onMouseEnter={() => setHoveredBox("highlight")}
            onMouseLeave={() => setHoveredBox(null)}
            className="cursor-pointer"
          >
            <rect
              x="450"
              y="130"
              width="120"
              height="50"
              rx="5"
              fill="#fef3c7"
              stroke="#fcd34d"
            />
            <text x="510" y="150" textAnchor="middle" className="font-bold">
              highlight.js
            </text>
            <text
              x="510"
              y="170"
              textAnchor="middle"
              fontSize="11"
              className="fill-gray-600"
            >
              구문 강조 적용
            </text>
          </g>
        </g>

        {/* Step 5: Final HTML */}
        <g>
          <rect
            x="600"
            y="130"
            width="110"
            height="50"
            rx="5"
            fill="#fff"
            stroke="#6b7280"
          />
          <text x="655" y="150" textAnchor="middle" className="font-bold">
            Static HTML
          </text>
          <text
            x="655"
            y="170"
            textAnchor="middle"
            fontSize="12"
            className="fill-gray-600"
          >
            (최종 결과물)
          </text>
        </g>

        {/* ============== ARROWS (drawn last) ============== */}
        <g
          className="stroke-teal-600"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrow-teal)"
        >
          {/* From .md to processors */}
          <path d="M70,130 V120 A 15 15 0 0 1 85 105 H150" />
          <path d="M70,180 V190 A 15 15 0 0 0 85 205 H150" />

          {/* From processors to cheerio */}
          <path
            d="M270,105 H345 A 15 15 0 0 1 360 120 V 130"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M270,205 H345 A 15 15 0 0 0 360 190 V 180"
            strokeWidth="1.5"
            fill="none"
          />

          {/* From cheerio to highlight.js */}
          <path d="M420,155 L450,155" />

          {/* From highlight.js to final */}
          <path d="M570,155 L600,155" />
        </g>

        {/* Text labels for arrows */}
        <g fontSize="12" className="fill-teal-600">
          <text x="110" y="95" textAnchor="middle">
            meta-data
          </text>
          <text x="110" y="220" textAnchor="middle">
            content
          </text>
        </g>

        {/* ============== TOOLTIPS (drawn last) ============== */}
        <g
          style={{
            opacity: hoveredBox === "cheerio" ? 1 : 0,
            transition: "opacity 0.2s",
          }}
          pointerEvents="none"
        >
          <foreignObject x="290" y="185" width="140" height="130">
            <div
              className="
            p-1.5 bg-gray-800 text-white 
            rounded-lg shadow-lg h-full 
            flex flex-col text-xs
            "
            >
              <span className="font-bold my-2">Cheerio</span>
              <span className="text-[0.6rem]">
                서버에는 브라우저가 없어 DOM API를 사용할 수 없으므로, jQuery와
                유사한 문법으로 HTML 문자열에 접근하고 조작할 수 있게 해주는
                라이브러리입니다.
              </span>
            </div>
          </foreignObject>
        </g>
        <g
          style={{
            opacity: hoveredBox === "highlight" ? 1 : 0,
            transition: "opacity 0.2s",
          }}
          pointerEvents="none"
        >
          <foreignObject x="440" y="185" width="140" height="130">
            <div
              className="
              p-1.5 bg-gray-800 text-white 
              rounded-lg shadow-lg h-full 
              flex flex-col
              text-xs
              "
            >
              <span className="font-bold my-2">Highlight.js</span>
              <span className="text-[0.6rem]">
                Cheerio로 찾은 &lt;code&gt; 태그 내부의 텍스트를 읽어, 해당
                코드의 언어를 감지하고 문법에 맞게 색상을 입혀주는 역할을
                합니다.
              </span>
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  );
}
