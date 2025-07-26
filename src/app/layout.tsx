import type { Metadata } from "next";
import "./globals.css";
import { nanumGothic } from "@/app/fonts";
import Navbar from "./ui/navbar";
import Footer from "./ui/footer";

export const metadata: Metadata = {
  title: "윤정호",
  description: "Yoon's blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${nanumGothic.className} antialiased overflow-y-scroll flex flex-col`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
