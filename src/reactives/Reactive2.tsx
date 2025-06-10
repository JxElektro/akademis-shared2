// src/reactives/reactivesFiles/Reactive2.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle , TextStyle , ImageStyle} from 'react-native';
import AlternativeButton from '../components/AlternativeButton';


import { Reactive2Styles, Reactive2Props } from '../types/reactiveTypes';
import { ReactiveSchema } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';

export const Reactive2: React.FC<Reactive2Props> = ({
  reactive,
  onResponseChange,
  responseUser,
  userResponseStatus,
  themeProps,
  styles = {} as Reactive2Styles,
  containerStyle,
}) => {
  // Generar estilos basados en las props de tema
  const defaultStyles = React.useMemo(() => createStyles(themeProps), [themeProps]);

  const handleSelect = (selectedAlternative: string) => {
    if (userResponseStatus !== 'pending') {
      return;
    }
    if (responseUser.includes(selectedAlternative)) {
      const updatedResponse = responseUser.filter((alt) => alt !== selectedAlternative);
      onResponseChange(updatedResponse);
    } else {
      onResponseChange([...responseUser, selectedAlternative]);
    }
  };

  const alternatives = reactive.alternatives?.config?.content?.[0]?.text?.response || [];
  const alternativesArray = Array.isArray(alternatives) ? alternatives.map(String) : [];
  
  // Obtener las respuestas correctas
  const correctResponses = React.useMemo(() => {
    const correctResponseData = reactive.alternatives?.config?.content?.[0]?.text?.correctResponse;
    return Array.isArray(correctResponseData) 
      ? correctResponseData.map(String)
      : [];
  }, [reactive.alternatives?.config?.content]);

  // Valores predeterminados para completar las propiedades necesarias del tema para AlternativeButton
  const completeThemeProps = React.useMemo(() => {
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

  if (!alternativesArray.length) {
    return <Text style={[defaultStyles.errorText, styles.errorText]}>No hay alternativas disponibles.</Text>;
  }

  return (
    <View style={[
      defaultStyles.container, 
      styles.container,
      containerStyle
    ]}>
      <View style={[
        defaultStyles.alternativesContainer,
        styles.alternativesContainer
      ]}>
        {alternativesArray.map((alt: string) => {
          const isSelected = responseUser.includes(alt);
          const isCorrectAnswer = correctResponses.includes(alt);
          
          return (
            <View 
              key={alt} 
              style={[
                defaultStyles.alternativeWrapper,
                styles.alternativeWrapper
              ]}
            >
              <AlternativeButton
                onPress={() => handleSelect(alt)}
                text={alt}
                isSelected={isSelected}
                userResponseStatus={userResponseStatus}
                isCorrectAnswer={isCorrectAnswer}
                accessibilityLabel={`Seleccionar alternativa ${alt}`}
                themeProps={completeThemeProps}
              />
            </View>
          );
        })}
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
      paddingHorizontal: theme.spacing[6],
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
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      padding: theme.spacing[2],
      borderRadius: theme.borders.radius.md,
      width: '100%',
      maxWidth: '80%',
    } as ViewStyle,
    alternativeWrapper: {
      alignItems: 'center',
      marginBottom: theme.spacing[2],
      backgroundColor: 'transparent',
    } as ViewStyle,
    errorText: {
      color: theme.colors.feedback?.error.main || '#F44336',
      fontSize: theme.typography.fontSize.base || 16,
      textAlign: 'center',
    } as TextStyle,
  });
};

export default Reactive2;
