import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      xs: "385px",
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
} satisfies Config;
