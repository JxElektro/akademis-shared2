// src/reactives/reactivesFiles/Reactive18.tsx

import React from 'react';
import { SquareButton } from '../components/SquareButton';
import { ReactiveSchema } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Reactive18Styles, Reactive18Props } from '../types/reactiveTypes';

type SquareButtonState =
  | 'border'
  | 'incomplete'
  | 'empty'
  | 'selected'
  | 'unselected'
  | 'subtraction'
  | 'default'
  | undefined;

const getButtonProps = (
  userResponseStatus: 'pending' | 'correct' | 'incorrect',
  isFocused: boolean
): { state: SquareButtonState; status?: 'correct' | 'incorrect' } => {
  switch (userResponseStatus) {
    case 'correct':
      return { state: 'selected', status: 'correct' };
    case 'incorrect':
      return { state: 'subtraction', status: 'incorrect' };
    case 'pending':
    default:
      return { state: isFocused ? 'selected' : 'unselected' };
  }
};

export const Reactive18: React.FC<Reactive18Props> = ({
  reactive,
  userResponseStatus,
  keyValue,
  setKey,
  inputId,
  isFocused,
  setFocusId,
  themeProps,
  styles = {} as Reactive18Styles,
  containerStyle,
}) => {
  // Generar estilos basados en las props de tema
  const defaultStyles = React.useMemo(() => createStyles(themeProps), [themeProps]);

  if (
    !reactive.assignment ||
    !reactive.assignment.config ||
    !Array.isArray(reactive.assignment.config.content)
  ) {
    return (
      <View style={[defaultStyles.container, styles.container, containerStyle]}>
        <Text style={[defaultStyles.errorText, styles.errorText]}>Error: Datos de asignación faltantes.</Text>
      </View>
    );
  }

  const assignmentContent = reactive.assignment.config.content;

  const operand1 =
    typeof assignmentContent[1]?.text?.response?.[0] === 'string'
      ? assignmentContent[1].text.response[0]
      : String(assignmentContent[1]?.text?.response?.[0] ?? '');

  const signo =
    typeof assignmentContent[2]?.text?.response?.[0] === 'string'
      ? assignmentContent[2].text.response[0]
      : String(assignmentContent[2]?.text?.response?.[0] ?? ' ');

  const operand2 =
    typeof assignmentContent[3]?.text?.response?.[0] === 'string'
      ? assignmentContent[3].text.response[0]
      : String(assignmentContent[3]?.text?.response?.[0] ?? '');

  const isValidOperation =
    operand1 !== '' &&
    operand2 !== '' &&
    ['+', '-', '*', '/'].includes(signo as string);

  const operation = isValidOperation
    ? `${operand1} ${signo} ${operand2}`
    : 'Operación inválida';

  // Obtener feedback visual para los contenedores según el estado
  const getFeedbackStyle = () => {
    if (userResponseStatus === 'correct') {
      return {
        borderColor: themeProps.colors.feedback.success.main,
        borderWidth: 2,
      };
    } else if (userResponseStatus === 'incorrect') {
      return {
        borderColor: themeProps.colors.feedback.error.main,
        borderWidth: 2,
      };
    }
    return {};
  };

  const { state: buttonState, status: buttonStatus } = getButtonProps(userResponseStatus, isFocused);

  const handlePress = () => {
    const newFocus = isFocused ? null : inputId;
    setFocusId(newFocus);
  };

  return (
    <View style={[
      defaultStyles.container, 
      styles.container,
      containerStyle
    ]}>
      <View style={[
        defaultStyles.operationContainer,
        styles.operationContainer,
        // Eliminar el feedback visual del contenedor
      ]}>
        <Text style={[
          defaultStyles.operationText, 
          styles.operationText
        ]}>
          {String(operation)} =
        </Text>
        <SquareButton
          text={keyValue === '' ? ' ' : keyValue}
          state={buttonState}
          status={buttonStatus}
          size="keyboardMedium"
          accessibilityLabel={`Entrada numérica ${inputId}`}
          onPress={handlePress}
          themeProps={themeProps}
          containerStyle={{
            ...(defaultStyles.touchableInput as object),
            ...(isFocused ? defaultStyles.inputContainerFocused : {}),
            ...(styles.touchableInput || {}),
            ...(isFocused && styles.inputContainerFocused ? styles.inputContainerFocused : {}),
            // Mantener solo el feedback visual en el botón
            ...(userResponseStatus === 'correct' ? {
              borderColor: themeProps.colors.feedback.success.main,
              borderWidth: 2,
            } : userResponseStatus === 'incorrect' ? {
              borderColor: themeProps.colors.feedback.error.main,
              borderWidth: 2,
            } : {})
          }}
          testID={`squareButton-${inputId}`}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: ThemeProps) => StyleSheet.create({
  container: {
    width: '100%',
    padding: theme.spacing[5],
    paddingHorizontal: theme.spacing[8],
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Usar todo el espacio disponible
    display: 'flex',
  },
  titleText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing[8],
    textAlign: 'center',
    color: theme.colors.primary.dark,
    display: 'none', // Ocultar el título ya que está en ReactiveContainer
  },
  operationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centrar horizontalmente
    marginBottom: 0, // Eliminar margen inferior
    marginTop: 0, // Eliminar margen superior
    padding: theme.spacing[2],
    borderRadius: theme.borders.radius.md || 8,
  },
  operationText: {
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: 36,
    color: theme.colors.primary.dark,
    marginHorizontal: theme.spacing[4],
  },
  touchableInput: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    minHeight: 60,
    backgroundColor: 'transparent',
    borderWidth: theme.borders.width.normal,
    borderColor: theme.colors.neutral.gray500 || '#6B7280',
  },
  inputContainerFocused: {
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  errorText: {
    color: theme.colors.feedback.error.dark,
    fontSize: theme.typography.fontSize.base,
  },
});

export default Reactive18;
