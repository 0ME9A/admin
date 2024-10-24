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
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: {
          100: "#FFD1A3",
          200: "#FFB974",
          300: "#FFA246",
          400: "#FF8A17",
          500: "#FF5F06", // Central accent color
          600: "#CC4C05",
          700: "#993904",
          800: "#662603",
          900: "#331302",
        },
        navy: {
          50: "#E5E5F2",
          100: "#BFBFDE",
          200: "#9999CA",
          300: "#7373B5",
          400: "#4D4DA1",
          500: "#27278D",
          600: "#1F1F70",
          700: "#171754",
          800: "#0F0F37",
          900: "#08081B",
        },
        gray: {
          50: "#EBEAF0",
          100: "#D7D5E1",
          200: "#C3C1D3",
          300: "#AFACC4",
          400: "#9B97B5",
          500: "#5E5B6D",
          600: "#4B4857",
          700: "#373541",
          800: "#24222B",
          900: "#121115",
        },
      },
    },
  },
};
export default config;
