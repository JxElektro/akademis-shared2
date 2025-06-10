// src/shared-components/reactives/reactivesFiles/Reactive52.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';
import { ReactiveSchema } from '../types/reactiveSchema';
import { Reactive52Styles, Reactive52Props, MappedImage } from '../types/reactiveTypes';
import AlternativeButton from '../components/AlternativeButton';

// Definición de tipos locales
type UserResponseStatus = 'pending' | 'correct' | 'incorrect';

export const Reactive52: React.FC<Reactive52Props> = ({
  reactive,
  responseUser,
  onResponseChange,
  userResponseStatus,
  images,
  themeProps,
  styles = {} as Reactive52Styles,
  containerStyle,
  width: propWidth,
  height: propHeight,
  resetTrigger = 0
}) => {
  // Configuración de tamaños
  const imageSize = 220;
  const width = propWidth || 375;
  
  // Obtener contenido del reactivo
  const assignmentContent = reactive.assignment?.config?.content || [];
  const question = assignmentContent[0]?.text?.response?.[0] ?? 'Pregunta sin definir';
  
  // Procesar alternativas de manera segura
  const alternatives = reactive.alternatives?.config?.content?.[0]?.text?.response;
  const safeAlternatives = Array.isArray(alternatives) 
    ? alternatives.filter(alt => typeof alt === 'string').slice(0, 4)
    : [];
  
  // Obtener respuestas correctas
  const correctResponseData = reactive.alternatives?.config?.content?.[0]?.text?.correctResponse;
  const correctResponses = Array.isArray(correctResponseData) 
    ? correctResponseData.filter(resp => typeof resp === 'string')
    : [];

  // Crear los estilos usando useMemo
  const defaultStyles = useMemo(() => createStyles(themeProps), [themeProps]);
  
  // Limpiar selección cuando cambia el reactivo o el estado vuelve a 'pending'
  React.useEffect(() => {
    if (responseUser.length > 0 && userResponseStatus === 'pending') {
      onResponseChange([]);
    }
  }, [JSON.stringify(reactive), resetTrigger, userResponseStatus, onResponseChange]);

  // Manejar selección de alternativa
  const handleSelectAlternative = (selectedAlternative: string) => {
    if (userResponseStatus !== 'pending') return;
    
    if (responseUser.includes(selectedAlternative)) {
      const newResponse = responseUser.filter((alt) => alt !== selectedAlternative);
      onResponseChange(newResponse);
    } else {
      onResponseChange([...responseUser, selectedAlternative]);
    }
  };

  // Extraer la imagen (este reactivo solo usa una imagen)
  const image = images && images.length > 0 ? images[0] : null;

  // Determinar si debemos usar modo de dos columnas
  const useTwoColumns = safeAlternatives.length >= 2;

  return (
    <View style={[
      defaultStyles.container, 
      styles.container,
      containerStyle
    ]}>
      {/* Imagen */}
      {image && (
        <Image
          source={{ uri: image.url }}
          style={[
            defaultStyles.image, 
            { width: imageSize, height: imageSize },
            styles.image
          ]}
          resizeMode="contain"
        />
      )}
      
      {/* Alternativas */}
      {safeAlternatives.length === 0 ? (
        <View style={[defaultStyles.noAlternativesContainer, styles.noAlternativesContainer]}>
          <Text style={[defaultStyles.noAlternativesText, styles.noAlternativesText]}>
            No hay alternativas disponibles.
          </Text>
        </View>
      ) : (
        <View style={[
          defaultStyles.alternativesContainer,
          useTwoColumns ? defaultStyles.twoColumnsRow : defaultStyles.defaultRow,
          styles.alternativesContainer,
          useTwoColumns ? styles.twoColumnsRow : styles.defaultRow
        ]}>
          {safeAlternatives.map((alt: string, index: number) => {
            const isSelected = responseUser.includes(alt);
            const isCorrectAnswer = correctResponses.includes(alt);
            
            let itemStyle;
            if (useTwoColumns) { // This means safeAlternatives.length >= 2
              if (safeAlternatives.length === 3) {
                itemStyle = defaultStyles.threeButtonsRowItem;
              } else { // Applies to 2 or 4 alternatives
                itemStyle = defaultStyles.alternativeButtonOuterWrapper;
              }
            }

            return (
              <View 
                key={`${alt}-${index}`} 
                style={itemStyle}
              >
                <AlternativeButton
                  onPress={() => handleSelectAlternative(alt)}
                  text={alt}
                  isSelected={isSelected}
                  userResponseStatus={userResponseStatus}
                  isCorrectAnswer={isCorrectAnswer}
                  accessibilityLabel={`Seleccionar alternativa ${alt}`}
                  themeProps={themeProps}
                />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

// Crear función para estilos basada en themeProps
const createStyles = (theme: any) => {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      backgroundColor: 'transparent',
      width: '100%',
      padding: 0,
    },
    image: {
      borderRadius: theme.borders.radius.md,
      overflow: 'hidden',
      marginTop: 0,
      marginBottom: theme.spacing[3],
    },
    titleText: {
      fontWeight: theme.typography.fontWeight.bold,
      textAlign: 'center',
      color: theme.colors.primary.dark,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize.xl,
    },
    textContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
      width: '90%',
      maxWidth: 550,
      marginHorizontal: 'auto',
      marginVertical: 0,
    },
    alternativesContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: theme.spacing[2],
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    twoColumnsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'stretch',
      gap: theme.spacing[2],
    },
    defaultRow: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      gap: theme.spacing[2],
    },
    noAlternativesContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing[4],
    },
    noAlternativesText: {
      color: theme.colors.neutral.gray500 || '#6B7280',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize.base,
    },
    imageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginVertical: theme.spacing[3],
      gap: theme.spacing[2],
    },
    imageWrapper: {
      margin: theme.spacing[1],
      borderRadius: theme.borders.radius.md,
      overflow: 'hidden',
      backgroundColor: theme.colors.neutral.gray100,
    },
    questionText: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing[3],
      textAlign: 'center',
      color: theme.colors.primary.dark,
    },
    alternativeButtonOuterWrapper: {
      width: '48%', // Allows two items side-by-side with a gap
      // If AlternativeButton has internal width: '100%', it will fill this wrapper.
    },
    threeButtonsRowItem: {
      width: '31%', // Allows three items side-by-side with a gap
    },
  });
};

// Exportar también como Reactive52Local para compatibilidad
export const Reactive52Local = Reactive52;

export default Reactive52;
