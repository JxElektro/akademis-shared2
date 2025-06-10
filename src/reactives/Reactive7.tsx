// src/shared-components/reactives/reactivesFiles/Reactive7.tsx

import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, Image, ScrollView } from 'react-native';

// Importar interfaces desde el archivo centralizado
import { 
  ThemeProps, 
  ResponseMedia, 
  ReactiveSchema,
  Reactive7Styles 
} from '../types';

// Valores fijos para el diseño del componente
const NUM_COLUMNS = 3;
const MAX_ROWS = 3;
const IMAGE_MARGIN = 4;

interface MappedImage {
  id: string;
  label: string;
  url: string;
  quantity: number;
}

interface Reactive7Props {
  reactive: ReactiveSchema;
  responseUser: ResponseMedia[];
  onResponseChange: (updatedResponse: ResponseMedia[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  images: MappedImage[];
  // Props de tema
  themeProps: ThemeProps;
  // Props de estilo
  styles?: Reactive7Styles;
  containerStyle?: ViewStyle;
  // Props para dimensiones
  width?: number;
  height?: number;
}

export const Reactive7: React.FC<Reactive7Props> = ({
  reactive,
  responseUser,
  onResponseChange,
  userResponseStatus,
  images,
  themeProps,
  styles = {} as Reactive7Styles,
  containerStyle,
  width: propWidth,
  height: propHeight
}) => {
  const width = propWidth || 375;
  const height = propHeight || 667;
  
  // Valores fijos para el diseño de tarjetas
  const cardWidth = Math.min(width * 0.6, 250);
  const cardHeight = 240;
  const cardMargin = 10;
  
  // Calcular tamaño de imágenes adaptado al número de columnas
  const calculateImageSize = () => {
    const totalMargins = IMAGE_MARGIN * (NUM_COLUMNS + 1);
    const imageSize = (cardWidth - totalMargins) / NUM_COLUMNS;
    return imageSize * 1.2;
  };
  
  const imageSize = calculateImageSize();
  
  // Generar estilos basados en las props de tema
  const defaultStyles = useMemo(() => createStyles(themeProps), [themeProps]);

  // Limpiar selección cuando cambia el reactivo o el estado vuelve a 'pending'
  useEffect(() => {
    if (responseUser.length > 0 && userResponseStatus === 'pending') {
      onResponseChange([]);
    }
  }, [JSON.stringify(reactive), userResponseStatus, onResponseChange]);

  const handleSelect = (image: MappedImage) => {
    if (userResponseStatus !== 'pending') return;

    const alreadySelected = responseUser.some(r => r.id === image.id);
    
    if (alreadySelected) {
      // Si ya está seleccionada, la quitamos de la selección
      const updatedResponse = responseUser.filter(r => r.id !== image.id);
      onResponseChange(updatedResponse);
    } else {
      // Si no está seleccionada, la agregamos a la selección
      const updatedResponse = [...responseUser, { id: image.id, quantity: image.quantity }];
      onResponseChange(updatedResponse);
    }
  };

  const correctImages = (reactive?.alternatives?.config?.content?.[0]?.images?.correctResponse || []) as ResponseMedia[];
  const correctImagesIds: string[] = correctImages.map(item => item.id);

  return (
    <View style={[defaultStyles.container, styles.container, containerStyle]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={[defaultStyles.scrollViewContainer, styles.scrollViewContainer]}
        contentContainerStyle={[defaultStyles.scrollViewContent, styles.scrollViewContent]}
      >
        <View style={[defaultStyles.cardsContainer, styles.cardsContainer]}>
          {images.map((img) => {
            const isSelected = responseUser.some(r => r.id === img.id);
            const isCorrect = correctImagesIds.includes(img.id);

            return (
              <Pressable
                key={img.id}
                onPress={() => handleSelect(img)}
                disabled={userResponseStatus !== 'pending'}
                accessibilityLabel={isSelected ? `Deseleccionar imagen ${img.label}` : `Seleccionar imagen ${img.label}`}
                style={({ pressed }) => [
                  defaultStyles.card,
                  { width: cardWidth, height: cardHeight, margin: cardMargin },
                  isSelected && defaultStyles.selectedCard,
                  userResponseStatus !== 'pending' && isCorrect && defaultStyles.correctCard,
                  userResponseStatus !== 'pending' && isSelected && !isCorrect && defaultStyles.incorrectCard,
                  pressed && defaultStyles.pressedCard,
                  styles.card,
                  isSelected && styles.selectedCard,
                  userResponseStatus !== 'pending' && isCorrect && styles.correctCard,
                  userResponseStatus !== 'pending' && isSelected && !isCorrect && styles.incorrectCard,
                ]}
              >
                <View style={[defaultStyles.imagesGrid, styles.imagesGrid]}>
                  {Array.from({ length: Math.min(img.quantity, NUM_COLUMNS * MAX_ROWS) }).map((_, idx) => (
                    <Image
                      key={`${img.id}-${idx}`}
                      source={{ uri: img.url }}
                      style={[
                        defaultStyles.image, 
                        styles.image,
                        {
                          width: imageSize,
                          height: imageSize,
                          marginLeft: idx % NUM_COLUMNS === 0 ? 0 : IMAGE_MARGIN,
                          marginTop: IMAGE_MARGIN,
                          borderRadius: 0
                        }
                      ]}
                      resizeMode="cover"
                    />
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

// Función para crear estilos basados en el tema
const createStyles = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      height: '100%',
      position: 'relative',
      zIndex: 1,
    },
    scrollViewContainer: {
      flex: 1,
      width: '100%',
      zIndex: 10,
    },
    scrollViewContent: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '100%',
    },
    cardsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 15,
    },
    card: {
      borderRadius: theme.borders.radius.lg,
      padding: IMAGE_MARGIN,
      borderWidth: theme.borders.width.normal,
      borderColor: 'transparent',
      backgroundColor: theme.colors.neutral.white,
      justifyContent: 'center',
      zIndex: 20, 
      elevation: 5, 
    },
    selectedCard: {
      borderColor: theme.colors.primary.main,
      backgroundColor: theme.colors.primary.lightest || '#f0f0ff',
    },
    correctCard: {
      borderColor: theme.colors.feedback.success.main,
      backgroundColor: theme.colors.feedback.success.light,
    },
    incorrectCard: {
      borderColor: theme.colors.feedback.error.main,
      backgroundColor: theme.colors.feedback.error.light,
    },
    pressedCard: {
      opacity: theme.animations.opacity.pressed,
    },
    imagesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      backgroundColor: 'transparent',
      overflow: 'hidden',
    },
  });
};

export default Reactive7;
