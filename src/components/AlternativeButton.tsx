// components/AlternativeButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { AlternativeButtonProps } from '../types/componentTypes';
import type { ThemeProps } from '../types/uiTypes';
import {
  getButtonFeedbackStyle,
  getTextFeedbackStyle,
  ResponseStatus,
  getCorrectAnswerBorderStyle,
} from '../utils/feedbackStyles';

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

  const getButtonStyle = () =>
    getButtonFeedbackStyle({
      theme: themeProps,
      status: userResponseStatus as ResponseStatus,
      isSelected,
      isCorrectAnswer,
    });

  const getTextStyle = () =>
    getTextFeedbackStyle({
      theme: themeProps,
      status: userResponseStatus as ResponseStatus,
      isSelected,
      isCorrectAnswer,
    });

  return (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      getButtonStyle(),
      userResponseStatus !== 'pending' && isCorrectAnswer && getCorrectAnswerBorderStyle(themeProps),
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

type StylesType = {
  button: ViewStyle;
  text: TextStyle;
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
      borderColor: theme.colors.primary.main,
      borderRadius: theme.borders.radius.md,
      backgroundColor: theme.colors.neutral.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: theme.typography.fontSize.lg,
      textAlign: 'center',
      fontWeight: theme.typography.fontWeight.bold as any,
      flexWrap: 'wrap',
      fontFamily: theme.typography.fontFamily,
    },
  });
};

export default AlternativeButton;
