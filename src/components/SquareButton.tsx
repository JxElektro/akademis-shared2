// src/shared-components/ui/SquareButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import type { ThemeProps } from '../types/uiTypes';
import {
  ButtonSize,
  ButtonState,
  ButtonColor,
  ButtonStatus,
  SquareButtonProps,
} from '../types/componentTypes';
import {
  getButtonFeedbackStyle,
  getTextFeedbackStyle,
  ResponseStatus,
} from '../utils/feedbackStyles';

// Reexportar los tipos para mantener compatibilidad externa
export type {
  ButtonSize,
  ButtonState,
  ButtonColor,
  ButtonStatus,
};

/**
 * Componente de botón cuadrado personalizable con diferentes tamaños, estados y colores.
 * Usa el sistema de tema para mantener consistencia visual.
 */
export const SquareButton: React.FC<SquareButtonProps> = ({
  text = '',
  onPress,
  size,
  state = 'default',
  color = 'normal',
  status,
  max = 6,
  textColor,
  accessibilityLabel,
  containerStyle = {},
  testID,
  disabled = false,
  isFocused = false,
  focusedStyle,
  onFocus,
  onBlur,
  themeProps,
}) => {
  const [isAccessibilityFocused, setIsAccessibilityFocused] = React.useState(false);

  // Crear estilos basados en el tema
  const styles = React.useMemo(() => createStyles(themeProps), [themeProps]);

  // Manejo de foco para accesibilidad
  const handleAccessibilityFocus = () => {
    setIsAccessibilityFocused(true);
    onFocus?.();
  };

  const handleAccessibilityBlur = () => {
    setIsAccessibilityFocused(false);
    onBlur?.();
  };

  // Validación de props
  if (text.length > max) {
    console.warn(`El texto excede el máximo de ${max} caracteres permitidos`);
  }

  // Mapear las propiedades al sistema de temas
  let containerSize: ViewStyle;
  let textSize: TextStyle;
  let containerType: ViewStyle;
  let textColorStyle: TextStyle;

  // Definir el color del texto basado en la prop `color`
  const getTextColor = (colorType: ButtonColor): string => {
    const defaultColor = themeProps.colors.primary.main;
    const colors = themeProps.colors as any;

    switch (colorType) {
      case 'normal':
        return defaultColor;
      case 'rose':
        return colors.chart?.pink || defaultColor;
      case 'yellow':
        return colors.chart?.yellow || defaultColor;
      case 'blue':
        return themeProps.colors.primary.light;
      case 'green':
        return colors.chart?.green || defaultColor;
      default:
        return defaultColor;
    }
  };

  textColorStyle = { color: textColor || getTextColor(color as ButtonColor) };

  const getButtonSize = (buttonSize: ButtonSize): ViewStyle => {
    const defaultSize = {
      width: 60,
      height: 60,
    };

    const defaultSizes = {
      extraSmall: { width: 40, height: 40 },
      small: { width: 50, height: 50 },
      medium: { width: 60, height: 60 },
      large: { width: 70, height: 70 },
      keyboardSmall: { width: 45, height: 45 },
      keyboardMedium: { width: 65, height: 65 },
      alternative: { width: '100%', height: 60 },
    } as const;

    const buttonSizes = themeProps.sizes?.squareButton || defaultSizes;

    const size = (buttonSizes as typeof defaultSizes)[buttonSize] || defaultSizes[buttonSize] || defaultSize;
    return {
      width: size.width,
      height: size.height,
    };
  };

  const getFontSize = (buttonSize: ButtonSize): TextStyle => {
    const defaultFontSizes = {
      extraSmall: 12,
      small: 14,
      medium: 16,
      large: 20,
      keyboardSmall: 14,
      keyboardMedium: 18,
      alternative: 16,
    };

    const fontSize = 
      buttonSize === 'extraSmall' ? (defaultFontSizes.extraSmall) :
      buttonSize === 'small' ? (themeProps.typography.fontSize.sm || defaultFontSizes.small) :
      buttonSize === 'medium' ? (themeProps.typography.fontSize.base || defaultFontSizes.medium) :
      buttonSize === 'large' ? (themeProps.typography.fontSize.lg || defaultFontSizes.large) :
      buttonSize === 'keyboardSmall' ? (themeProps.typography.fontSize.sm || defaultFontSizes.keyboardSmall) :
      buttonSize === 'keyboardMedium' ? (themeProps.typography.fontSize.md || defaultFontSizes.keyboardMedium) :
      themeProps.typography.fontSize.base || defaultFontSizes.medium;

    return { fontSize };
  };

  containerSize = getButtonSize(size);
  textSize = getFontSize(size);

  // Definir el tipo de contenedor basado en la prop `state`
  const getContainerType = (buttonState: ButtonState): ViewStyle => {
    switch (buttonState) {
      case 'border':
        return {
          backgroundColor: 'transparent',
          borderWidth: themeProps.borders.width.normal,
          borderColor: themeProps.colors.primary.main,
        };
      case 'incomplete':
        return {
          backgroundColor: themeProps.colors.primary.lightest || themeProps.colors.neutral.white,
          borderWidth: themeProps.borders.width.normal,
          borderStyle: 'dashed',
          borderColor: themeProps.colors.primary.light,
        };
      case 'empty':
        return {
          backgroundColor: 'transparent',
          borderWidth: themeProps.borders.width.thin,
          borderStyle: 'dashed',
          borderColor: themeProps.colors.primary.light,
        };
      case 'selected':
        return {
          backgroundColor: themeProps.colors.primary.light,
          borderWidth: themeProps.borders.width.normal,
          borderColor: themeProps.colors.primary.lightest,
        };
      case 'unselected':
        return {
          backgroundColor: themeProps.colors.neutral.white,
          borderWidth: themeProps.borders.width.thin,
          borderColor: themeProps.colors.neutral.white,
        };
      case 'subtraction':
        return {
          backgroundColor: themeProps.colors.primary.light,
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: themeProps.colors.state?.default || themeProps.colors.neutral.white,
          borderWidth: themeProps.borders.width.thin,
          borderColor: themeProps.colors.neutral.gray300 || themeProps.colors.neutral.white,
        };
    }
  };

  containerType = getContainerType(state as ButtonState);

  // Estilos de feedback centralizados
  const feedbackContainerStyle = React.useMemo(
    () =>
      getButtonFeedbackStyle({
        theme: themeProps,
        status: (status ?? 'pending') as ResponseStatus,
        isSelected: true,
        isCorrectAnswer: status === 'correct',
      }),
    [themeProps, status]
  );

  const feedbackTextStyle = React.useMemo(
    () =>
      getTextFeedbackStyle({
        theme: themeProps,
        status: (status ?? 'pending') as ResponseStatus,
        isSelected: true,
        isCorrectAnswer: status === 'correct',
      }),
    [themeProps, status]
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        containerSize,
        containerType,
        feedbackContainerStyle,
        containerStyle,
        disabled && styles.disabled,
        (isFocused || isAccessibilityFocused) && [styles.focused, focusedStyle],
      ]}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      activeOpacity={themeProps.animations.opacity.pressed}
      disabled={disabled}
      onFocus={handleAccessibilityFocus}
      onBlur={handleAccessibilityBlur}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: isFocused }}
    >
      {text === 'TACHAR' ? (
        <Text style={[styles.cross, textColorStyle]}>{'X'}</Text>
      ) : (
        <Text
          style={[styles.text, textSize, textColorStyle, feedbackTextStyle]}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.5}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Función para crear estilos basados en el tema
const createStyles = (theme: ThemeProps) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borders.radius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.neutral.white,
  },
  text: {
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.bold,
  },
  cross: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
  disabled: {
    opacity: theme.animations.opacity.disabled,
  },
  focused: {
    borderWidth: theme.borders.width.medium,
    borderColor: theme.colors.state?.focused || theme.colors.primary.light,
  },
});

export default SquareButton;