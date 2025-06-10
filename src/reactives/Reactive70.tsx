// src/shared-components/reactives/reactivesFiles/Reactive70.tsx
import React from 'react';
import { SquareButton, ButtonState, ButtonStatus } from '../components/SquareButton';
import { ReactiveSchema } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';
import { Reactive70Styles } from '../types/reactiveTypes';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface Reactive70Props {
  reactive: ReactiveSchema;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  keyValue: string;
  setKey: (value: string) => void;
  inputId: string;
  isFocused: boolean;
  setFocusId: (id: string | null) => void;
  themeProps: ThemeProps;
  styles?: Reactive70Styles;
  containerStyle?: ViewStyle;
}

const getButtonState = (
  userResponseStatus: 'pending' | 'correct' | 'incorrect',
  isFocused: boolean
): { state: ButtonState; status?: ButtonStatus } => {
  if (userResponseStatus === 'correct') return { state: 'selected', status: 'correct' };
  if (userResponseStatus === 'incorrect') return { state: 'subtraction', status: 'incorrect' };
  return { state: isFocused ? 'selected' : 'unselected' };
};

export const Reactive70: React.FC<Reactive70Props> = ({
  reactive,
  userResponseStatus,
  keyValue,
  setKey,
  inputId,
  isFocused,
  setFocusId,
  themeProps,
  styles = {} as Reactive70Styles,
  containerStyle,
}) => {
  
  const assignmentContent = reactive.assignment?.config?.content;
  if (!assignmentContent || !Array.isArray(assignmentContent) || assignmentContent.length < 4) {
    return (
      <View style={[
        defaultStyles.container, 
        styles.container,
        containerStyle
      ]}>
        <Text style={[defaultStyles.errorText, styles.errorText]}>
          Error: Datos de asignación faltantes o incompletos.
        </Text>
      </View>
    );
  }

  const questionTitle = String(assignmentContent[0]?.text?.response?.[0] ?? 'Título no definido');
  const textInitial   = String(assignmentContent[1]?.text?.response?.[0] ?? '');
  const textFinal     = String(assignmentContent[2]?.text?.response?.[0] ?? '');
  const operator      = String(assignmentContent[3]?.text?.response?.[0] ?? '+');

  const inputTypeContent = reactive.correctAlternative?.inputType?.config?.content;
  if (!inputTypeContent || !Array.isArray(inputTypeContent) || inputTypeContent.length < 3) {
    return (
      <View style={[
        defaultStyles.container, 
        styles.container,
        containerStyle
      ]}>
        <Text style={[defaultStyles.errorText, styles.errorText]}>
          Error: Datos de respuesta correcta faltantes o incompletos.
        </Text>
      </View>
    );
  }

  // Acceso seguro a operand1 y operand2
  const getOperand = (item: any) => {
    if (!item) return '';
    if (typeof item.number === 'object' && Array.isArray(item.number?.response)) {
      return String(item.number.response[0] ?? '');
    }
    if (Array.isArray(item.response)) {
      return String(item.response[0] ?? '');
    }
    return '';
  };
  const operand1 = getOperand(inputTypeContent[0]);
  const operand2 = getOperand(inputTypeContent[1]);

  const buttonProps = getButtonState(userResponseStatus, isFocused);

  const handleFocus = () => {
    const newFocus = isFocused ? null : inputId;
    setFocusId(newFocus);
  };

  // Función para obtener estilos de feedback según el estado
  const getFeedbackStyle = () => {
    // Ya no aplicamos feedback visual a los contenedores completos
    return {};
  };

  // Obtener estilo para los botones considerando el feedback
  const getSquareButtonStyle = () => {
    const baseStyle = {
      ...defaultStyles.interactiveSquare,
      ...(isFocused ? defaultStyles.interactiveSquareFocused : {}),
      ...styles.interactiveSquare,
      ...(isFocused ? styles.interactiveSquareFocused : {}),
    };

    if (userResponseStatus === 'correct') {
      return {
        ...baseStyle,
        borderColor: themeProps.colors.feedback.success.main,
        borderWidth: 2,
      };
    } else if (userResponseStatus === 'incorrect') {
      return {
        ...baseStyle,
        borderColor: themeProps.colors.feedback.error.main,
        borderWidth: 2,
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
        defaultStyles.sentenceContainer, 
        styles.sentenceContainer,
        // Ya no aplicamos feedback visual al contenedor
      ]}>
        {textInitial !== '' && (
          <Text style={[
            defaultStyles.sentenceText, 
            styles.sentenceText
          ]}>
            {textInitial}{' '}
          </Text>
        )}
        <SquareButton
          text={keyValue === '' ? ' ' : keyValue}
          state={buttonProps.state}
          status={buttonProps.status}
          size="keyboardMedium"
          onPress={handleFocus}
          accessibilityLabel={`Entrada numérica ${inputId}`}
          testID={`squareButton-${inputId}-1`}
          containerStyle={getSquareButtonStyle()}
          themeProps={themeProps}
        />
        {textFinal !== '' && (
          <Text style={[
            defaultStyles.sentenceText, 
            styles.sentenceText
          ]}>
            {' '}{textFinal}
          </Text>
        )}
      </View>
      <View style={[
        defaultStyles.operationContainer, 
        styles.operationContainer,
        // Ya no aplicamos feedback visual al contenedor
      ]}>
        <Text style={[defaultStyles.operationText, styles.operationText]}>
          {operand1}
        </Text>
        <Text style={[
          defaultStyles.operationText, 
          defaultStyles.operator, 
          { marginHorizontal: 4 },
          styles.operationText,
          styles.operator
        ]}>
          {operator}
        </Text>
        <Text style={[defaultStyles.operationText, styles.operationText]}>
          {operand2}
        </Text>
        <Text style={[
          defaultStyles.operationText, 
          { marginHorizontal: 4 },
          styles.operationText
        ]}>
          =
        </Text>
        <SquareButton
          text={keyValue === '' ? ' ' : keyValue}
          state={buttonProps.state}
          status={buttonProps.status}
          size="keyboardMedium"
          onPress={handleFocus}
          accessibilityLabel={`Entrada numérica ${inputId}`}
          testID={`squareButton-${inputId}-2`}
          containerStyle={getSquareButtonStyle()}
          themeProps={themeProps}
        />
      </View>
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    flex: 1, // Usar todo el espacio disponible
    display: 'flex',
    justifyContent: 'center', // Centrar verticalmente
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2A2870',
    marginBottom: 20,
    textAlign: 'center',
    display: 'none', // Ocultar el título ya que está en ReactiveContainer
  },
  sentenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sentenceText: {
    fontSize: 20,
    color: '#2A2870',
  },
  operationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  operationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A2870',
    marginHorizontal: 4,
  },
  operator: {
    color: '#8287FF',
  },
  interactiveSquare: {
    minWidth: 60,
    minHeight: 60,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F4F4FF',
    borderWidth: 1.5,
    borderColor: '#8287FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interactiveSquareFocused: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default Reactive70;
