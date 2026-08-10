import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Identidad de marca — no reutilices estos nombres para otro proyecto,
        // están pensados específicamente para Golden Burger.
        charcoal: "#171310", // negro cálido, franja superior del header
        ink: "#241C14", // texto principal
        cream: "#F3ECDC", // fondo base, franja inferior del header
        gold: "#F0C81A", // acento principal — el "Golden" de la marca
        ember: "#C1432A", // acento secundario, rojo ladrillo
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;