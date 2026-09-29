import animate from 'tailwindcss-animate'

/** Design tokens from Figma "00 · Design System" (node 11:31) + shadcn/ui semantic tokens */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Durai brand palette
        ivory: '#F7F0E4',
        roast: '#3A2317',
        sand: '#E9D9BF',
        apple: '#C8442C',
        gold: '#C99A45',
        leaf: '#2E4A3A',
        night: '#1D1512',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        line: '#DCCCB2',
        error: '#B3261E',
        success: '#2E7D4F',
        mint: '#E3EBE3',
        flavour: {
          plain: '#EADBC0',
          roasted: '#B77A3E',
          pepper: '#4A4A48',
          chilli: '#B8322A',
          honey: '#D9A23A',
          chettinad: '#8C3B1F',
          mint: '#5E8C5A',
        },
        // shadcn/ui semantic tokens (mapped to the brand in index.css)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
        tamil: ['"Hind Madurai"', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['88px', { lineHeight: '1' }],
        h1: ['56px', { lineHeight: '1.1' }],
        h2: ['40px', { lineHeight: '1.15' }],
        h3: ['24px', { lineHeight: '1.3' }],
        'body-l': ['18px', { lineHeight: '1.6' }],
        label: ['12px', { lineHeight: 'normal', letterSpacing: '0.12em' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        input: '8px',
        card: '20px',
        media: '32px',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [animate],
}
