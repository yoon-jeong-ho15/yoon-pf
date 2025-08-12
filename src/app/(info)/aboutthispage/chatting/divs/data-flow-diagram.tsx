"use client";
// import { motion } from "motion/react";
import { useState } from "react";

export default function DataFlowDiagram() {
  const [activeFlow, setActiveFlow] = useState("read");

  return (
    <div>
      <div className="my-6 p-4 border rounded-lg bg-gray-50 overflow-x-auto">
        <div className="flex gap-2 p-2 rounded">
          <button
            onClick={() => setActiveFlow("read")}
            className={`px-4 py-2 rounded transition-colors ${
              activeFlow === "read"
                ? "bg-blue-600 text-white"
                : "bg-blue-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            채팅방 입장
          </button>
          <button
            onClick={() => setActiveFlow("write")}
            className={`px-4 py-2 rounded transition-colors ${
              activeFlow === "write"
                ? "bg-violet-500 text-white"
                : "bg-violet-100 text-gray-700 hover:bg-gray-100"
            }`}
          >
            메시지 전송
          </button>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 500"
          className="min-w-[780px]"
        >
          <defs>
            <marker
              id="arrow-blue"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-blue-500" />
            </marker>
            <marker
              id="arrow-violet"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-violet-500" />
            </marker>
            <marker
              id="arrow-purple"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
            </marker>
          </defs>

          <g id="client-components">
            <rect
              x="20"
              y="20"
              width="150"
              height="460"
              rx="10"
              fill="#f3f4f6"
              stroke="#d1d5db"
            />
            <text x="95" y="45" textAnchor="middle">
              Client (Browser)
            </text>

            <rect
              x="40"
              y="70"
              width="110"
              height="50"
              rx="5"
              fill="#fff"
              stroke="#6b7280"
            />
            <text x="95" y="100" textAnchor="middle">
              ChatList
            </text>

            <rect
              x="40"
              y="150"
              width="110"
              height="50"
              rx="5"
              fill="#fff"
              stroke="#6b7280"
            />
            <text x="95" y="180" textAnchor="middle">
              MessageForm
            </text>

            <rect
              x="40"
              y="230"
              width="110"
              height="50"
              rx="5"
              fill="#fff"
              stroke="#6b7280"
            />
            <text x="95" y="260" textAnchor="middle">
              MessageBox
            </text>

            <rect
              x="40"
              y="310"
              width="110"
              height="80"
              rx="5"
              fill="#e0e7ff"
              stroke="#818cf8"
            />
            <text x="95" y="340" textAnchor="middle">
              Chatroom
            </text>
            <text x="95" y="360" textAnchor="middle">
              Provider
            </text>
            <text x="95" y="375" textAnchor="middle" fontSize="10">
              (Context)
            </text>
          </g>

          <g id="server-components">
            <rect
              x="250"
              y="20"
              width="220"
              height="460"
              rx="10"
              fill="#f3f4f6"
              stroke="#d1d5db"
            />
            <text x="360" y="45" textAnchor="middle">
              Server (Next.js)
            </text>

            <rect
              x="270"
              y="150"
              width="180"
              height="70"
              rx="5"
              fill="#fff"
              stroke="#6b7280"
            />
            <text x="360" y="180" textAnchor="middle">
              Server Actions
            </text>
          </g>

          <g id="backend-services">
            <rect
              x="550"
              y="20"
              width="230"
              height="460"
              rx="10"
              fill="#f3f4f6"
              stroke="#d1d5db"
            />
            <text x="665" y="45" textAnchor="middle">
              Backend (Supabase)
            </text>

            <rect
              x="570"
              y="70"
              width="190"
              height="50"
              rx="5"
              fill="#fff"
              stroke="#6b7280"
            />
            <text x="665" y="100" textAnchor="middle">
              PostgreSQL DB
            </text>

            <rect
              x="570"
              y="350"
              width="190"
              height="50"
              rx="5"
              fill="#fff"
              stroke="#6b7280"
            />
            <text x="665" y="380" textAnchor="middle">
              Realtime (WebSocket)
            </text>
          </g>

          {/* Flow 1: Enter Chatroom */}
          <g
            id="flow-read"
            className="stroke-blue-500"
            strokeWidth="1.5"
            fill="none"
            markerEnd="url(#arrow-blue)"
            style={{
              opacity: activeFlow === "read" ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <path d="M40,95 L20,95 Q10,95 10,105 L10,310 Q10,320 20,320 L40,320" />
            <path d="M40,95 L20,95 Q10,95 10,105 L10,250 Q10,250 20,250 L40,250" />
            <text x="10" y="220" fontSize="10" strokeWidth={0.5}>
              1. select
            </text>

            <path d="M150,350 L220,350 Q230,350 230,340 L230,210 Q230,200 240,200 L270,200" />
            <text x="160" y="365" fontSize="10" strokeWidth={0.5}>
              2. enterChatroom()
            </text>

            <path d="M450,195 L520,195 Q530,195 530,185 L530,115 Q530,105 540,105 L570,105" />
            <text x="470" y="210" fontSize="10" strokeWidth={0.5}>
              3. DB Update
            </text>

            <path d="M150,255 L200,255 Q210,255 210,245 L210,195 Q210,185 220,185 L270,185" />
            <text x="160" y="265" fontSize="10" strokeWidth={0.5}>
              4. getPrevChats()
            </text>

            <path d="M570,95 L500,95 Q490,95 490,105 L490,155 Q490,165 480,165 L450,165" />
            <text x="480" y="90" fontSize="10" strokeWidth={0.5}>
              5. return chats
            </text>

            <path d="M270,175 L200,175 Q190,175 190,185 L190,235 Q190,245 180,245 L150,245" />
            <text x="180" y="170" fontSize="10" strokeWidth={0.5}>
              6. render
            </text>

            <path d="M150,270 L320,270 Q330,270 330,280 L330,370 Q330,380 340,380 L570,380" />
            <text x="360" y="370" fontSize="10" strokeWidth={0.5}>
              7. Subscribe
            </text>
          </g>

          <g
            id="flow-write"
            className="stroke-violet-500"
            strokeWidth="1.5"
            fill="none"
            markerEnd="url(#arrow-violet)"
            style={{
              opacity: activeFlow === "write" ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <path d="M150,175 L270,175" />
            <text x="165" y="170" fontSize="10" strokeWidth={0.5}>
              A. sendChatMessage()
            </text>

            <path d="M450,165 L520,165 Q530,165 530,155 L530,125 Q530,115 540,115 L570,115" />
            <text x="485" y="150" fontSize="10" strokeWidth={0.5}>
              B. Insert Msg
            </text>

            <path d="M450,195 L490,195 Q500,195 500,205 L500,350 Q500,360 510,360 L570,360" />
            <text x="480" y="280" fontSize="10" strokeWidth={0.5}>
              C. Broadcast
            </text>

            <path d="M570,370 L360,370 Q350,370 350,360 L350,280 Q350,270 340,270 L150,270" />
            <text x="360" y="310" fontSize="10" strokeWidth={0.5}>
              D. Receive & Render
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
