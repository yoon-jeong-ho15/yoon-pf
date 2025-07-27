import type { Metadata } from "next";
import "@/app/globals.css";
import { nanumGothic } from "@/app/fonts";

export const metadata: Metadata = {
  title: "윤정호",
  description: "Yoon's blog",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
