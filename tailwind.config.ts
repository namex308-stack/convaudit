import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        teal: {
          DEFAULT: "var(--teal)",
          foreground: "var(--teal-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      fontSize: {
        display: "var(--type-display)",
        h1: "var(--type-h1)",
        h2: "var(--type-h2)",
        h3: "var(--type-h3)",
        h4: "var(--type-h4)",
        body: "var(--type-body)",
        caption: "var(--type-caption)",
        badge: "var(--type-badge)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        16: "var(--space-16)",
        20: "var(--space-20)",
        24: "var(--space-24)",
        page: "var(--space-page)",
        section: "var(--space-section)",
      },
      borderRadius: {
        xs: "var(--radius-token-xs)",
        sm: "var(--radius-token-sm)",
        md: "var(--radius-token-md)",
        lg: "var(--radius-token-lg)",
        xl: "var(--radius-token-xl)",
        "2xl": "var(--radius-token-2xl)",
      },
      boxShadow: {
        card: "var(--elevation-card)",
        floating: "var(--elevation-floating)",
      },
      transitionDuration: {
        fast: "var(--timing-fast)",
        normal: "var(--timing-normal)",
        slow: "var(--timing-slow)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
