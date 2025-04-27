"use client";
import { useRef, useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const passwordHandler = (input: string) => {
    const numberOnly = input.replace(/[^0-9]/g, "");
    console.log("pwd : ", numberOnly);
    setPassword(numberOnly);
  };

  const login = () => {};

  return (
    <div className="flex w-full justify-center items-center">
      <div
        className="
            mt-6 mb-3 w-56 
            flex flex-col 
            justify-around
            relative"
      >
        <div className="w-full">
          <label>이름</label>
          <input
            name="username"
            placeholder="게스트"
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
                outline-none tracking-widest w-full
                focus:bg-gray-100
                focus:text-xl
                transition-all
                font-normal"
          ></input>
        </div>
        <div className="w-full">
          <label>생년월일</label>
          <input
            name="pwd"
            placeholder="999999"
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
                outline-none tracking-widest w-full
                focus:bg-gray-100
                focus:text-xl
                transition-all
                font-normal"
          ></input>
        </div>
        <button
          className="
              w-20 h-14 rounded-md 
              font-normal
              bg-gray-100 
              hover:bg-gray-200 
              active:bg-gray-100
              absolute -right-26 top-8
              inset-shadow-[0_0_3px_indigo]
              "
          onClick={login}
        >
          접속
        </button>
      </div>
    </div>
  );
}
