import { robotoMono } from "@/app/fonts";

export default function Backtick({ str }: { str: string }) {
  return (
    <span
      className={`bg-black/10 px-1 py-0.5 rounded 
      text-blue-700
      ${robotoMono.className}`}
    >
      {str}
    </span>
  );
}
