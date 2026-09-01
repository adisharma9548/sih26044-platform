/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81' },
        neutral: { 50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917' },
        success: { 50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981', 600: '#059669', 700: '#047857' },
        warning: { 50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
        danger: { 50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
        info: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      fontSize: {
        display: ['48px', { lineHeight: '1.1' }],
        'display-lg': ['56px', { lineHeight: '1.08' }],
        h1: ['40px', { lineHeight: '1.1' }],
        h2: ['32px', { lineHeight: '1.15' }],
        h3: ['24px', { lineHeight: '1.2' }],
        body: ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.6' }],
        caption: ['12px', { lineHeight: '1.5' }],
      },
      spacing: { 18: '4.5rem', 88: '22rem', 100: '25rem', 120: '30rem', 140: '35rem', 160: '40rem' },
      borderRadius: { xs: '4px', sm: '6px', md: '8px', lg: '12px', xl: '16px', '2xl': '20px' },
      boxShadow: {
        xs: '0 1px 2px rgba(0,0,0,0.05)',
        sm: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        md: '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
        lg: '0 10px 15px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)',
        xl: '0 20px 25px rgba(0,0,0,0.05), 0 4px 10px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}