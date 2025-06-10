// src/reactives/reactivesFiles/Reactive1.tsx

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle , TextStyle , ImageStyle} from 'react-native'; 
import AlternativeButton from '../components/AlternativeButton';


import { Reactive1Styles, Reactive1Props } from '../types/reactiveTypes';
import { ReactiveSchema, DeviceInfo } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';

export const Reactive1: React.FC<Reactive1Props> = ({
  reactive,
  onResponseChange,
  responseUser,
  userResponseStatus,
  themeProps,
  styles = {} as Reactive1Styles,
  containerStyle,
}) => {
  // Usar props en lugar de useTheme
  

  const handleSelect = (selectedAlternative: string) => {
    if (userResponseStatus !== 'pending') return;
    
    if (responseUser.includes(selectedAlternative)) {
      onResponseChange(responseUser.filter((alt) => alt !== selectedAlternative));
    } else {
      onResponseChange([...responseUser, selectedAlternative]);
    }
  };

  const alternatives = reactive?.alternatives?.config?.content?.[0]?.text?.response || [];
  const totalAlternatives = alternatives.length;
  
  // Obtener las respuestas correctas
  const correctResponses = useMemo(() => {
    const correctResponseData = reactive.alternatives?.config?.content?.[0]?.text?.correctResponse;
    return Array.isArray(correctResponseData) 
      ? correctResponseData.map(String)
      : [];
  }, [reactive.alternatives?.config?.content]);

  // Generar estilos basados en las props de tema
  const defaultStyles = useMemo(() => createStyles(themeProps), [themeProps]);

  // Valores predeterminados para completar las propiedades necesarias del tema para AlternativeButton
  const completeThemeProps = useMemo(() => {
    // Crear un objeto de tema compatible con AlternativeButton
    return {
      colors: {
        ...themeProps.colors,
        ui: themeProps.colors.ui || { button: themeProps.colors.neutral.gray200 || '#E0E0E0' },
        state: themeProps.colors.state || { default: themeProps.colors.neutral.white },
      },
      typography: themeProps.typography,
      spacing: themeProps.spacing,
      borders: {
        ...themeProps.borders,
        width: themeProps.borders.width || { thin: 1, normal: 2, medium: 3 }
      },
      shadows: themeProps.shadows || {
        md: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }
      },
      animations: themeProps.animations || { opacity: { pressed: 0.7 } },
      sizes: themeProps.sizes || { squareButton: { medium: { height: 48 } } },
    } as ThemeProps;
  }, [themeProps]);

  const getRowStyle = (index: number) => {
    if (totalAlternatives === 6) {
      return [defaultStyles.threeColumnsRow, styles.threeColumnsRow];
    } else if (totalAlternatives === 5) {
      return index === 0
        ? [defaultStyles.threeColumnsRow, styles.threeColumnsRow]
        : [defaultStyles.twoColumnsRow, styles.twoColumnsRow];
    } else if (totalAlternatives === 4) {
      return [defaultStyles.twoColumnsRow, styles.twoColumnsRow];
    }
    return [defaultStyles.defaultRow, styles.row];
  };

  const getAlternativesRows = () => {
    if (totalAlternatives === 6) {
      return [alternatives.slice(0, 3), alternatives.slice(3, 6)];
    } else if (totalAlternatives === 5) {
      return [alternatives.slice(0, 3), alternatives.slice(3, 5)];
    } else if (totalAlternatives === 4) {
      return [alternatives.slice(0, 2), alternatives.slice(2, 4)];
    }
    return [alternatives];
  };

  return (
    <View style={[
      defaultStyles.container,
      styles.container, 
      containerStyle
    ]}>
      <View style={[
        defaultStyles.alternativesContainer, 
        defaultStyles.alternativesContainerLandscape,
        styles.alternativesContainer
      ]}>
        {getAlternativesRows().map((row: string[], rowIndex: number) => (
            <View 
            key={`row-${row.join('-')}`} 
            style={getRowStyle(rowIndex)}
          >
            {row.map((alt: string) => {
              const isSelected = responseUser.includes(String(alt));
              const isCorrectAnswer = correctResponses.includes(String(alt));
              
              return (
                <View 
                  key={String(alt)} 
                  style={[
                    defaultStyles.alternativeWrapper,
                    styles.alternativeWrapper
                  ]}
                >
                  <AlternativeButton
                    onPress={() => handleSelect(String(alt))}
                    text={String(alt)}
                    isSelected={isSelected}
                    userResponseStatus={userResponseStatus}
                    isCorrectAnswer={isCorrectAnswer}
                    accessibilityLabel={`Seleccionar alternativa ${String(alt)}`}
                    themeProps={completeThemeProps}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

type StyleType = {
  [key: string]: ViewStyle | TextStyle | ImageStyle;
};

// Función para crear estilos basados en el tema
const createStyles = (theme: ThemeProps): StyleType => {
  return StyleSheet.create({
    container: {
      padding: theme.spacing[4],
      alignItems: 'center',
      flex: 1,
      backgroundColor: 'transparent',
      width: '100%',
    } as ViewStyle,
    title: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any, // Cast para evitar error de tipos
      marginBottom: theme.spacing[4],
      textAlign: 'center',
      color: theme.colors.primary.dark,
      fontFamily: theme.typography.fontFamily,
    } as TextStyle,
    alternativesContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing[2],
      flexDirection: 'row',
      flexWrap: 'wrap',
      display: 'flex',
      alignSelf: 'stretch',
      backgroundColor: 'transparent',
      borderRadius: theme.borders.radius.md,
    } as ViewStyle,
    alternativesContainerLandscape: {
      maxWidth: '90%',
    } as ViewStyle,
    defaultRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      gap: 8,
      marginBottom: theme.spacing[2],
      backgroundColor: 'transparent',
    } as ViewStyle,
    twoColumnsRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      gap: 10,
      marginBottom: theme.spacing[2],
      backgroundColor: 'transparent',
    } as ViewStyle,
    threeColumnsRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      gap: 6,
      marginBottom: theme.spacing[2],
      backgroundColor: 'transparent',
    } as ViewStyle,
    alternativeWrapper: {
      margin: 4,
      flex: 0,
      flexBasis: '30%',
      minWidth: 110,
      maxWidth: '32%',
      alignItems: 'center',
      backgroundColor: 'transparent',
    } as ViewStyle,
  });
};

export default Reactive1;
