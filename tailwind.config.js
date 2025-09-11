/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './constants/**/*.{js,jsx,ts,tsx,md,mdx}',
    './hooks/**/*.{js,jsx,ts,tsx,md,mdx}',
    './services/**/*.{js,jsx,ts,tsx,md,mdx}',
    './store/**/*.{js,jsx,ts,tsx,md,mdx}',
    './styles/**/*.{js,jsx,ts,tsx,md,mdx}',
    './utils/**/*.{js,jsx,ts,tsx,md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#EAFAF2',
          100: '#D5F6E4',
          200: '#ACECCA',
          300: '#82E3AF',
          400: '#58DA95',
          500: '#50D88F',
          600: '#25A762',
          700: '#1C7D49',
          800: '#135331',
          900: '#092A18',
          950: '#05150C',
        },

        blue: {
          50: '#E5F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#5398FF',
          500: '#3385FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
          950: '#000A1A',
        },

        gray: {
          0: '#FFFFFF',
          50: '#F1F2F3',
          100: '#E4E6E7',
          200: '#C9CCCF',
          300: '#AEB3B7',
          400: '#939A9F',
          500: '#60676C',
          600: '#484D51',
          700: '#363A3D',
          800: '#303336',
          900: '#181A1B',
          950: '#0C0D0E',
          box: '#F6F5FA',
        },

        kakao: '#FEE500',

        lime: {
          100: '#E6F2B8',
          400: '#B6D43B',
          500: '#9DD716',
        },

        red: {
          100: '#FFD6D6',
          400: '#FF7070',
          500: '#FF3A3A',
          error: '#FF3A4A',
        },

        orange: {
          100: '#FFD9B3',
          400: '#FF9C33',
          500: '#FF7D00',
        },

        yellow: {
          100: '#FFF3CC',
          400: '#F7BF3D',
          star: '#F6C72B',
          500: '#F6C72B',
        },

        brand: {
          kakao: '#FEE500',
        },
      },
      fontFamily: {
        NanumSquareNeo: ['NanumSquareNeo'],
      },
      fontSize: {
        '15px': ['15px', { lineHeight: 'normal' }],
        '24px': ['24px', { lineHeight: 'normal' }],
        '16px': ['16px', { lineHeight: '24px' }],

        'h-lg': ['24px', { lineHeight: '30px' }],
        'h-md': ['20px', { lineHeight: '24px' }],
        'h-sm': ['18px', { lineHeight: '24px' }],

        'b-lg': ['16px', { lineHeight: '20px' }],
        'b-md': ['15px', { lineHeight: '18px' }],
        'b-sm': ['14px', { lineHeight: '18px' }],

        c1: ['13px', { lineHeight: '16px' }],
        c2: ['12px', { lineHeight: '16px' }],
        c3: ['10px', { lineHeight: '14px' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        exgraBold: '800',
      },
    },
    backgroundImage: {
      'gradient-logo':
        'linear-gradient(135deg, #50D88F 0%, #51B9C6 50%, #5398FF 100%)',
      'gradient-bar': 'linear-gradient(270deg, #FDDF02 0%, #FFA600 178.44%)',
    },
  },
  plugins: [],
};
