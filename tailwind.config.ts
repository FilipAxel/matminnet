/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "385px",
        media428: "428px",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-roboto-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), require("@tailwindcss/aspect-ratio")],
} satisfies Config;
