import { Inter } from "next/font/google";
import { Noto_Sans_KR } from "next/font/google";
import { Nanum_Gothic } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
export const notoSansKr = Noto_Sans_KR({ subsets: ["latin"] });
export const nanumGothic = Nanum_Gothic({
  weight: ["400", "700"],
  subsets: ["latin"],
});
