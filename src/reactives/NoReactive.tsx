import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import type { ThemeProps } from '../types/uiTypes';
import { defaultThemeProps } from '../theme/defaultProps';

interface NoReactiveProps {
  themeProps?: ThemeProps;
}

export const NoReactive: React.FC<NoReactiveProps> = ({ themeProps }) => {
  const appliedTheme = themeProps || defaultThemeProps;
  const styles = React.useMemo(() => createStyles(appliedTheme), [appliedTheme]);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <FontAwesome name="exclamation-circle" size={24} color={appliedTheme.colors.feedback.error.main} />
        <Text style={styles.title}>No hay reactivo seleccionado</Text>
        <Text style={styles.message}>
          Aún no has creado una pregunta. Completa la información requerida en el formulario para construir tu pregunta y visualizarla aquí.
        </Text>
      </View>
    </View>
  );
};

// Función para crear estilos basados en el tema
const createStyles = (theme: ThemeProps) => StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.neutral.gray100 || '#F3F4F6',
    padding: theme.spacing[7] || 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: theme.colors.neutral.white,
    padding: theme.spacing[8] || 32,
    borderRadius: theme.borders.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing[5] || 20,
  },
  title: {
    fontSize: theme.typography.fontSize.xl || 24,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.primary.dark,
    textAlign: 'center',
    marginBottom: theme.spacing[4] || 15,
  },
  message: {
    fontSize: theme.typography.fontSize.lg || 18,
    color: theme.colors.neutral.gray500 || '#4B5563',
    textAlign: 'center',
    lineHeight: (theme.typography.fontSize.lg || 18) * 1.3,
    paddingHorizontal: theme.spacing[3] || 12,
  },
});
