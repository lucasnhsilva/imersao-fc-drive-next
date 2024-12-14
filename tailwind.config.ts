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
        default: "#242526",
        main: "lightgreen",
        background: "var(--background)",
        foreground: "var(--foreground)",
        error: "darkred",
        success: "darkgreen",
      },
      textColor: {
        primary: "#242526",
        contrast: "#ffffff",
      },
    },
  },
  plugins: [],
} satisfies Config;
