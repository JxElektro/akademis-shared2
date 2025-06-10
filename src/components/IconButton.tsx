import React from 'react';
import { ThemeProps } from '../types';
import { Pressable, Text, View, StyleSheet, TextStyle, ViewStyle, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';

/**
 * @AIFeature #button - Botón con icono integrado para acciones principales
 * @AIFeature #variants - Soporta múltiples variantes visuales (primary, secondary, outline)
 * @AIFeature #icon - Puede mostrar iconos de FontAwesome5 o imágenes personalizadas
 * @AIFeature #accessibility - Incluye soporte para accesibilidad y estados deshabilitados
 * @AIFeature #theming - Utiliza el sistema de temas para estilos consistentes
 * 
 * @check.jx ❌
 * Estado: Pendiente de verificación
 * Fecha: --/--/----
 * Aspectos por verificar:
 * - Visualización correcta de iconos e imágenes
 * - Comportamiento adecuado de las diferentes variantes
 * - Manejo correcto de posición del icono (izquierda/derecha)
 * - Implementación de estados deshabilitados
 * - Consistencia visual con el sistema de diseño
 */

interface IconButtonProps {
  title: string;
  icon?: string;
  imageSource?: ImageSourcePropType;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  iconColor?: string;
  circularIcon?: boolean;
  accessibilityLabel?: string;
  themeProps: ThemeProps;
}

const IconButton: React.FC<IconButtonProps> = ({
  title,
  icon,
  imageSource,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  testID,
  iconPosition = 'left',
  iconSize,
  iconColor,
  circularIcon = true,
  accessibilityLabel = title,
  themeProps
}) => {
  // Determinar la imagen del botón basado en el título
  const finalImageSource = React.useMemo(() => imageSource, [imageSource]);

  // Determinar si debemos mostrar un icono
  const shouldShowIcon = React.useMemo(() => {
    return finalImageSource || icon;
  }, [finalImageSource, icon]);

  // Obtener el tamaño del botón basado en la prop size
  const getButtonSize = (): ViewStyle => {
    const sizes = {
      small: {
        minWidth: 120,
        height: 50,
        paddingVertical: themeProps.spacing[2],
        paddingHorizontal: themeProps.spacing[3],
        borderRadius: 25,
      },
      medium: {
        minWidth: 160,
        height: 60,
        paddingVertical: themeProps.spacing[3],
        paddingHorizontal: themeProps.spacing[4],
        borderRadius: 30,
      },
      large: {
        minWidth: 200,
        height: 70,
        paddingVertical: themeProps.spacing[4],
        paddingHorizontal: themeProps.spacing[5],
        borderRadius: 35,
      }
    };

    return sizes[size] || sizes.medium;
  };

  // Obtener el estilo del botón basado en la variante
  const getButtonVariant = (): ViewStyle => {
    const baseStyles = {
      elevation: 4,
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: title === "Cancelar" ? '#FF9BAD' : themeProps.colors.neutral.gray200,
          borderWidth: 0,
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: themeProps.colors.primary.main,
        };
      case 'primary':
      default:
        return {
          ...baseStyles,
          backgroundColor: themeProps.colors.ui?.button || themeProps.colors.primary.light,
          borderWidth: 0,
        };
    }
  };

  // Obtener el estilo del texto basado en la variante
  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'secondary':
        return {
          color: title === "Cancelar" ? themeProps.colors.neutral.white : themeProps.colors.neutral.gray500,
          fontWeight: themeProps.typography.fontWeight.normal || '400',
        };
      case 'outline':
        return {
          color: themeProps.colors.primary.main,
          fontWeight: themeProps.typography.fontWeight.normal || '400',
        };
      case 'primary':
      default:
        return {
          color: themeProps.colors.neutral.white,
          fontWeight: themeProps.typography.fontWeight.semibold,
        };
    }
  };

  // Obtener el tamaño del texto basado en la prop size
  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return {
          fontSize: themeProps.typography.fontSize.base,
        };
      case 'large':
        return {
          fontSize: themeProps.typography.fontSize.xl,
        };
      case 'medium':
      default:
        return {
          fontSize: themeProps.typography.fontSize.lg,
        };
    }
  };

  // Calcular el tamaño del icono
  const calculateIconSize = (): number => {
    if (iconSize) return iconSize;
    
    const sizes = {
      small: 32,
      medium: 40,
      large: 48
    };
    
    return sizes[size] || sizes.medium;
  };

  // Calcular tamaño del contenedor del icono
  const calculateIconContainerSize = (): number => {
    const iconSizeValue = calculateIconSize();
    return iconSizeValue * 1.5;
  };

  // Determinar el color del icono
  const getIconColor = (): string => {
    if (iconColor) return iconColor;
    
    switch (variant) {
      case 'secondary':
        return themeProps.colors.neutral.gray500 || '#666666';
      case 'outline':
        return themeProps.colors.primary.main;
      case 'primary':
      default:
        return themeProps.colors.neutral.white;
    }
  };
  
  // Renderizar el contenido del botón
  const renderContent = () => {
    const finalIconSize = calculateIconSize();
    
    // Crear el elemento de icono
    let iconElement;
    
    if (finalImageSource) {
      // Renderizar imagen si se proporciona
      iconElement = (
        <Image
          source={finalImageSource}
          style={{
            width: 40,
            height: 40,
            marginHorizontal: 10
          }}
          resizeMode="contain"
        />
      );
    } else if (icon) {
      // Icono no disponible, usar texto alternativo
      iconElement = (
        <Text style={{ color: getIconColor(), fontSize: finalIconSize }}>
          {icon}
        </Text>
      );
    }
    
    // Si no hay icono, sólo mostrar el texto
    if (!shouldShowIcon) {
      return (
        <Text
          style={[
            getTextStyle(),
            getTextSize(),
            textStyle,
          ]}
        >
          {title}
        </Text>
      );
    }
    
    // Si hay icono y está a la izquierda
    if (iconPosition === 'left') {
      return (
        <View style={styles.row}>
          {iconElement}
          <Text
            style={[
              getTextStyle(),
              getTextSize(),
              textStyle,
              { marginLeft: 8 },
            ]}
          >
            {title}
          </Text>
        </View>
      );
    }
    
    // Si hay icono y está a la derecha
    return (
      <View style={styles.row}>
        <Text
          style={[
            getTextStyle(),
            getTextSize(),
            textStyle,
            { marginRight: 8 },
          ]}
        >
          {title}
        </Text>
        {iconElement}
      </View>
    );
  };

  // Crear estilos basados en el tema
  const styles = React.useMemo(() => StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: themeProps.shadows?.md?.elevation || 4,
      boxShadow: themeProps.shadows?.md?.boxShadow || '0px 3px 4px rgba(0, 0, 0, 0.3)',
      margin: themeProps.spacing[2],
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      paddingHorizontal: themeProps.spacing[2],
    },
    iconCircle: {
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: themeProps.spacing[2],
    },
    textContainer: {
      flex: 1,
      paddingHorizontal: themeProps.spacing[2],
      alignItems: 'flex-start',
    },
    text: {
      textAlign: 'left',
    },
    disabled: {
      opacity: themeProps.animations?.opacity?.disabled || 0.5,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  }), [themeProps]);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonSize(),
        getButtonVariant(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default IconButton; 