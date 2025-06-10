import { ViewStyle, TextStyle } from 'react-native';
import type { ThemeProps } from '../types';

// Tipos de estado de respuesta
export type ResponseStatus = 'pending' | 'correct' | 'incorrect';

interface FeedbackParams {
  theme: ThemeProps;
  status: ResponseStatus;
  /** La alternativa se seleccionó. Solo relevante cuando status es 'pending' o 'incorrect'. */
  isSelected?: boolean;
  /** Indica si la alternativa es la respuesta correcta. */
  isCorrectAnswer?: boolean;
}

/**
 * Devuelve el estilo de contenedor basado en el estado de la respuesta.
 * La lógica replica la utilizada en AlternativeButton para centralizarla.
 */
export const getButtonFeedbackStyle = ({
  theme,
  status,
  isSelected = false,
  isCorrectAnswer = false,
}: FeedbackParams): ViewStyle => {
  // Estado evaluado (no pendiente)
  if (status !== 'pending') {
    // Respuesta correcta → verde siempre
    if (isCorrectAnswer) {
      return {
        backgroundColor: theme.colors.feedback?.success.light || '#D1FAE5',
        borderColor: theme.colors.feedback?.success.main || '#10B981',
        borderWidth: theme.borders.width.normal,
      } as ViewStyle;
    }

    // Respuesta incorrecta seleccionada por el usuario → rojo
    if (isSelected && status === 'incorrect') {
      return {
        backgroundColor: theme.colors.feedback?.error.light || '#FEE2E2',
        borderColor: theme.colors.feedback?.error.main || '#EF4444',
        borderWidth: theme.borders.width.normal,
      } as ViewStyle;
    }

    // Resto de alternativas cuando el estado es incorrecto
    if (status === 'incorrect' && !isCorrectAnswer) {
      return {
        backgroundColor: theme.colors.neutral.gray100 || '#F4F4F4',
        borderColor: theme.colors.neutral.gray300 || '#C4C4C4',
        borderWidth: theme.borders.width.thin,
        opacity: 0.8,
      } as ViewStyle;
    }
  }

  // Estado pendiente
  if (!isSelected) {
    return {
      backgroundColor: theme.colors.state?.default || theme.colors.neutral.white,
      borderColor: theme.colors.ui?.button || theme.colors.primary.light,
    } as ViewStyle;
  }

  return {
    backgroundColor: theme.colors.state?.selected || theme.colors.primary.lighter || '#CDCFFF',
    borderColor: theme.colors.primary.main,
    borderWidth: theme.borders.width.normal,
  } as ViewStyle;
};

/**
 * Devuelve el estilo de borde especial que se aplica a la alternativa correcta
 * una vez evaluada la respuesta.
 */
export const getCorrectAnswerBorderStyle = (theme: ThemeProps): ViewStyle => ({
  borderWidth: theme.borders.width.medium,
  borderColor: theme.colors.feedback?.success.main || '#10B981',
});

/**
 * Devuelve el estilo de texto basado en el estado de la respuesta.
 * Replica la lógica original de AlternativeButton.
 */
export const getTextFeedbackStyle = ({
  theme,
  status,
  isSelected = false,
  isCorrectAnswer = false,
}: FeedbackParams): TextStyle => {
  if (status !== 'pending') {
    if (isCorrectAnswer) {
      return {
        color: theme.colors.feedback?.success.dark || '#0F766E',
      } as TextStyle;
    }
    if (isSelected && status === 'incorrect') {
      return {
        color: theme.colors.feedback?.error.dark || '#B91C1C',
      } as TextStyle;
    }
    if (status === 'incorrect') {
      return {
        color: theme.colors.neutral.gray500 || '#808080',
      } as TextStyle;
    }
  }

  if (!isSelected) {
    return {
      color: theme.colors.primary.dark,
    } as TextStyle;
  }

  return {
    color: theme.colors.primary.dark,
  } as TextStyle;
}; 