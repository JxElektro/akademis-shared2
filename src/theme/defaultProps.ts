import { ThemeProps } from '../types/uiTypes';

export const defaultThemeProps: ThemeProps = {
  colors: {
    primary: {
      main: '#2A2870',// Text No Selected / Border No Selected
      light: '#8287FF', // Background Selected
      dark: '#1B1A4F', // no se usa 
      lighter: '#CDCFFF', // Background No Selected 
      lightest: '#F4F4FE', // Text Selected / Border Selected
    },
    neutral: {
      white: '#FFFFFF',
      gray100: '#F3F4F6',
      gray200: '#E5E7EB',
      gray300: '#D1D5DB',
      gray400: '#9CA3AF',
      gray500: '#6B7280',
    },
    feedback: {
      success: {
        main: '#10B981',
        light: '#D1FAE5',
        dark: '#065F46',
      },
      error: {
        main: '#EF4444',
        light: '#FEE2E2',
        dark: '#B91C1C',
      },
    },
    ui: {
      button: '#2A2870',
    },
    state: {
      default: '#FFFFFF',
      selected: '#CDCFFF',
      focused: '#A5B4FC',
      disabled: '#D1D5DB',
    },
  },
  typography: {
    fontSize: {
      base: 16,
      lg: 18,
      xl: 24,
      sm: 14,
      md: 16,
    },
    fontWeight: {
      semibold: '600',
      bold: '700',
      normal: '400',
    },
    fontFamily: 'System',
  },
  spacing: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36],
  borders: {
    radius: {
      lg: 20,
      md: 12,
      sm: 6,
    },
    width: {
      thin: 1,
      normal: 2,
      medium: 3,
    },
  },
  shadows: {
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
  animations: {
    opacity: {
      pressed: 0.7,
      disabled: 0.4,
    },
  },
  sizes: {
    squareButton: {
      small: { height: 40 },
      medium: { height: 48 },
      large: { height: 60 },
    },
  },
}; 