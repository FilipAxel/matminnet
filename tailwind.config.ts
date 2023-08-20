import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      xs: "385px",
      media428: "428px",
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
} satisfies Config;
