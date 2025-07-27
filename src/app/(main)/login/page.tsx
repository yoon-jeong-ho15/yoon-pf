import LoginForm from "./login-form";
import { notoSansKr } from "@/app/fonts";

export default function Page() {
  return (
    <div className={`flex justify-center`}>
      <div
        className="
            flex flex-col
            w-2/3 pt-7 pb-4
            mt-10
            items-center
            bg-linear-to-r 
            from-cyan-500 to-indigo-500
            rounded-2xl
            min-h-72"
      >
        <span
          className={`
            block text-4xl 
            text-gray-100 
            ${notoSansKr.className}
            font-extrabold
            animate-letter-spacing
            `}
        >
          이름과 생년월일을 입력해주세요.
        </span>
        <span className="mt-2 text-gray-100 text-sm">
          계정이 없다면 게스트 , 999999로 접속이 가능합니다.
        </span>
        <LoginForm />
      </div>
    </div>
  );
}
