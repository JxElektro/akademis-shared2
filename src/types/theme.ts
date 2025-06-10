export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    error: string;
    success: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontSize: {
      small: number;
      medium: number;
      large: number;
    };
    fontWeight: {
      regular: string;
      bold: string;
    };
  };
}

export type ThemeProviderProps = {
  theme?: Theme;
  children: React.ReactNode;
}; 