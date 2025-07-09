"use client";
import { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const credentialsAction = async (formData: FormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username: formData.get("username"),
        password: formData.get("password"),
        redirect: false,
        callbackUrl: "/more",
      });

      console.log("Full result:", result);
      console.log("Error type:", result?.error);

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError("이름 또는 생년월일을 확인해주세요.");
        } else if (result.error === "CallbackRouteError") {
          setError("생년월일이 올바르지 않습니다.");
        } else if (result.error === "Configuration") {
          setError("이름 또는 생년월일을 확인해주세요.");
        } else {
          setError("로그인에 실패했습니다. 다시 시도해주세요.");
        }
        console.error("Login error:", result.error);
      } else if (result?.ok) {
        router.push("/more");
        router.refresh();
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Login exception:", error);
      setError("로그인 중 오류가 발생했습니다. 네트워크를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordHandler = (input: string) => {
    const numberOnly = input.replace(/[^0-9]/g, "");
    // console.log("pwd : ", numberOnly);
    setPassword(numberOnly);
  };

  return (
    <form
      action={credentialsAction}
      className="flex w-full justify-center items-center relative"
    >
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
            id="username"
            name="username"
            placeholder="게스트"
            value={username}
            ref={usernameRef}
            disabled={isLoading}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                passwordRef.current?.focus();
              }
            }}
            className="
                bg-gray-50 text-center rounded-md py-1
                outline-none tracking-widest w-full
                focus:bg-gray-100
                focus:text-xl
                transition-all
                font-normal
                disabled:opacity-50"
            required
          />
        </div>

        <div className="w-full">
          <label>생년월일 (6자리)</label>
          <input
            id="password"
            name="password"
            placeholder="999999"
            value={password}
            ref={passwordRef}
            disabled={isLoading}
            maxLength={6}
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
                font-normal
                disabled:opacity-50"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="
              w-20 h-14 rounded-md 
              font-normal
              bg-gray-100 
              hover:bg-gray-200 
              active:bg-gray-100
              disabled:opacity-50
              disabled:cursor-not-allowed
              absolute -right-26 top-8
              inset-shadow-[0_0_3px_indigo]"
        >
          {isLoading ? "..." : "접속"}
        </button>
      </div>
      {error && (
        <div className="absolute bg-white/60 -bottom-5">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
    </form>
  );
}
