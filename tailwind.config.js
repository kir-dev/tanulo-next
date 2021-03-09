module.exports = {
  darkMode: 'class',
  purge: {
    enabled: true,
    preserveHtmlElements: false,
    content: ['./views/**/*.pug', './public/**/*.js'],
  },
  theme: {
    extend: {
      boxShadow: {
        full:
          '0px 4px 32px rgba(0, 0, 0, 0.3), 4px 0px 4px rgba(0, 0, 0, 0.1);',
      },
      colors: {
        'indigo-1000': '#211f5b',
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
  variants: {
    display: ['responsive', 'group-hover'],
    extend: {
      typography: ['dark']
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
