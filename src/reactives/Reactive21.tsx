// src/shared-components/reactives/reactivesFiles/Reactive21.tsx

import React from 'react';
import { ImageStyle, TextStyle, ViewStyle, Image, ActivityIndicator, View, Text, Pressable, StyleSheet } from 'react-native';
import { SquareButton } from '../components/SquareButton';
import { ThemeProps } from '../types';


// Interfaces para estilos personalizables
export interface Reactive21Styles {
  container?: ViewStyle;
  titleText?: TextStyle;
  imagesContainer?: ViewStyle;
  imageWrapper?: ViewStyle;
  image?: ImageStyle;
  operationContainer?: ViewStyle;
  operationSymbol?: TextStyle;
  inputButton?: ViewStyle;
  inputFocused?: ViewStyle;
  imageCircle?: ViewStyle;
  feedbackContainer?: ViewStyle;
  feedbackText?: TextStyle;
}

export interface Reactive21Props {
  reactive: any; // Puedes usar el tipo ReactiveSchema si lo tienes definido
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  numericResponse: { first: string; second: string; result: string };
  focusedInput: 'first' | 'second' | 'result' | null;
  onNumericChange: (newResponse: { first: string; second: string; result: string }) => void;
  setFocusedInput: (field: 'first' | 'second' | 'result' | null) => void;
  imageUrl: string;
  themeProps: ThemeProps;
  styles?: Reactive21Styles;
  containerStyle?: ViewStyle;
  screenWidth?: number;
}

const MAX_COLUMNS = 11; // Se esperan 11 imágenes por fila (si hay al menos 11 imágenes)
const IMAGE_MARGIN = 8; // Margen entre imágenes

