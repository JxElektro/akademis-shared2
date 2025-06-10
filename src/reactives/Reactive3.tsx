// src/shared-components/reactives/reactivesFiles/Reactive3.tsx


import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, Image, ScrollView } from 'react-native';

// Importar interfaces desde el archivo centralizado
import {
  Reactive3Styles 
} from '../types/reactiveTypes';
import { ReactiveSchema, ResponseMedia } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';

interface MappedImage {
  id: string;
  label: string;
  url: string;
}

interface Reactive3Props {
  reactive: ReactiveSchema;
  responseUser: ResponseMedia[];
  onResponseChange: (updatedResponse: ResponseMedia[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  // Props de tema
  themeProps: ThemeProps;
  // Props de estilo
  styles?: Reactive3Styles;
  containerStyle?: ViewStyle;
  // Imágenes a mostrar (ahora por prop)
  images: MappedImage[];
  // Nuevas props para dimensiones
  width?: number;
  height?: number;
}

const CARD_ASPECT_RATIO = 3;
const CARD_MARGIN = 16;

export const Reactive3: React.FC<Reactive3Props> = ({
  reactive,
  responseUser,
  onResponseChange,
  userResponseStatus,
  themeProps,
  styles = {} as Reactive3Styles,
  containerStyle,
  images,
  width: propWidth,
  height: propHeight
}) => {
  // Usar dimensiones de props o valores predeterminados
  const screenWidth = propWidth || 375;
  // Valores fijos para dimensiones de tarjetas
  const cardWidth = Math.min(screenWidth * 0.7, 400);

  // Generar estilos basados en las props de tema
  const defaultStyles = React.useMemo(() => createStyles(themeProps), [themeProps]);

  // Limpiar selección cuando cambia el reactivo o el estado vuelve a 'pending'
  useEffect(() => {
    if (responseUser.length > 0 && userResponseStatus === 'pending') {
      onResponseChange([]);
    }
  }, [JSON.stringify(reactive), userResponseStatus, onResponseChange]);

  const handleSelect = (image: MappedImage) => {
    if (userResponseStatus !== 'pending') return;
    const alreadySelected = responseUser.some(r => r.id === image.id);
    if (alreadySelected) return;
    if (responseUser.length >= 3) return;
    const updatedResponse = [...responseUser, { id: image.id, quantity: 1 }];
    onResponseChange(updatedResponse);
  };

  // Obtener ids de imágenes correctas
  const correctImageResponse = (reactive?.alternatives?.config?.content?.[0]?.images?.correctResponse || []) as ResponseMedia[];
  const correctImagesIds: string[] = correctImageResponse.map(item => item.id);

  if (!images || images.length === 0) {
    return (
      <View style={[defaultStyles.loadingContainer, styles.loadingContainer]}>
        <Text style={[defaultStyles.errorText, styles.errorText]}>No hay imágenes para mostrar.</Text>
      </View>
    );
  }

  return (
    <View style={[
      defaultStyles.container, 
      styles.container,
      containerStyle
    ]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[
          defaultStyles.cardsContainer, 
          styles.cardsContainer
        ]}>
          {images.map((img) => {
            const isSelected = responseUser.some(r => r.id === img.id);
            const isCorrect = correctImagesIds.includes(img.id);

            return (
              <Pressable
                key={img.id}
                onPress={() => handleSelect(img)}
                disabled={userResponseStatus !== 'pending'}
                accessibilityLabel={`Seleccionar imagen ${img.label}`}
                style={({ pressed }) => [
                  defaultStyles.card,
                  { width: cardWidth },
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
                <Image
                  source={{ uri: img.url }}
                  style={[defaultStyles.image as any, styles.image as any]}
                  resizeMode="contain"
                />
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
      padding: theme.spacing[6],
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: theme.colors.feedback.error.dark,
      fontSize: theme.typography.fontSize.base,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.semibold as any,
      marginBottom: theme.spacing[5],
      textAlign: 'center',
      color: theme.colors.primary.dark,
      fontFamily: theme.typography.fontFamily,
    },
    cardsContainer: {
      flexDirection: 'column',
      padding: theme.spacing[2],
      alignItems: 'center',
    },
    card: {
      aspectRatio: CARD_ASPECT_RATIO,
      marginVertical: CARD_MARGIN / 2,
      marginHorizontal: theme.spacing[2],
      backgroundColor: "transparent",
      borderRadius: theme.borders.radius.lg,
      overflow: 'hidden',
      borderWidth: theme.borders.width.normal,
      borderColor: 'transparent',
    },
    selectedCard: {
      borderColor: 'transparent',
      backgroundColor: "transparent",
    },
    correctCard: {
      borderColor: 'transparent',
    },
    incorrectCard: {
      borderColor: 'transparent',
    },
    pressedCard: {
      opacity: theme.animations.opacity.pressed,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    statusContainer: {
      marginTop: theme.spacing[4],
      padding: theme.spacing[3],
      alignItems: 'center',
    },
    statusText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold as any,
    },
    correctText: {
      color: theme.colors.feedback.success.main,
    },
    incorrectText: {
      color: theme.colors.feedback.error.main,
    },
  });
};

export default Reactive3;
