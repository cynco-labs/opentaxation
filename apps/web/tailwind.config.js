/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        /* Brand-aligned design system fonts - Manrope for clean, modern sans-serif */
        sans: ['"Manrope"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      letterSpacing: {
        'tighter': '-0.035em',
        'tight': '-0.025em',
        'snug': '-0.011em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
        },
        foreground: "hsl(var(--foreground))",
        "surface-dark": "hsl(var(--surface-dark))",
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
        amber: {
          DEFAULT: "hsl(var(--amber))",
          light: "hsl(var(--amber-light))",
        },
        // Brand-aligned color palette
        brand: {
          ivory: "hsl(var(--brand-ivory))",
          maroon: "hsl(var(--brand-maroon))",
          espresso: "hsl(var(--brand-espresso))",
          'on-maroon': "hsl(var(--brand-on-maroon))",
          rose: "hsl(var(--brand-rose))",
          blush: "hsl(var(--brand-blush))",
          gold: "hsl(var(--brand-gold))",
          burgundy: "hsl(var(--brand-burgundy))",
          'border-ivory': "hsl(var(--brand-border-ivory))",
          'border-maroon': "hsl(var(--brand-border-maroon))",
          'muted-ivory': "hsl(var(--brand-muted-ivory))",
          'muted-rose': "hsl(var(--brand-muted-rose))",
          'sage': "hsl(var(--brand-sage))",
          'amber': "hsl(var(--brand-amber))",
          'warm-gray': "hsl(var(--brand-warm-gray))",
          'dark-brown': "hsl(var(--brand-dark-brown))",
          'medium-gray': "hsl(var(--brand-medium-gray))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius)",
        pill: "var(--radius)",
        card: "var(--radius)",
      },
      boxShadow: {
        'soft': '0 10px 30px -12px rgba(58, 42, 36, 0.25)',
        'card': '0 14px 40px -18px rgba(58, 42, 36, 0.28)',
        'soft-hover': '0 12px 35px -10px rgba(58, 42, 36, 0.3)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom, 0px)',
        'safe-top': 'env(safe-area-inset-top, 0px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
        'safe-left': 'env(safe-area-inset-left, 0px)',
        'safe-right': 'env(safe-area-inset-right, 0px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
