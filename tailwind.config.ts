import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#05070d",
        plasma: "#20d9ff",
        aurora: "#b75cff",
        signal: "#7cffc4"
      },
      boxShadow: {
        glow: "0 0 36px rgba(32, 217, 255, 0.22)",
        magenta: "0 0 38px rgba(183, 92, 255, 0.18)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at top left, rgba(32,217,255,.18), transparent 32rem), radial-gradient(circle at 80% 15%, rgba(183,92,255,.14), transparent 28rem), linear-gradient(180deg, #05070d 0%, #080b12 48%, #05070d 100%)"
      }
    }
  },
  plugins: []
};

export default config;
