import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Earth & Ink Theme Colors
        earth: {
          ink: '#0F2A42',      // Deep Ink Navy (main headings)
          brown: '#2C2416',    // Deep Brown/Black (borders, text)
          cream: '#F5F1E8',    // Warm Cream/Alabaster (backgrounds)
          white: '#FFFCF8',    // Warm White (cards, surface)
          teal: '#3CAEA3',     // Teal (CTAs, badges, tech tags)
          orange: '#ED553B',   // Red-Orange (highlights, hover)
          ochre: '#CA8A04',    // Deep Ochre (accents)
          gold: '#D4A574',     // Gold (decorative)
        },
        text: {
          primary: '#334155',
          'primary-alt': '#2C2416',
          secondary: '#4B5563',
          'secondary-alt': '#6B5644',
          tertiary: '#5C5347',
        },
        stone: {
          warm: '#E7E5E4',
        },
        // Keep shadcn defaults for compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        // Offset shadows for Earth & Ink theme
        'offset-sm': '2px 2px 0px 0px rgba(44,36,22,0.3)',
        'offset': '3px 3px 0px 0px rgba(44,36,22,0.3)',
        'offset-md': '4px 4px 0px 0px rgba(44,36,22,0.3)',
        'offset-lg': '6px 6px 0px 0px rgba(44,36,22,0.4)',
        'offset-xl': '8px 8px 0px 0px #ED553B',
      },
      maxWidth: {
        'prose': '65ch',
      },
      lineHeight: {
        'reading': '1.75',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};

export default config;

