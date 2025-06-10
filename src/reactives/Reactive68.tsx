// src/shared-components/reactives/reactivesFiles/Reactive68.tsx
import React from 'react';
import { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

import AlternativeButton from '../components/AlternativeButton';
import { ReactiveSchema } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';
import { Reactive68Styles, Reactive68Props } from '../types/reactiveTypes';


const TextContent: React.FC<{ text: string; wordToUnderline?: string; fontSize: number; textStyle?: TextStyle; underlinedTextStyle?: TextStyle; containerStyle?: ViewStyle; defaultStyles: any }> = ({ 
  text, 
  wordToUnderline, 
  fontSize, 
  textStyle, 
  underlinedTextStyle, 
  containerStyle, 
  defaultStyles
}) => {
  // Si no hay palabra a subrayar, mostrar texto normal
  if (!wordToUnderline) {
    return (
      <View style={[defaultStyles.textContainer, containerStyle]}>
        <Text style={[defaultStyles.titleText, { fontSize }, textStyle]}> {text} </Text>
      </View>
    );
  }

  // Enfoque simplificado para subrayar la palabra
  const markedText = text.replace(
    new RegExp(`(${wordToUnderline})`, 'gi'),
    '___UNDERLINE_START___$1___UNDERLINE_END___'
  );
  const parts = markedText.split('___UNDERLINE_START___');

  return (
    <View style={[defaultStyles.textContainer, containerStyle]}>
      <Text style={[defaultStyles.titleText, { fontSize }, textStyle]}> 
        {parts.map((part, i) => {
          if (i === 0) return part;
          const [underlined, rest] = part.split('___UNDERLINE_END___');
          return (
            <React.Fragment key={i}>
              <Text style={[defaultStyles.underlinedText, underlinedTextStyle]}>{underlined}</Text>
              {rest}
            </React.Fragment>
          );
        })}
      </Text>
    </View>
  );
};

export const Reactive68: React.FC<Reactive68Props> = ({
  reactive,
  responseUser,
  onResponseChange,
  userResponseStatus,
  resetTrigger = 0,
  themeProps,
  styles = {} as Reactive68Styles,
  containerStyle,
  width: propWidth,
  height: propHeight
}) => {
  const [wordToUnderline, setWordToUnderline] = React.useState<string | undefined>(undefined);
  const width = propWidth || 375;
  const height = propHeight || 667;
  
  // Valor fijo para el tamaño de fuente
  const fontSize = {
    title: themeProps.typography.fontSize.xl,
    text: themeProps.typography.fontSize.base
  };
  
  const assignmentContent = React.useMemo(() => reactive.assignment?.config?.content || [], [
    reactive.assignment?.config?.content,
  ]);

  const alternatives = reactive.alternatives?.config?.content?.[0]?.text?.response;
  const safeAlternatives: string[] = Array.isArray(alternatives)
    ? alternatives.filter((alt): alt is string => typeof alt === 'string').slice(0, 4)
    : [];

  // Obtener la lista de respuestas correctas
  const correctResponses: string[] = React.useMemo(() => {
    const correctResponseData = reactive.alternatives?.config?.content?.[0]?.text?.correctResponse;
    if (Array.isArray(correctResponseData)) {
      return correctResponseData.filter((resp): resp is string => typeof resp === 'string');
    }
    return [];
  }, [reactive.alternatives?.config?.content]);

  // Efecto para manejar la palabra a subrayar
  React.useEffect(() => {
    const fetchedWord =
      typeof assignmentContent[2]?.text?.response?.[0] === 'string'
        ? assignmentContent[2].text.response[0]
        : undefined;
    setWordToUnderline(fetchedWord);
  }, [assignmentContent]);

  // Efecto para resetear las respuestas del usuario cuando cambia el reactivo o se fuerza un reset
  React.useEffect(() => {
    // Limpiar las respuestas del usuario cuando:
    // 1. Cambia el reactivo (detectado por cambio en alternatives)
    // 2. Se recibe una señal de resetTrigger
    // 3. El usuario tiene respuestas pero el estado es 'pending'
    if (responseUser.length > 0 && userResponseStatus === 'pending') {
      onResponseChange([]);
    }
  }, [
    // Usamos JSON.stringify del objeto reactive completo como dependencia para detectar cambios
    JSON.stringify(reactive), 
    alternatives, 
    resetTrigger, 
    onResponseChange, 
    userResponseStatus
  ]);

  const handleSelectAlternative = (selectedAlternative: string) => {
    if (userResponseStatus !== 'pending') return;

    if (responseUser.includes(selectedAlternative)) {
      const newResponse = responseUser.filter((alt) => alt !== selectedAlternative);
      onResponseChange(newResponse);
    } else {
      onResponseChange([...responseUser, selectedAlternative]);
    }
  };

  const getRowStyle = (index: number) => {    
    if (safeAlternatives.length === 4) {
      return [defaultStyles.twoColumnsRow, styles.twoColumnsRow];
    }
    return [defaultStyles.defaultRow, styles.defaultRow];
  };

  const getAlternativesRows = () => {    
    if (safeAlternatives.length === 4) {
      return [safeAlternatives.slice(0, 2), safeAlternatives.slice(2)];
    }
    return [safeAlternatives];
  };

  // Crear los estilos usando useMemo y themeProps
  const defaultStyles = useMemo(() => createStyles(themeProps), [themeProps]);

  return (
    <View style={[
      defaultStyles.container, 
      styles.container,
      containerStyle
    ]}>
      <View style={[
        defaultStyles.contentContainer,
        styles.contentContainer
      ]}>
        <TextContent 
          text={assignmentContent[1]?.text?.response?.[0] || ''} 
          wordToUnderline={wordToUnderline} 
          fontSize={fontSize.text} 
          textStyle={styles.titleText}
          underlinedTextStyle={styles.underlinedText}
          containerStyle={styles.textContainer}
          defaultStyles={defaultStyles}
        />
      </View>
      
      {safeAlternatives.length === 0 ? (
        <View style={[defaultStyles.noAlternativesContainer, styles.noAlternativesContainer]}>
          <Text style={[defaultStyles.noAlternativesText, { fontSize: fontSize.text }, styles.noAlternativesText]}>
            No hay alternativas disponibles.
          </Text>
        </View>
      ) : (
        <View style={[
          defaultStyles.alternativesContainer,
          styles.alternativesContainer
        ]}>
          {safeAlternatives.map((alt) => {
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
                  onPress={() => handleSelectAlternative(alt)}
                  text={alt}
                  isSelected={isSelected}
                  userResponseStatus={userResponseStatus}
                  accessibilityLabel={`Seleccionar alternativa ${alt}`}
                  isCorrectAnswer={isCorrectAnswer}
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
const createStyles = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      backgroundColor: 'transparent',
      width: '100%',
      padding: theme.spacing[4],
    },
    contentContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleText: {
      fontWeight: theme.typography.fontWeight.bold,
      textAlign: 'center',
      color: theme.colors.primary.dark,
      fontFamily: theme.typography.fontFamily,
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
    text: {
      textAlign: 'center',
      color: theme.colors.neutral.gray100,
      fontFamily: theme.typography.fontFamily,
      lineHeight: 24,
      paddingVertical: theme.spacing[2],
      flexWrap: 'wrap',
      flexShrink: 1,
    },
    underlinedText: {
      textDecorationLine: 'underline',
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.primary.dark,
      flexShrink: 1,
    },
    alternativesContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing[3],
      width: '100%',
      gap: theme.spacing[3],
    },
    alternativeWrapper: {
      margin: theme.spacing[1],
      flex: 1,
      alignItems: 'stretch',
      minWidth: 120,
      maxWidth: 400,
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
    },
    noAlternativesContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing[4],
    },
    noAlternativesText: {
      color: theme.colors.neutral.gray500,
      fontFamily: theme.typography.fontFamily,
    },
  });
};

export default Reactive68;
