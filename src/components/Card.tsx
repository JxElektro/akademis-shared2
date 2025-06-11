// src/components/ui/Card.tsx   
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import type { ThemeProps } from '../types/uiTypes';
import { CardProps, CardContentProps } from '../types/componentTypes';
import {
  getButtonFeedbackStyle,
  ResponseStatus,
} from '../utils/feedbackStyles';

export const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  themeProps,
  status = 'pending',
}) => {
  // Crear estilos basados en el tema
  const styles = React.useMemo(() => createStyles(themeProps), [themeProps]);

  // Estilo de feedback (utilizamos el estilo de contenedor)
  const feedbackStyle = React.useMemo(
    () =>
      getButtonFeedbackStyle({
        theme: themeProps,
        status: status as ResponseStatus,
        isSelected: true,
        isCorrectAnswer: status === 'correct',
      }),
    [themeProps, status]
  );

  return (
    <View style={[styles.card, feedbackStyle, style]}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </View>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  style,
  themeProps
}) => {
  // Crear estilos basados en el tema
  const styles = React.useMemo(() => createStyles(themeProps), [themeProps]);

  return (
    <View style={[styles.cardContent, style]}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </View>
  );
};

// Función para crear estilos basados en el tema
const createStyles = (theme: ThemeProps) => {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.neutral.white,
      borderRadius: theme.borders.radius.md,
      borderWidth: theme.borders.width.thin,
      borderColor: theme.colors.neutral.gray200,
      marginBottom: theme.spacing[4],
      // Sombra y elevación eliminadas
    },
    cardContent: {
      padding: theme.spacing[4],
    },
  });
};
