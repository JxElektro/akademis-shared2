import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomButtonProps } from '../types/componentTypes';
import type { ThemeProps } from '../types';

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onPress,
  icon,
  style,
  textStyle,
  themeProps,
  backgroundColor,
  borderColor,
  textColor,
  disabled = false,
  testID,
}) => {
  // Crear estilos basados en el tema
  const styles = React.useMemo(() => StyleSheet.create(createStyles(themeProps)), [themeProps]);

  // Obtener colores del tema o usar los proporcionados como props
  const buttonBackgroundColor = backgroundColor || themeProps.colors.primary.main;
  const buttonTextColor = textColor || themeProps.colors.neutral.white;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? themeProps.colors.neutral.gray300 : buttonBackgroundColor,
          borderColor: borderColor ?? buttonBackgroundColor,
          opacity: pressed ? themeProps.animations.opacity.pressed : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
      accessibilityLabel={label}
      testID={testID}
    >
      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.buttonText,
            { color: disabled ? themeProps.colors.neutral.gray500 : buttonTextColor },
            textStyle,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
        {icon && (
          <View style={styles.iconRight}>
            <Ionicons
              name={icon.name}
              size={icon.size ?? 24}
              color={icon.color ?? buttonTextColor}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};

// Función para crear estilos basados en el tema
const createStyles = (theme: ThemeProps) => {
  return StyleSheet.create({
    button: {
      minHeight: theme.sizes?.squareButton?.medium?.height || 48,
      paddingHorizontal: theme.spacing[6],
      paddingVertical: theme.spacing[3],
      borderRadius: theme.borders.radius.md,
      borderWidth: theme.borders.width.medium,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      overflow: 'hidden',
      width: '100%',
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingHorizontal: theme.spacing[2],
    },
    buttonText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
      textAlign: 'center',
      flex: 1,
    },
    iconRight: {
      marginLeft: theme.spacing[4],
      paddingRight: theme.spacing[2],
    },
  });
};

export default CustomButton;