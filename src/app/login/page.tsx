import LoginForm from "./login-form";
import { notoSansKr } from "@/app/ui/fonts";

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
            block text-7xl 
            text-gray-100 
            ${notoSansKr.className}
            font-extrabold
            animate-letter-spacing
            `}
        >
          당신은 누구신가요?
        </span>
        <LoginForm />
      </div>
    </div>
  );
}
