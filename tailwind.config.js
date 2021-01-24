module.exports = {
  darkMode: 'class',
  purge: ['./views/**/*.pug'],
  theme: {
    extend: {
      boxShadow: {
        full:
          '0px 4px 32px rgba(0, 0, 0, 0.3), 4px 0px 4px rgba(0, 0, 0, 0.1);',
      },
      colors: {
        'indigo-1000': '#211f5b',
      },
    },
  },
  variants: {
    display: ['responsive', 'group-hover'],
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
