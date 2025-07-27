import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

// module.exports = {
//   content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
//   purge: [],
//   theme: {
//     extend: {
//       keyframes: {
//         pulse: {
//           "50%": { opacity: 0.5 },
//         },
//       },
//       animation: {
//         "pulse-fast": "pulse 1s cubic-bezier(0,0,1,1) infinite",
//       },
//     },
//   },
//   variants: {},
//   plugins: [typography],
// };

const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        // DEFAULT: {
        //   css: {
        //     color: theme("colors.gray.700"),
        //     a: {
        //       color: theme("colors.blue.500"),
        //       "&:hover": {
        //         color: theme("colors.blue.700"),
        //       },
        //     },
        //   },
        // },
        blog: {
          css: {
            "--tw-prose-body": theme("colors.slate.800"),
            "--tw-prose-headings": theme("colors.slate.900"),
            "--tw-prose-links": theme("colors.teal.600"),
            "--tw-prose-bold": theme("colors.slate.900"),
            "--tw-prose-quotes": theme("colors.slate.900"),
            "--tw-prose-quote-borders": theme("colors.teal.300"),
            "--tw-prose-pre-bg": theme("colors.slate.800"),
            "--tw-prose-code": theme("colors.white"),
            h1: {
              fontSize: theme("fontSize.4xl"),
              fontWeight: "800",
            },
            p: {
              lineHeight: "1.7",
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
export default config;
