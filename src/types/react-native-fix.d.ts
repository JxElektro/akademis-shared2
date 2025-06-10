// src/types/react-native-fix.d.ts
// Arreglo temporal para compatibilidad con React Native 0.79+

declare module 'react-native' {
  import * as React from 'react';

  // Interfaces de estilos
  export interface ViewStyle {
    [key: string]: any;
  }

  export interface TextStyle {
    [key: string]: any;
  }

  export interface ImageStyle {
    [key: string]: any;
  }

  // Tipos de estilo
  export type StyleProp<T> = T | T[] | null | undefined;

  // Tipos de imagen
  export type ImageSourcePropType = any;
  export type ImageURISource = {
    uri: string;
    [key: string]: any;
  };

  // Props de componentes
  export interface ViewProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface TextProps {
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface ImageProps {
    source: any;
    style?: StyleProp<ImageStyle>;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
    [key: string]: any;
  }

  export interface ScrollViewProps {
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    horizontal?: boolean;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface TouchableOpacityProps {
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    activeOpacity?: number;
    disabled?: boolean;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface PressableProps {
    style?: StyleProp<ViewStyle> | ((state: any) => StyleProp<ViewStyle>);
    onPress?: (event?: any) => void;
    disabled?: boolean;
    children?: React.ReactNode | ((state: any) => React.ReactNode);
    [key: string]: any;
  }

  export interface ActivityIndicatorProps {
    size?: 'small' | 'large' | number;
    color?: string;
    animating?: boolean;
    style?: StyleProp<ViewStyle>;
    [key: string]: any;
  }

  export interface ModalProps {
    visible?: boolean;
    animationType?: 'none' | 'slide' | 'fade';
    transparent?: boolean;
    onRequestClose?: () => void;
    children?: React.ReactNode;
    [key: string]: any;
  }

  // Componentes como React.FC
  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;
  export const Image: React.FC<ImageProps>;
  export const ScrollView: React.FC<ScrollViewProps>;
  export const TouchableOpacity: React.FC<TouchableOpacityProps>;
  export const Pressable: React.FC<PressableProps>;
  export const ActivityIndicator: React.FC<ActivityIndicatorProps>;
  export const Modal: React.FC<ModalProps>;

  // StyleSheet
  export const StyleSheet: {
    create<T>(styles: T): T;
    [key: string]: any;
  };

  // Hooks y utilidades
  export const useWindowDimensions: () => {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
  };

  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    select: <T>(options: { ios?: T; android?: T; web?: T; default?: T }) => T;
    [key: string]: any;
  };
}

// Declaración para @expo/vector-icons
declare module '@expo/vector-icons' {
  import * as React from 'react';

  export interface IconProps {
    name: string | number | symbol;
    size?: number;
    color?: string;
    style?: any;
    [key: string]: any;
  }

  export interface IconComponent extends React.FC<IconProps> {
    glyphMap: Record<string, any>;
  }

  export const Ionicons: IconComponent;
  export const MaterialIcons: IconComponent;
  export const FontAwesome: IconComponent;
  export const Feather: IconComponent;
  export const AntDesign: IconComponent;
} 