// src/shared-components/reactives/reactivesFiles/Reactive20.tsx
import React from 'react';
import { ImageStyle, TextStyle, ViewStyle, Image, View, Text, StyleSheet } from 'react-native';
import SquareButton from '../components/SquareButton';
import { ReactiveSchema } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';
import { Reactive20Styles, Reactive20Props, MappedImage, ImageCardProps, ImageResponse, ReactiveContentWithImages } from '../types/reactiveTypes';

const IMAGE_MARGIN = 4;

const createStyles = (theme: ThemeProps) => StyleSheet.create({
  container: {
    padding: theme.spacing[5],
    paddingHorizontal: theme.spacing[8],
    alignItems: 'center',
    width: '100%',
  },
  titleText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing[4],
    textAlign: 'center',
    color: theme.colors.primary.dark,
  },
  fullOperationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    padding: 8,
  },
  operatorContainer: {
    paddingHorizontal: theme.spacing[2],
  },
  operatorText: {
    fontSize: 28,
    color: theme.colors.primary.dark,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borders.radius.lg,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray300,
    padding: IMAGE_MARGIN,
    marginHorizontal: theme.spacing[1],
    width: 160,
    minHeight: 160,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: IMAGE_MARGIN,
    width: '100%',
    padding: 2,
  },
  imageWrapper: {
    overflow: 'hidden',
    borderRadius: theme.borders.radius.sm,
    margin: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  equalSign: {
    fontSize: 28,
    color: theme.colors.primary.dark,
    marginHorizontal: theme.spacing[2],
  },
  touchableInput: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    minHeight: 60,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray500,
  },
  inputContainerFocused: {
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  inputContainerCorrect: {
    borderWidth: 2,
    borderColor: theme.colors.feedback.success.main,
  },
  inputContainerIncorrect: {
    borderWidth: 2,
    borderColor: theme.colors.feedback.error.main,
  },
});

const ImageCard: React.FC<ImageCardProps> = ({
  img,
  quantity,
  cardStyle,
  imagesGridStyle,
  imageWrapperStyle,
  imageStyle,
  theme,
}) => {
  const styles = createStyles(theme);
  
  const renderImages = () => {
    const qty = quantity > 0 ? quantity : 1;
    return Array.from({ length: qty }).map((_, idx) => (
      <View
        key={`${img.name}-${idx}`}
        style={[
          styles.imageWrapper,
          {
            width: 30,
            height: 30,
          },
          imageWrapperStyle,
        ]}
      >
        <Image
          source={{ uri: img.url || '' }}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
        />
      </View>
    ));
  };

  return (
    <View style={[styles.card, cardStyle as ViewStyle]}>
      <View style={[styles.imagesGrid, imagesGridStyle]}>
        {renderImages()}
      </View>
    </View>
  );
};

export const Reactive20: React.FC<Reactive20Props> = ({
  reactive,
  userResponseStatus,
  keyValue,
  setKey,
  inputId,
  isFocused,
  setFocusId,
  images = [],
  themeProps,
  styles = {} as Reactive20Styles,
  containerStyle,
  width: propWidth,
  height: propHeight
}) => {
  // Usar tema directamente
  const theme = themeProps;
  const defaultStyles = createStyles(theme);

  // Obtener título y operador del reactivo
  const assignmentContent = (reactive.assignment?.config?.content || []) as any[];
  const operator: string = (assignmentContent[2]?.text?.response?.[0] as string) || '+';

  // Usar las imágenes recibidas por props
  const leftImageData = images[0] || {
    id: 'placeholder-left',
    label: 'Imagen izquierda',
    quantity: 1,
    url: '',
  };
  const rightImageData = images[1] || {
    id: 'placeholder-right',
    label: 'Imagen derecha',
    quantity: 1,
    url: '',
  };

  const leftImageObj = {
    name: leftImageData.label || 'imagen1',
    url: leftImageData.url,
  };
  const rightImageObj = {
    name: rightImageData.label || 'imagen2',
    url: rightImageData.url,
  };

  const handlePress = () => {
    const newFocus = isFocused ? null : inputId;
    setFocusId(newFocus);
  };

  // Determinar el estilo de los elementos según el estado de la respuesta
  const getInputContainerStyle = () => {
    if (userResponseStatus === 'correct') {
      return {
        ...defaultStyles.touchableInput,
        ...defaultStyles.inputContainerCorrect,
        ...styles.touchableInput,
        ...styles.inputContainerCorrect,
      };
    } else if (userResponseStatus === 'incorrect') {
      return {
        ...defaultStyles.touchableInput,
        ...defaultStyles.inputContainerIncorrect,
        ...styles.touchableInput,
        ...styles.inputContainerIncorrect,
      };
    } else if (isFocused) {
      return {
        ...defaultStyles.touchableInput,
        ...defaultStyles.inputContainerFocused,
        ...styles.touchableInput,
        ...styles.inputContainerFocused,
      };
    } else {
      return {
        ...defaultStyles.touchableInput,
        ...styles.touchableInput,
      };
    }
  };

  // Determinar el estado del botón considerando el estado de la respuesta
  const getButtonState = () => {
    if (userResponseStatus !== 'pending') {
      return 'unselected'; // Usamos unselected para no cambiar el color de fondo, solo el borde
    } else if (isFocused) {
      return 'selected';
    } else {
      return 'unselected';
    }
  };

  // Determinar estilos de tarjetas de imágenes según el estado de la respuesta
  const getCardStyle = (baseStyle: ViewStyle) => {
    if (userResponseStatus === 'correct') {
      return {
        ...baseStyle,
        borderWidth: 2,
        borderColor: theme.colors.feedback.success.main,
      };
    } else if (userResponseStatus === 'incorrect') {
      return {
        ...baseStyle,
        borderWidth: 2,
        borderColor: theme.colors.feedback.error.main,
      };
    }
    return baseStyle;
  };

  return (
    <View style={[
      defaultStyles.container,
      styles.container,
      containerStyle
    ]}>
      <View style={[
        defaultStyles.fullOperationContainer,
        styles.fullOperationContainer || styles.row // Usar row de ReactiveStyles si está disponible
      ]}>
        <ImageCard
          img={leftImageObj}
          quantity={leftImageData.quantity}
          cardStyle={getCardStyle(styles.card as ViewStyle || defaultStyles.card)}
          imagesGridStyle={styles.imagesGrid}
          imageWrapperStyle={styles.imageWrapper}
          imageStyle={styles.image}
          theme={theme}
        />
        <View style={[defaultStyles.operatorContainer, styles.operatorContainer]}>
          <Text style={[
            defaultStyles.operatorText,
            styles.operatorText
          ]}>
            {operator}
          </Text>
        </View>
        <ImageCard
          img={rightImageObj}
          quantity={rightImageData.quantity}
          cardStyle={getCardStyle(styles.card as ViewStyle || defaultStyles.card)}
          imagesGridStyle={styles.imagesGrid}
          imageWrapperStyle={styles.imageWrapper}
          imageStyle={styles.image}
          theme={theme}
        />
        <Text style={[
          defaultStyles.equalSign,
          styles.equalSign
        ]}>
          =
        </Text>
        <SquareButton
          text={keyValue === '' ? ' ' : keyValue}
          state={getButtonState()}
          size="keyboardMedium"
          accessibilityLabel={`Entrada numérica ${inputId}`}
          onPress={handlePress}
          containerStyle={getInputContainerStyle()}
          testID={`squareButton-${inputId}`}
          themeProps={theme}
        />
      </View>
    </View>
  );
};

export default Reactive20;
