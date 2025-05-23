import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#E11D48",      // Ejemplo: rosa Tussy Store
        secondary: "#FBBF24",    // Ejemplo: amarillo Tussy Store
        accent: "#0EA5E9",       // Ejemplo: azul acento
        muted: "#F3F4F6",        // gris claro
        dark: "#171717",         // gris oscuro
      },
    },
  },
  plugins: [],
} satisfies Config;
