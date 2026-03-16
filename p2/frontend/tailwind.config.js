/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Intrex refined color palette
        bg: {
          primary: '#09090E',    // Near-black with blue undertone
          secondary: '#0C0D15',  // Slightly lighter for rhythm
          surface: '#0F1018',    // Card surfaces
        },
        brand: {
          primary: '#6D5BFF',    // Electric purple
          secondary: '#00D4FF',  // Electric cyan
          success: '#10F0A0',    // Neon mint
          accent: '#F59E0B',     // Warm amber for testimonials
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3C8',
          tertiary: '#4B5280',
        },
        // Light theme colors
        light: {
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
          500: '#94a3b8',
          600: '#64748b',
          700: '#475569',
          800: '#334155',
          900: '#1e293b',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Semantic colors
        semantic: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        // Focus and interactive
        focus: '#a78bfa',
        // Scrollbar colors
        scrollbar: {
          track: '#0f172a',
          thumb: '#334155',
          thumbHover: '#475569',
        },
      },
      fontFamily: {
        serif: ['Instrument Serif', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
        'gradient-accent': 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%) !important',
        'gradient-subtle': 'linear-gradient(180deg, #0B1220 0%, #0F172A 100%)',
      },
      // Add missing custom utilities
      backgroundColor: {
        'dark-900': '#0B1220',
        'dark-400': '#94a3b8',
        'dark-300': '#cbd5e1',
        'dark-200': '#e2e8f0',
        'dark-100': '#f1f5f9',
      },
      textColor: {
        'dark-900': '#0B1220',
        'dark-400': '#94a3b8',
      },
      borderColor: {
        'surface-border': '#1E293B',
      },
    },
  },
  plugins: [],
}
