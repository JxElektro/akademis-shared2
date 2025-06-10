// src/components/ui/AlternativesTarget.tsx

import React from 'react';
import { ThemeProps } from '../types';
import { Pressable, Text, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface AlternativesTargetProps {
  alternative: string;
  isSelected: boolean;
  onSelect: () => void;
  status: 'pending' | 'correct' | 'incorrect';
  oneResponse: boolean;
  children?: React.ReactNode;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  themeProps: ThemeProps;
}

export const AlternativesTarget: React.FC<AlternativesTargetProps> = ({
  alternative,
  isSelected,
  onSelect,
  status,
  oneResponse,
  children,
  containerStyle,
  textStyle,
  themeProps,
}) => {
  // Crear estilos basados en el tema
  const styles = React.useMemo(() => createStyles(themeProps), [themeProps]);

  const handlePress = () => {
    onSelect();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.container,
        isSelected && styles.selected,
        status === 'correct' && styles.correct,
        status === 'incorrect' && styles.incorrect,
        containerStyle,
      ]}
      disabled={status !== 'pending'}
      accessibilityLabel={`Alternativa ${alternative}`}
      accessibilityRole="button"
    >
      <Text style={[styles.alternativeText, textStyle]}>{alternative}</Text>
      {children}
    </Pressable>
  );
};

// Función para crear estilos basados en el tema
const createStyles = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      borderWidth: theme.borders.width.thin,
      borderColor: theme.colors.primary.dark,
      borderRadius: theme.borders.radius.md,
      padding: theme.spacing[3],
      margin: theme.spacing[1],
      minWidth: 100,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.neutral.white,
    },
    selected: {
      backgroundColor: theme.colors.state?.selected || theme.colors.primary.lighter,
    },
    correct: {
      backgroundColor: theme.colors.feedback?.success.light || '#D1FAE5',
      borderColor: theme.colors.feedback?.success.main || '#10B981',
      borderWidth: theme.borders.width.normal,
    },
    incorrect: {
      backgroundColor: theme.colors.feedback?.error.light || '#FEE2E2',
      borderColor: theme.colors.feedback?.error.main || '#EF4444',
      borderWidth: theme.borders.width.normal,
    },
    alternativeText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.primary.dark,
      textAlign: 'center',
      fontFamily: theme.typography.fontFamily,
    },
  });
};
