import { Inter } from "next/font/google";
import { Noto_Sans_KR } from "next/font/google";
import { Nanum_Gothic } from "next/font/google";
import { Roboto_Mono } from "next/font/google";
import { Hahmlet } from "next/font/google";
import { Noto_Serif_KR } from "next/font/google";

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

export const hahmlet = Hahmlet({
  subsets: ["latin"],
});

export const notoSerifKr = Noto_Serif_KR({ subsets: ["latin"] });
