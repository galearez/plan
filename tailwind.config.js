const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      gray: colors.blueGray,
      sky: {
        600: colors.sky[600],
        700: colors.sky[700],
      },
      red: {
        600: colors.red[600],
        700: colors.red[700],
      },
    },
    minWidth: {
      19: '19rem',
    },
    boxShadow: {
      DEFAULT:
        '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.30)',
    },
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
        mono: ['IBM Plex Mono', ...defaultTheme.fontFamily.mono],
      },
      transitionProperty: {
        width: 'width',
      },
    },
  },
  variants: {
    extend: {
      ringWidth: ['hover'],
      ringOffsetWidth: ['hover'],
    },
  },
  plugins: [require('@tailwindcss/forms')({ strategy: 'class' })],
};
