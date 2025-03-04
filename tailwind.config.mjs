import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: ['./src/**/*!(*.stories|*.spec|*.test).{js,ts,tsx,astro,md,mdx,html}'],
  },
  darkMode: 'class', // Allows toggling to 'light' mode manually
  theme: {
    extend: {
    },
  }
};
