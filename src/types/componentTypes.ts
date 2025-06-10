import { Ionicons } from '@expo/vector-icons';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ThemeProps } from '.';

/**
 * Interfaces y tipos compartidos entre los componentes.
 * Mantener todos los tipos aquí permite reducir el tamaño de los archivos de cada componente
 * y facilita su reutilización a lo largo del proyecto.
 */

/* =========================================================================
 * CustomButton
 * ========================================================================= */
export interface CustomButtonProps {
  label: string;
  onPress: () => void;
  icon?: {
    name: keyof typeof Ionicons.glyphMap;
    size?: number;
    color?: string;
    position?: 'left' | 'right';
  };
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  disabled?: boolean;
  themeProps: ThemeProps;
  testID?: string;
}

/* =========================================================================
 * AlternativeButton
 * ========================================================================= */
export interface AlternativeButtonProps {
  onPress: () => void;
  text: string;
  isSelected: boolean;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  accessibilityLabel?: string;
  isCorrectAnswer?: boolean;
  themeProps: ThemeProps;
}

/* =========================================================================
 * Card
 * ========================================================================= */
export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  themeProps: ThemeProps;
}

export interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  themeProps: ThemeProps;
}

/* =========================================================================
 * SquareButton
 * ========================================================================= */
export type ButtonSize =
  | 'extraSmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'keyboardSmall'
  | 'keyboardMedium'
  | 'alternative';

export type ButtonState =
  | 'border'
  | 'incomplete'
  | 'empty'
  | 'selected'
  | 'unselected'
  | 'subtraction'
  | 'default';

export type ButtonColor = 'normal' | 'rose' | 'yellow' | 'blue' | 'green';

export type ButtonStatus = 'incorrect' | 'correct' | undefined;

export interface SquareButtonProps {
  text?: string;
  onPress?: () => void;
  size: ButtonSize;
  state?: ButtonState;
  color?: ButtonColor;
  status?: ButtonStatus;
  max?: number;
  textColor?: string;
  accessibilityLabel?: string;
  containerStyle?: ViewStyle;
  testID?: string;
  disabled?: boolean;
  isFocused?: boolean;
  focusedStyle?: ViewStyle;
  onFocus?: () => void;
  onBlur?: () => void;
  themeProps: ThemeProps;
}

/* =========================================================================
 * ModalFullImage
 * ========================================================================= */
export interface ModalFullImageProps {
  /** Controla la visibilidad del modal */
  isVisible: boolean;
  /** Función de cierre */
  onClose: () => void;
  /** URL de la imagen a mostrar a tamaño completo */
  imageUrl: string;
  /** Props de tema */
  themeProps: ThemeProps;
  /** Ancho opcional de referencia para el modal */
  width?: number;
  /** Alto opcional de referencia para el modal */
  height?: number;
}

/* =========================================================================
 * ModalText
 * ========================================================================= */
export interface ModalTextImage {
  id: string;
  url: string;
  quantity: number;
}

export interface ModalTextProps {
  /** Controla la visibilidad del modal */
  isVisible: boolean;
  /** Función de cierre */
  onClose: () => void;
  /** Título del modal */
  title: string;
  /** Cuerpo de texto */
  body: string;
  /** Arreglo de imágenes a mostrar */
  images: ModalTextImage[];
  /** Props del tema */
  themeProps: ThemeProps;
  /** Ancho opcional para cálculo de dimensiones */
  width?: number;
  /** Alto opcional para cálculo de dimensiones */
  height?: number;
} 