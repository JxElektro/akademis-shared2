// components/AlternativeButton.tsx
import React from 'react';
import { Pressable, Text, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { AlternativeButtonProps } from '../types/componentTypes';
import type { ThemeProps } from '../types';

const AlternativeButton: React.FC<AlternativeButtonProps> = ({
  onPress,
  text,
  isSelected,
  userResponseStatus,
  accessibilityLabel,
  isCorrectAnswer = false,
  themeProps,
}) => {
  // Crear estilos
  const styles = React.useMemo(() => createStyles(themeProps), [themeProps]);

  const getButtonStyle = (): ViewStyle => {
    // Si la respuesta fue evaluada (no está en estado pendiente)
    if (userResponseStatus !== 'pending') {
      // Si es una respuesta correcta, siempre la mostramos verde
      if (isCorrectAnswer) {
        return styles.correctButton;
      }
      
      // Si es una respuesta incorrecta y el usuario la seleccionó, la mostramos en rojo
      if (isSelected && userResponseStatus === 'incorrect') {
        return styles.incorrectButton;
      }
      
      // Si el estado es incorrecto, pero esta alternativa no se seleccionó ni es correcta,
      // mostramos una indicación visual más sutil
      if (userResponseStatus === 'incorrect' && !isCorrectAnswer) {
        return styles.invalidButton;
      }
    }

    // Para estado pendiente
    if (!isSelected) {
      return styles.defaultButton;
    }

    return styles.pendingButton;
  };

  const getTextStyle = (): TextStyle => {
    // Si la respuesta fue evaluada (no está en estado pendiente)
    if (userResponseStatus !== 'pending') {
      // Si es una respuesta correcta, siempre usamos el estilo de texto correcto
      if (isCorrectAnswer) {
        return styles.correctText;
      }
      
      // Si es una respuesta incorrecta que el usuario seleccionó
      if (isSelected && userResponseStatus === 'incorrect') {
        return styles.incorrectText;
      }
      
      // Para las demás alternativas cuando el estado es incorrecto
      if (userResponseStatus === 'incorrect') {
        return styles.invalidText;
      }
    }

    // Para estado pendiente
    if (!isSelected) {
      return styles.defaultText;
    }

    return styles.pendingText;
  };

  return (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      getButtonStyle(),
      userResponseStatus !== 'pending' && isCorrectAnswer && styles.correctButtonBorder,
      pressed && { opacity: themeProps.animations.opacity.pressed }
    ]}
    accessibilityLabel={accessibilityLabel}
  >
    <Text style={[styles.text, getTextStyle()]}>
      {text}
    </Text>
  </Pressable>
  );
};

// Definir un tipo para los estilos
type StylesType = {
  button: ViewStyle;
  defaultButton: ViewStyle;
  correctButton: ViewStyle;
  incorrectButton: ViewStyle;
  invalidButton: ViewStyle;
  pendingButton: ViewStyle;
  correctButtonBorder: ViewStyle;
  text: TextStyle;
  defaultText: TextStyle;
  correctText: TextStyle;
  incorrectText: TextStyle;
  invalidText: TextStyle;
  pendingText: TextStyle;
};

// Función para crear estilos basados en el tema
const createStyles = (theme: ThemeProps): StylesType => {
  return StyleSheet.create({
    button: {
      width: '95%',
      minHeight: theme.sizes?.squareButton?.medium.height,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[6],
      marginVertical: theme.spacing[1],
      borderWidth: theme.borders.width.thin,
      borderColor: theme.colors.ui?.button || theme.colors.primary.light,
      borderRadius: theme.borders.radius.md,
      backgroundColor: theme.colors.neutral.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    defaultButton: {
      backgroundColor: theme.colors.state?.default || theme.colors.neutral.white,
      borderColor: theme.colors.ui?.button || theme.colors.primary.light,
    },
    correctButton: {
      backgroundColor: theme.colors.feedback?.success.light || '#D1FAE5',
      borderColor: theme.colors.feedback?.success.main || '#10B981',
      borderWidth: theme.borders.width.normal,
    },
    incorrectButton: {
      backgroundColor: theme.colors.feedback?.error.light || '#FEE2E2',
      borderColor: theme.colors.feedback?.error.main || '#EF4444',
      borderWidth: theme.borders.width.normal,
    },
    invalidButton: {
      backgroundColor: theme.colors.neutral.gray100 || '#F4F4F4',
      borderColor: theme.colors.neutral.gray300 || '#C4C4C4',
      borderWidth: theme.borders.width.thin,
      opacity: 0.8,
    },
    pendingButton: {
      backgroundColor: theme.colors.state?.selected || theme.colors.primary.lighter || '#CDCFFF',
      borderColor: theme.colors.primary.main,
      borderWidth: theme.borders.width.normal,
    },
    correctButtonBorder: {
      borderWidth: theme.borders.width.medium,
      borderColor: theme.colors.feedback?.success.main || '#10B981',
    },
    text: {
      fontSize: theme.typography.fontSize.lg,
      textAlign: 'center',
      fontWeight: theme.typography.fontWeight.bold as any,
      flexWrap: 'wrap',
      fontFamily: theme.typography.fontFamily,
    },
    defaultText: {
      color: theme.colors.primary.dark,
    },
    correctText: {
      color: theme.colors.feedback?.success.dark || '#0F766E',
    },
    incorrectText: {
      color: theme.colors.feedback?.error.dark || '#B91C1C',
    },
    invalidText: {
      color: theme.colors.neutral.gray500 || '#808080',
    },
    pendingText: {
      color: theme.colors.primary.dark,
    },
  });
};

export default AlternativeButton;
