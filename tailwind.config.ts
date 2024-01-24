import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        chinese: ["var(--font-chinese)", ...fontFamily.sans],
      },
      boxShadow: {
        b: "0 4px 0",
        "b-small": "0 2px 0",
        "t-small": "0 -2px 0",
      },
      colors: {
        black: "#242424",
        softblack: "#282828",
        zinc: "#303030",
        softzinc: "#424242",
        wheat: "#bcb98a",
        mossgreen: "#899a5c",
        empty: "#505050",
        border: "#363636",
        white: "#e8e8e8",
        gray: "#888888",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
