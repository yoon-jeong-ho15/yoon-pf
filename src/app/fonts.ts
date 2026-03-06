import { Inter } from "next/font/google";
import { Noto_Sans_KR } from "next/font/google";
import { Nanum_Gothic } from "next/font/google";
import { Nanum_Gothic_Coding } from "next/font/google";
import { Roboto_Mono } from "next/font/google";
import { Noto_Serif_KR } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({ subsets: ["latin"] });

export const notoSansKr = Noto_Sans_KR({ subsets: ["latin"] });

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: "400",
});

export const nanumGothic = Nanum_Gothic({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const nanumGothicCoding = Nanum_Gothic_Coding({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const menlo = localFont({
  src: "./Menlo-Regular.ttf",
});

export const d2Coding = localFont({
  src: [
    {
      path: "./D2Coding-Ver1.3.2-20180524.ttf",
      weight: "400",
    },
    {
      path: "./D2CodingBold-Ver1.3.2-20180524.ttf",
      weight: "700",
    },
  ],
});
