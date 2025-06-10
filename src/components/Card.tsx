// src/components/ui/Card.tsx   
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import type { ThemeProps } from '../types';
import { CardProps, CardContentProps } from '../types/componentTypes';

export const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  themeProps
}) => {
  // Crear estilos basados en el tema
  const styles = React.useMemo(() => createStyles(themeProps), [themeProps]);

  return (
    <View style={[styles.card, style]}>
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
