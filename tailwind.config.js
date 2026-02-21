/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--p))',
        secondary: 'hsl(var(--s))',
        accent: 'hsl(var(--a))',
        neutral: 'hsl(var(--n))',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('daisyui'), require('tailwindcss-animate')],
  daisyui: {
    themes: [
      'dark',
      'light',
      'luxury',
      'business',
      'corporate',
      'coffee',
      'cyberpunk',
      {
        highcontrast: {
          primary: '#0000ff',
          secondary: '#ffffff',
          accent: '#00ff00',
          neutral: '#000000',
          'base-100': '#ffffff',
          info: '#0000ff',
          success: '#00ff00',
          warning: '#ffff00',
          error: '#ff0000',
        },
      },
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
};
