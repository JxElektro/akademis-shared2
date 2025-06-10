// src/shared-components/reactives/reactivesFiles/Reactive25.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, Image, ScrollView } from 'react-native';
import { ReactiveSchema, ResponseMedia } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';
import { Reactive25Styles } from '../types/reactiveTypes';
import { Card } from '../components/Card';    

const IMAGE_MARGIN = 10;

interface MappedImage {
  id: string;
  label: string;
  url: string;
  quantity?: number;
}

interface Reactive25Props {
  reactive: ReactiveSchema;
  responseUser: any[];
  onResponseChange: (newResponse: any[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  images: MappedImage[];
  themeProps: ThemeProps;
  styles?: Reactive25Styles;
  containerStyle?: ViewStyle;
  width?: number;
  height?: number;
}

export const Reactive25: React.FC<Reactive25Props> = ({
  reactive,
  responseUser,
  onResponseChange,
  userResponseStatus,
  images,
  themeProps,
  styles = {} as Reactive25Styles,
  containerStyle,
  width: propWidth,
  height: propHeight
}) => {
  const width = propWidth || 375;
  // Usar un tamaño fijo para las imágenes
  const IMAGE_SIZE = Math.min(width * 0.3, 120);
  // Crear estilos con themeProps
  const defaultStyles = React.useMemo(() => createStyles(themeProps), [themeProps]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const title = reactive.assignment?.config?.content?.[0]?.text?.response?.[0] as string;

  // Limpiar selección cuando cambia el reactivo o el estado vuelve a 'pending'
  React.useEffect(() => {
    if (responseUser.length > 0 && userResponseStatus === 'pending') {
      onResponseChange([]);
    }
  }, [JSON.stringify(reactive), userResponseStatus, onResponseChange]);

  const handleSelect = (image: MappedImage) => {
    if (userResponseStatus !== 'pending') return;

    const alreadySelected = responseUser.some(r => r.id === image.id);
    if (alreadySelected) return;

    if (responseUser.length >= 3) return;

    const updatedResponse = [...responseUser, { id: image.id, quantity: image.quantity || 1 }];
    onResponseChange(updatedResponse);
  };

  const correctImageResponse = (reactive?.alternatives?.config?.content?.[0]?.images?.correctResponse || []) as ResponseMedia[];
  const correctImagesIds: string[] = correctImageResponse.map(item => item.id);

  return (
    <View style={[
      defaultStyles.container, 
      styles.container,
      containerStyle
    ]}>
      {/* Se eliminó el título del reactivo */}
      
      {/* ScrollView directo con las imágenes */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          defaultStyles.scrollViewContent,
          defaultStyles.imagesContainer
        ]}
      >
        {images.map((img) => {
          const isSelected = responseUser.some(r => r.id === img.id);
          const isCorrect = correctImagesIds.includes(img.id);

          // Determinar el estilo de la tarjeta basado en estado
          let cardStyle = defaultStyles.card;
          if (isSelected) {
            cardStyle = {...cardStyle, ...defaultStyles.selectedCard};
          }
          if (userResponseStatus !== 'pending') {
            if (isCorrect) {
              cardStyle = {...cardStyle, ...defaultStyles.correctCard};
            } else if (isSelected && !isCorrect) {
              cardStyle = {...cardStyle, ...defaultStyles.incorrectCard};
            }
          }

          return (
            <Card
              key={img.id}
              themeProps={themeProps}
              style={cardStyle}
            >
              <Pressable
                onPress={() => handleSelect(img)}
                disabled={userResponseStatus !== 'pending'}
                accessibilityLabel={`Seleccionar imagen ${img.label}`}
                style={({ pressed }) => [
                  defaultStyles.imageWrapper,
                  pressed && defaultStyles.pressedImageWrapper,
                  { width: IMAGE_SIZE - 16, height: IMAGE_SIZE - 16 }
                ]}
              >
                <Image
                  source={{ uri: img.url }}
                  style={[
                    defaultStyles.image, 
                    styles.image
                  ]}
                  resizeMode="cover"
                />
              </Pressable>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: ThemeProps) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: theme.spacing[4],
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing[5],
    textAlign: 'center',
    color: theme.colors.primary.dark,
    fontFamily: theme.typography.fontFamily,
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[2],
  },
  imagesContainer: {
    flexDirection: 'row',
    padding: theme.spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    margin: theme.spacing[2],
    borderRadius: theme.borders.radius.md,
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: theme.colors.primary.main,
    backgroundColor: 'rgba(51, 102, 255, 0.1)',
    borderWidth: theme.borders.width.normal,
  },
  correctCard: {
    borderColor: theme.colors.feedback.success.main,
    backgroundColor: 'rgba(0, 200, 81, 0.1)',
    borderWidth: theme.borders.width.normal,
  },
  incorrectCard: {
    borderColor: theme.colors.feedback.error.main,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderWidth: theme.borders.width.normal,
  },
  imageWrapper: {
    borderRadius: theme.borders.radius.md,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressedImageWrapper: {
    opacity: theme.animations.opacity.pressed || 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Reactive25;
