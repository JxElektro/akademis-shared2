// src/shared-components/reactives/reactivesFiles/Reactive40.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';
import { ReactiveSchema } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';
import { Reactive40Styles } from '../types/reactiveTypes'; // debe traerse desde reactiveTypes
import AlternativeButton from '../components/AlternativeButton';

interface MappedImage {
  id: string;
  url: string;
  quantity: number;
}

interface Reactive40Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (newResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  images: MappedImage[];
  themeProps: ThemeProps;
  styles?: Reactive40Styles;
  containerStyle?: ViewStyle;
  resetTrigger?: number;
}

export const Reactive40: React.FC<Reactive40Props> = ({
  reactive,
  responseUser,
  onResponseChange,
  userResponseStatus,
  images,
  themeProps,
  styles = {} as Reactive40Styles,
  containerStyle,
  resetTrigger = 0,
}) => {
  // Usar un tamaño fijo para las imágenes, pero más grande
  const imageSize = 200;
  // Crear estilos con themeProps
  const defaultStyles = useMemo(() => createStyles(themeProps), [themeProps]);

  const assignmentContent = reactive.assignment?.config?.content || [];
  const question = assignmentContent[0]?.text?.response?.[0] ?? 'Pregunta sin definir';
  const alternatives = reactive.alternatives?.config?.content?.[0]?.text?.response as string[] | undefined;
  const safeAlternatives: string[] = alternatives || [];
  
  // Obtener las respuestas correctas
  const correctResponseData = reactive.alternatives?.config?.content?.[0]?.text?.correctResponse;
  const correctResponses: string[] = Array.isArray(correctResponseData) 
    ? correctResponseData.map(String) 
    : [];

  // Limpiar selección cuando cambia el reactivo o el estado vuelve a 'pending'
  React.useEffect(() => {
    if (responseUser.length > 0 && userResponseStatus === 'pending') {
      onResponseChange([]);
    }
  }, [JSON.stringify(reactive), resetTrigger, userResponseStatus, onResponseChange]);

  const handleSelectAlternative = (selectedAlternative: string) => {
    if (userResponseStatus !== 'pending') return;
    if (responseUser.includes(selectedAlternative)) {
      const newResponse = responseUser.filter((alt) => alt !== selectedAlternative);
      onResponseChange(newResponse);
    } else {
      onResponseChange([...responseUser, selectedAlternative]);
    }
  };

  // Determinar si usamos dos columnas basado en la cantidad de alternativas
  // Para Reactive40, siempre usaremos formato de columnas
  const useTwoColumns = true;
  // Extraer la imagen principal (similar a Reactive52)
  const image = images && images.length > 0 ? images[0] : null;

  return (
    <View style={[
      defaultStyles.container, 
      styles.container,
      containerStyle
    ]}>
      {/* Imagen */}
      {image && (
        <View style={[
          defaultStyles.imageContainer,
          styles.imageContainer,
          { marginTop: 20 } // Subir la imagen ajustando el margen superior
        ]}>
          <Image
            source={{ uri: image.url }}
            style={[
              defaultStyles.image, 
              { width: imageSize, height: imageSize },
              styles.image
            ]}
            resizeMode="contain"
          />
        </View>
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
            
            return (
              <View 
                key={`${alt}-${index}`} 
                style={[
                  defaultStyles.alternativeWrapper,
                  useTwoColumns && defaultStyles.alternativeWrapperColumn,
                  styles.alternativeWrapper
                ]}
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

const createStyles = (theme: ThemeProps) => StyleSheet.create({
  container: {
    padding: theme.spacing[4],
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
  },
  questionContainer: {
    marginBottom: theme.spacing[4],
    width: '90%',
    maxWidth: 550,
    alignItems: 'center',
  },
  questionText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    color: theme.colors.primary.dark,
    fontFamily: theme.typography.fontFamily,
  },
  imageContainer: {
    marginVertical: theme.spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    borderRadius: theme.borders.radius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.neutral.gray100,
  },
  image: {
    borderRadius: theme.borders.radius.md,
    marginBottom: theme.spacing[4],
  },
  noAlternativesContainer: {
    marginTop: theme.spacing[4],
    padding: theme.spacing[3],
  },
  noAlternativesText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.dark,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily,
  },
  alternativesContainer: {
    width: '100%',
    marginTop: theme.spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  twoColumnsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: theme.spacing[1],
  },
  defaultRow: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing[2],
  },
  alternativeWrapper: {
    marginVertical: theme.spacing[1],
  },
  alternativeWrapperColumn: {
    width: '30%',
  },
});

export default Reactive40;
