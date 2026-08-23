import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B1F33",
        ink: "#14161A",
        ice: "#38BDF8",
        "ice-soft": "#7DD3FC",
        cream: "#F6EFE3",
        paper: "#FBFAF7",
        line: "#E2E8F0",
        frezblue: "#2A5CB0",
        frezwhite: "#F5F5F2",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.22em",
      },
    },
  },
  plugins: [],
};
export default config;
