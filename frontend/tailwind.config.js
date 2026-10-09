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
        dark: {
          900: '#07090E', // Deepest background
          850: '#0B0F19', // Main surface background
          800: '#111827', // Card surface
          750: '#161F33', // Slightly lighter card
          700: '#1F293D', // Elevated element
          600: '#374151', // Border / subtle
          500: '#4B5563',
        },
        nexus: {
          cyan: '#06B6D4',
          blue: '#3B82F6',
          electric: '#00F0FF',
          violet: '#8B5CF6',
          purple: '#A855F7',
          amber: '#F59E0B',
          red: '#EF4444',
          emerald: '#10B981',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glow-blue': '0 0 20px -5px rgba(59, 130, 246, 0.3)',
        'glow-violet': '0 0 20px -5px rgba(139, 92, 246, 0.3)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.3)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
