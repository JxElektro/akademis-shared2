import { ViewStyle, TextStyle } from 'react-native';

// Tipos transversales que NO dependen de los reactivos
// (paleta de colores, información de dispositivo, media genérica)

export interface ThemeProps {
  colors: {
    primary: {
      main: string;      // Texto/borde no seleccionado
      light: string;      // Fondo seleccionado
      lighter?: string;   // Fondo no seleccionado
      dark: string;
      lightest?: string;  // Texto/borde seleccionado
    };
    neutral: {
      white: string;
      gray100?: string;
      gray200?: string;
      gray300?: string;
      gray400?: string;
      gray500?: string;
    };
    feedback: {
      success: {
        main: string;
        light: string;
        dark: string;
      };
      error: {
        main: string;
        light: string;
        dark: string;
      };
      warning?: {
        main: string;
        light: string;
        dark: string;
      };
      info?: {
        main: string;
        light: string;
        dark: string;
      };
    };
    ui?: {
      button: string;
    };
    state?: {
      default: string;
      selected?: string;
      focused?: string;
      disabled?: string;
      correct?: string;
      incorrect?: string;
      pending?: string;
    };
  };
  typography: {
    fontSize: {
      base: number;
      lg: number;
      xl: number;
      sm?: number;
      md?: number;
    };
    fontWeight: {
      semibold: "600" | 600;
      bold: "700" | 700;
      normal?: "400" | 400;
    };
    fontFamily: string;
  };
  spacing: number[];
  borders: {
    radius: {
      lg: number;
      md: number;
      sm?: number;
    };
    width: {
      normal: number;
      thin?: number;
      medium?: number;
      thick?: number;
    };
  };
  shadows: {
    md: any; // simplificado
  };
  animations: {
    opacity: {
      pressed: number;
      disabled?: number;
      normal?: number;
    };
    scale?: {
      pressed?: number;
      normal?: number;
    };
  };
  sizes?: {
    squareButton?: {
      small: { height: number };
      medium: { height: number };
      large: { height: number };
    };
  };
  // Colores corporativos de Akademi
  AkademiColors?: {
    azulPrincipal: string;
    verdeAkademi: string;
    amarilloAkademi: string;
    azulClaro: string;
    rojoAkademi: string;
    turquesa: string;
  };
}

export interface DeviceInfo {
  device: 'phone' | 'tablet' | 'desktop';
}

export interface ResponseMedia {
  id: string;
  quantity: number;
} 