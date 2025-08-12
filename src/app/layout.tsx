import type { Metadata } from "next";
import "@/app/globals.css";
import { nanumGothic } from "@/app/fonts";

export const metadata: Metadata = {
  title: "윤정호",
  description: "𓅰 𓅬 𓅭 𓅮 𓅯",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        className={`${nanumGothic.className} 
        antialiased flex flex-col max-w-screen min-h-screen
        overflow-y-scroll `}
      >
        {children}
      </body>
    </html>
  );
}
