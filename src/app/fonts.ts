import { Noto_Sans_KR } from "next/font/google";
import { Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";

export const notoSansKr = Noto_Sans_KR({ subsets: ["latin"] });

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: "400",
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
