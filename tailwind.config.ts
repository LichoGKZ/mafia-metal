import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0b0b0b",
        void: "#eee9db",
        paper: "#f3f0e7",
        "paper-light": "#eeeadd",
        "paper-mid": "#e6e1d2",
        gold: "rgb(var(--gold-rgb) / <alpha-value>)",
        "gold-dark": "rgb(var(--gold-dark-rgb) / <alpha-value>)",
        silver: "#2a2822",
        crimson: "#8B0000",
        "gold-light": "rgb(var(--gold-light-rgb) / <alpha-value>)",
        ink: "#17150f",
      },
      fontFamily: {
        mono: ["var(--font-victor-mono)", "monospace"],
        victor: ["var(--font-victor-mono)", "monospace"],
        cinzel: ["var(--font-cinzel)", "serif"],
        bebas: ["var(--font-bebas)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        flicker: "flicker 3s linear infinite",
        grain: "grain 8s steps(10) infinite",
        float: "floatUp 4s ease-in-out infinite",
      },
      keyframes: {
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.4" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "20%": { transform: "translate(-15%, 5%)" },
          "30%": { transform: "translate(7%, -25%)" },
          "40%": { transform: "translate(-5%, 25%)" },
          "50%": { transform: "translate(-15%, 10%)" },
          "60%": { transform: "translate(15%, 0%)" },
          "70%": { transform: "translate(0%, 15%)" },
          "80%": { transform: "translate(3%, 35%)" },
          "90%": { transform: "translate(-10%, 10%)" },
        },
        badgePop: {
          "0%": { transform: "scale(0.4)" },
          "70%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(1)" },
        },
        floatUp: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gold-gradient":
          "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold-dark) 100%)",
        "metal-gradient":
          "linear-gradient(135deg, #8a8a8a 0%, #C0C0C0 50%, #6a6a6a 100%)",
      },
      boxShadow: {
        gold: "0 0 20px rgb(var(--gold-rgb) / 0.25)",
        "gold-lg": "0 0 50px rgb(var(--gold-rgb) / 0.4)",
        crimson: "0 0 20px rgba(139, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
