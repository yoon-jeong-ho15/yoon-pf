import type { Metadata } from "next";
import "./globals.css";
import { nanumGothic } from "@/app/ui/fonts";
import Navbar from "./ui/navbar";

export const metadata: Metadata = {
  title: "윤정호",
  description: "Yoon's portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${nanumGothic.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
