import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav
          className="
            flex justify-around
            items-center 
            w-full h-14
          bg-green-600
            mt-8 text-2xl"
        >
          <Link href="/">home</Link>
          <Link href="/about">about</Link>
          <Link href="/board">board</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
