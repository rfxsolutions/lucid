import colors from 'tailwindcss/colors'

export default {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    colors: {
      primary: '#153E69',
      secondary: '#5CBDE5',
      'rfx-gray': '#888A8B',
      'rfx-dark-gray': '#434343',
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      red: colors.red,
      green: colors.green,
      orange: colors.orange,
      yellow: colors.yellow,
      blue: colors.blue,
      slate: colors.slate
    },
    animationDelay: {
      100: '100ms',
      200: '200ms',
      300: '300ms',
      400: '400ms',
      500: '500ms',
      600: '600ms',
      700: '700ms'
    },

    extend: {
      fontFamily: {
        inter: ['Inter']
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        grow: {
          to: {
            width: '340px'
          }
        }
      },
      animation: {
        'fade-in': 'fade-in .5s ease-in forwards',
        grow: 'grow 1s linear forwards'
      }
    },
    dropShadow: {
      custom: '0 3px 5px rgba(203, 213, 225, 1)'
    }
  },
  plugins: [
    import('@tailwindcss/typography'),
    import('@tailwindcss/line-clamp'),
    import('@tailwindcss/aspect-ratio'),
    import('@tailwindcss/forms'),
    import('tailwindcss-animation-delay')
  ]
}
