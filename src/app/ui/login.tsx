"use client";

import { useRef, useState } from "react";

export default function Login() {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const passwordHandler = (input: string) => {
    const numberOnly = input.replace(/[^0-9]/g, "");
    console.log("pwd : ", numberOnly);
    setPassword(numberOnly);
  };

  return (
    <div className="flex justify-center">
      <div
        className="
            flex flex-col
            w-2/3 py-6
            mt-10
            items-center
            bg-cyan-500
            rounded-2xl
        "
      >
        <span
          className="block text-7xl text-gray-100 font-bold
            animate-letter-spacing
            "
        >
          당신은 누구신가요?
        </span>
        <div className="w-60 h-20 mt-6 mb-3 flex flex-col justify-around">
          <input
            name="username"
            placeholder="이름"
            value={username}
            ref={usernameRef}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter" || e.key === "ArrowDown") {
                passwordRef.current?.focus();
              }
            }}
            className="
                bg-gray-50 text-center rounded-md py-1
                outline-none tracking-widest
                focus:bg-gray-100
                focus:text-xl
                transition-all
            "
          ></input>
          <input
            name="pwd"
            placeholder="생년월일"
            value={password}
            ref={passwordRef}
            onChange={(e) => passwordHandler(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "ArrowUp") {
                usernameRef.current?.focus();
              }
            }}
            className="
                bg-gray-50 text-center rounded-md py-1
                outline-none tracking-widest
                focus:bg-gray-100
                focus:text-xl
                transition-all
            "
          ></input>
        </div>
        <button className="w-20 h-6 rounded-md bg-gray-300 hover:bg-gray-200 active:bg-gray-300">
          접속
        </button>
      </div>
    </div>
  );
}