export const Reactive21: React.FC<Reactive21Props> = ({
  reactive,
  userResponseStatus,
  numericResponse,
  focusedInput,
  onNumericChange,
  setFocusedInput,
  imageUrl,
  themeProps,
  styles = {} as Reactive21Styles,
  containerStyle,
  screenWidth,
}) => {
  // Usar el ancho proporcionado o valor predeterminado
  const width = screenWidth || 375; // valor predeterminado seguro
  // Definir un ancho de contenedor intermedio: 98% del ancho de la pantalla, sin límite máximo
  const containerWidth = width * 0.98;

  // Extraer el título (índice 0 de la asignación)
  const title =
    reactive.assignment?.config?.content?.[0]?.text?.response?.[0] || 'Pregunta sin título';

  // Obtener el total de imágenes desde la configuración (índice 0 del inputType)
  const defaultTotalStr =
    reactive.correctAlternative?.inputType?.config?.content?.[0]?.number?.response?.[0];
  const defaultTotal = parseInt(defaultTotalStr);
  // Las imágenes se renderizan siempre según el valor configurado.
  const totalImages = defaultTotal;

  // Determinar el número de columnas a usar:
  // Si totalImages es menor que 11, usamos ese número; de lo contrario, usamos 11.
  const columns = totalImages < MAX_COLUMNS ? totalImages : MAX_COLUMNS;
  // Recalcular el tamaño de cada imagen según el contenedor y el número de columnas
  const computedImageSize = (containerWidth - IMAGE_MARGIN * (columns + 1)) / columns;

  // Calcular la cantidad de imágenes a deshabilitar (segundo operando),
  // limitándolo a no exceder totalImages.
  const subtractValue = parseInt(numericResponse.second) || 0;
  const clampedSubtractValue = Math.min(subtractValue, totalImages);
  const activeCount = Math.max(0, totalImages - clampedSubtractValue);

  // Función para cambiar el foco entre los inputs numéricos.
  const handlePress = (field: 'first' | 'second' | 'result') => {
    const newFocus = focusedInput === field ? null : field;
    setFocusedInput(newFocus);
  };

  // Función para renderizar las imágenes.
  const renderImages = () => {
    const imagesArray = [];
    for (let i = 0; i < totalImages; i++) {
      const isActive = i < activeCount;
      imagesArray.push(
        <View
          key={`img-${i}`}
          style={[
            defaultStyles.imageWrapper,
            {
              width: computedImageSize,
              height: computedImageSize,
              marginLeft: IMAGE_MARGIN,
              marginTop: IMAGE_MARGIN,
              opacity: isActive ? 1 : 0.3,
            },
            styles.imageWrapper,
          ]}
        >
          <View style={[
            defaultStyles.imageCircle,
            {
              width: computedImageSize,
              height: computedImageSize,
              borderRadius: computedImageSize / 2,
            }
          ]}>
            <Image
              source={{ uri: imageUrl }}
              style={[
                defaultStyles.image,
                {
                  width: computedImageSize * 0.8,
                  height: computedImageSize * 0.8,
                },
              ]}
              resizeMode="contain"
            />
          </View>
        </View>
      );
    }
    return imagesArray;
  };

  // Obtener color de feedback para bordes de elementos
  const getFeedbackBorderStyle = (isCorrect: boolean) => {
    if (userResponseStatus === 'pending') return {};
    
    return isCorrect 
      ? { borderColor: themeProps.colors.feedback.success.main || '#00C851', borderWidth: 2 } 
      : { borderColor: themeProps.colors.feedback.error.main || '#FF4444', borderWidth: 2 };
  };

  return (
    <View style={[
      defaultStyles.container, 
      styles.container,
      containerStyle
    ]}>
      {/* Cuadrícula de imágenes */}
      <View style={[
        defaultStyles.imagesContainer, 
        { width: '100%' },
        styles.imagesContainer
      ]}>
        {renderImages()}
      </View>
      {/* Fila de inputs numéricos para la operación: [primer operando] - [segundo operando] = [resultado] */}
      <View style={[
        defaultStyles.operationContainer,
        styles.operationContainer
      ]}>
        {/* Primer operando: el usuario ingresa manualmente el número que observa */}
        <SquareButton
          text={numericResponse.first === '' ? ' ' : numericResponse.first}
          state={
            userResponseStatus !== 'pending' 
              ? (userResponseStatus === 'correct' ? 'selected' : 'unselected')
              : focusedInput === 'first' ? 'selected' : 'unselected'
          }
          size="keyboardMedium"
          accessibilityLabel="Entrada numérica primer número"
          onPress={() => handlePress('first')}
          containerStyle={{
            ...defaultStyles.inputButton,
            ...(focusedInput === 'first' ? defaultStyles.inputFocused : {}),
            ...styles.inputButton,
            ...(focusedInput === 'first' ? styles.inputFocused : {}),
            ...getFeedbackBorderStyle(userResponseStatus === 'correct')
          }}
          testID="squareButton-first"
          themeProps={themeProps}
        />
        <Text style={[defaultStyles.operationSymbol, styles.operationSymbol]}> - </Text>
        {/* Segundo operando: cantidad a deshabilitar */}
        <SquareButton
          text={numericResponse.second === '' ? ' ' : numericResponse.second}
          state={
            userResponseStatus !== 'pending' 
              ? (userResponseStatus === 'correct' ? 'selected' : 'unselected')
              : focusedInput === 'second' ? 'selected' : 'unselected'
          }
          size="keyboardMedium"
          accessibilityLabel="Entrada numérica segundo número"
          onPress={() => handlePress('second')}
          containerStyle={{
            ...defaultStyles.inputButton,
            ...(focusedInput === 'second' ? defaultStyles.inputFocused : {}),
            ...styles.inputButton,
            ...(focusedInput === 'second' ? styles.inputFocused : {}),
            ...getFeedbackBorderStyle(userResponseStatus === 'correct')
          }}
          testID="squareButton-second"
          themeProps={themeProps}
        />
        <Text style={[defaultStyles.operationSymbol, styles.operationSymbol]}> = </Text>
        {/* Tercer operando: resultado */}
        <SquareButton
          text={numericResponse.result === '' ? ' ' : numericResponse.result}
          state={
            userResponseStatus !== 'pending' 
              ? (userResponseStatus === 'correct' ? 'selected' : 'unselected')
              : focusedInput === 'result' ? 'selected' : 'unselected'
          }
          size="keyboardMedium"
          accessibilityLabel="Entrada numérica resultado"
          onPress={() => handlePress('result')}
          containerStyle={{
            ...defaultStyles.inputButton,
            ...(focusedInput === 'result' ? defaultStyles.inputFocused : {}),
            ...styles.inputButton,
            ...(focusedInput === 'result' ? styles.inputFocused : {}),
            ...getFeedbackBorderStyle(userResponseStatus === 'correct')
          }}
          testID="squareButton-result"
          themeProps={themeProps}
        />
      </View>
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: 8,
    paddingTop: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2A2870',
    display: 'none',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
    borderWidth: 0,
    padding: 8,
    borderRadius: 8,
    width: '100%',
  },
  imageWrapper: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  imageCircle: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    backgroundColor: 'transparent',
  },
  operationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    padding: 8,
    borderRadius: 8,
  },
  operationSymbol: {
    fontSize: 32,
    color: '#2A2870',
    marginHorizontal: 8,
  },
  inputButton: {
    minWidth: 60,
    minHeight: 60,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  feedbackContainer: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    opacity: 0.9,
    display: 'none',
  },
  feedbackText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Reactive21;
