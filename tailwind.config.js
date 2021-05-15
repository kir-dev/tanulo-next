// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  purge:  ['./views/**/*.pug', './public/**/*.js'],
  theme: {
    extend: {
      //alert animation
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.8s ease-out'
      },
      boxShadow: {
        full:
          '0px 4px 32px rgba(0, 0, 0, 0.3), 4px 0px 4px rgba(0, 0, 0, 0.1);',
      },
      colors: {
        'indigo-1000': '#211f5b',
        orange: colors.orange,
      },
      typography: () => ({
        dark: {
          css: {
            color: 'white',
            strong: {
              color: 'white',
              'font-weight': 'bold',
            },
            h1: {
              color: 'white',
              'margin-top': '0'
            },
            h2: {
              color: 'white',
              'margin-top': '0'
            },
            h3: {
              color: 'white',
              'margin-top': '0'
            },
            h4: {
              color: 'white',
              'margin-top': '0'
            },
            p: {
              color: 'white',
              'margin-top': '0',
              'margin-bottom': '1em'
            },
            'ul > li': {
              '&::before': {
                'background-color': 'white',
                'font-weight': 'bold'
              }
            },
            'ol > li': {
              '&::before': {
                color: 'white',
                'font-weight': 'bold'
              }
            }
          }
        }
      })
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
