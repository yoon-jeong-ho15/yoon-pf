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
      <head>
        {/* <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        /> */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/apple-touch-icon.png"
        />
      </head>
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
