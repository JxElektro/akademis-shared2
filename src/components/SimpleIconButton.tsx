import React from 'react';
import { StyleProp, ViewStyle, Pressable, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { ThemeProps } from '../types';

interface SimpleIconButtonProps {
  imageSource: ImageSourcePropType;
  active: boolean;
  size: 'extraSmall' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  themeProps: ThemeProps;
  testID?: string;
}

export const SimpleIconButton: React.FC<SimpleIconButtonProps> = ({ 
  imageSource,
  active, 
  size, 
  onPress,
  themeProps,
  testID,
}) => {
  // Crear estilos basados en el tema
  const styles = React.useMemo(() => StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    extraSmall: {
      height: 24,
      width: 24,
    },
    small: {
      height: themeProps.sizes?.squareButton?.small?.height || 32,
      width: themeProps.sizes?.squareButton?.small?.height || 32,
    },
    medium: {
      height: themeProps.sizes?.squareButton?.medium?.height || 48,
      width: themeProps.sizes?.squareButton?.medium?.height || 48,
    },
    large: {
      height: themeProps.sizes?.squareButton?.large?.height || 64,
      width: themeProps.sizes?.squareButton?.large?.height || 64,
    },
  }), [themeProps]);

  let styleSize: object;
  switch (size) {
    case 'extraSmall':
      styleSize = styles.extraSmall;
      break;
    case 'small':
      styleSize = styles.small;
      break;
    case 'medium':
      styleSize = styles.medium;
      break;
    case 'large':
      styleSize = styles.large;
      break;
    default:
      styleSize = styles.medium;
  }

  return (
    <Pressable 
      onPress={onPress} 
      disabled={!active} 
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? themeProps.animations?.opacity?.pressed || 0.7 : 1 }
      ]}
      testID={testID}
    >
      <Image style={styleSize} source={imageSource} resizeMode="contain" />
    </Pressable>
  );
};
