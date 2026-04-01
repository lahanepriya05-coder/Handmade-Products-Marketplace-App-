/**
 * KINARA Brand - Tailwind CSS Configuration
 * Premium color palette for handmade ethnic clothing e-commerce
 * 
 * Usage in Tailwind:
 * bg-kinara-cream, text-kinara-brown-primary, border-kinara-gold, etc.
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        kinara: {
          // Brown palette
          'brown-primary': '#7A4A2E',
          'brown-dark': '#5C3620',
          'brown-light': '#8B5A3C',
          'brown-lighter': '#A67C52',

          // Text colors
          'text-dark': '#4A2C1D',
          'text-medium': '#6B4423',

          // Background colors
          'cream': '#F5E9DE',
          'cream-light': '#FAF7F2',
          'beige': '#E8D2BE',
          'beige-light': '#EFE5D8',
          'beige-lighter': '#F2EBDE',

          // Accent colors
          'gold': '#C89B6D',
          'gold-dark': '#A67C52',
          'gold-light': '#D9B89F',
          'gold-lighter': '#E5CDB8',

          'peach': '#F2C6A8',
          'peach-dark': '#E8AE88',
          'peach-light': '#F5D4BC',

          // Neutral colors
          'white': '#FFFFFF',
          'gray-light': '#F9F7F4',
          'gray-lighter': '#FEFDFB',
          'gray-medium': '#D4C4B4',
          'gray-dark': '#8B7D6B',

          // Semantic colors
          'success': '#6B8E6D',
          'success-light': '#A8C4A8',
          'error': '#A85A4A',
          'error-light': '#D4A39A',
          'warning': '#D4A574',
          'warning-light': '#E8BFAA',
          'info': '#6B8E9E',
          'info-light': '#A8C4D4',
        },
      },

      backgroundColor: {
        kinara: {
          'default': '#F5E9DE',
          'card': '#FFFFFF',
          'secondary': '#E8D2BE',
          'accent': '#C89B6D',
        },
      },

      textColor: {
        kinara: {
          'primary': '#4A2C1D',
          'secondary': '#6B4423',
          'accent': '#C89B6D',
        },
      },

      borderColor: {
        kinara: {
          'default': '#E8D2BE',
          'dark': '#7A4A2E',
          'light': '#F2EBDE',
        },
      },

      boxShadow: {
        'kinara-xs': '0 1px 2px rgba(90, 54, 32, 0.05)',
        'kinara-sm': '0 1px 3px rgba(90, 54, 32, 0.1)',
        'kinara-md': '0 4px 6px rgba(90, 54, 32, 0.1)',
        'kinara-lg': '0 10px 15px rgba(90, 54, 32, 0.15)',
        'kinara-xl': '0 20px 25px rgba(90, 54, 32, 0.15)',
        'kinara-gold': '0 4px 12px rgba(200, 155, 109, 0.2)',
        'kinara-gold-hover': '0 8px 20px rgba(200, 155, 109, 0.3)',
      },

      borderRadius: {
        kinara: {
          'xs': '0.25rem',
          'sm': '0.5rem',
          'md': '0.75rem',
          'lg': '1rem',
          'xl': '1.5rem',
          'full': '9999px',
        },
      },

      spacing: {
        kinara: {
          'xs': '0.25rem',
          'sm': '0.5rem',
          'md': '1rem',
          'lg': '1.5rem',
          'xl': '2rem',
          '2xl': '2.5rem',
          '3xl': '3rem',
        },
      },

      transitionDuration: {
        'kinara-fast': '150ms',
        'kinara-normal': '250ms',
        'kinara-slow': '350ms',
      },

      fontFamily: {
        'kinara-primary': [
          'Segoe UI',
          'Tahoma',
          'Geneva',
          'Verdana',
          'sans-serif',
        ],
        'kinara-secondary': [
          'Georgia',
          'Times New Roman',
          'serif',
        ],
      },

      fontSize: {
        'kinara-xs': ['0.75rem', { lineHeight: '1.5' }],
        'kinara-sm': ['0.875rem', { lineHeight: '1.5' }],
        'kinara-base': ['1rem', { lineHeight: '1.6' }],
        'kinara-lg': ['1.125rem', { lineHeight: '1.7' }],
        'kinara-xl': ['1.25rem', { lineHeight: '1.5' }],
        'kinara-2xl': ['1.5rem', { lineHeight: '1.4' }],
        'kinara-3xl': ['2rem', { lineHeight: '1.3' }],
        'kinara-4xl': ['2.5rem', { lineHeight: '1.2' }],
      },
    },
  },

  plugins: [
    // Custom utilities for brand-specific styles
    function ({ addUtilities }) {
      const utilities = {
        // Glass morphism effect
        '.glass-kinara': {
          'background': 'rgba(255, 255, 255, 0.95)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(122, 74, 46, 0.1)',
        },

        // Gradient text
        '.gradient-kinara': {
          'background': 'linear-gradient(135deg, #7A4A2E, #C89B6D)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },

        // Brand hover effect
        '.hover-kinara': {
          '@apply transition-all duration-250 hover:shadow-kinara-lg hover:scale-105': {},
        },

        // Premium button effect
        '.btn-kinara-primary': {
          '@apply bg-kinara-brown-primary text-kinara-white px-6 py-3 rounded-lg font-semibold uppercase tracking-wider shadow-kinara-md hover:bg-kinara-brown-dark hover:shadow-kinara-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-kinara-sm transition-all duration-250': {},
        },

        '.btn-kinara-secondary': {
          '@apply bg-kinara-gold text-kinara-white px-6 py-3 rounded-lg font-semibold uppercase tracking-wider shadow-kinara-gold hover:bg-kinara-gold-dark hover:shadow-kinara-gold-hover hover:-translate-y-0.5 active:translate-y-0 transition-all duration-250': {},
        },

        '.btn-kinara-outline': {
          '@apply bg-transparent border-2 border-kinara-brown-primary text-kinara-brown-primary px-6 py-3 rounded-lg font-semibold uppercase tracking-wider hover:bg-kinara-overlay-dark hover:border-kinara-brown-dark transition-all duration-250': {},
        },

        // Brand card
        '.card-kinara': {
          '@apply bg-kinara-white rounded-lg p-6 shadow-kinara-sm border border-kinara-beige-light hover:shadow-kinara-md hover:-translate-y-0.5 transition-all duration-250': {},
        },

        // Accent line
        '.accent-line-kinara': {
          '@apply h-1 bg-gradient-to-r from-kinara-gold to-kinara-peach rounded-full w-12 my-6': {},
        },

        // Navigation link with gold underline
        '.nav-kinara': {
          '@apply relative text-kinara-text-dark font-medium hover:text-kinara-brown-primary transition-colors duration-250 after:content-empty after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-kinara-gold after:transition-all after:duration-250 hover:after:w-full': {},
        },

        '.nav-kinara.active': {
          '@apply text-kinara-brown-primary after:w-full': {},
        },

        // Overlay effects
        '.overlay-kinara-dark': {
          '@apply bg-black/10': {},
        },

        '.overlay-kinara-medium': {
          '@apply bg-black/20': {},
        },

        '.overlay-kinara-gold': {
          '@apply bg-kinara-gold/10': {},
        },
      };

      addUtilities(utilities);
    },
  ],
};
