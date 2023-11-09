import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  mode: '',
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
