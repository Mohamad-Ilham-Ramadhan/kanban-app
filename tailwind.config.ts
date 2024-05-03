import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-column0',
    'bg-column1',
    'bg-column2',
    'bg-column3',
    'bg-column4',
    'bg-column5',
  ],
  theme: {
    extend: {
      colors: {
        'board': '#20212c',
        'primary': '#635FC7',
        'primary-light': '#A8A4FF',
        'column0': '#49C4E5',
        'column1': '#635FC7',
        'column2': '#67e2ae',
        'column3': '#e5a449',
        'column4': '#2a3fdb',
        'column5': '#c36e6e',
        'primary-hover': '#8c89e0',
        'dark-light': '#2b2c37',
        'drag-card-dark': '#23242c', // when card-task ready/available to drag (theme === dark)
        'drag-card-light': '#e2e8f0', // when card-task ready/available to drag (theme === ligth)
        'light-theme-bg': '#f4f7fd',
        'slate-400': '#828fa3',
        'red-450': '#ea5555',
        'gray-750': '#313a48',
      },
      borderRadius: {
        xl: '.75rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
