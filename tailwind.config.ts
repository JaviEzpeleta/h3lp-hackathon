import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#0ed3c1",
        rfGreen: "#47ec93",
        ttRed: "#fe2c55",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        shantellSans: ["Shantell Sans", "sans-serif"],
        vcr: ["VCR OSD Mono", "monospace"],
        museo: ["MuseoSans", "sans-serif"],
        heyComic: ["HeyComic", "sans-serif"],
      },
      fontSize: {
        "10xl": ["8rem", { lineHeight: "1" }], // 128px
        "11xl": ["10rem", { lineHeight: "1" }], // 160px
        "12xl": ["12rem", { lineHeight: "1" }], // 192px
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
