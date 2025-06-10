// src/shared-components/reactives/reactivesFiles/Reactive71.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ReactiveSchema, ResponseMedia } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';
import { Reactive71Styles } from '../types/reactiveTypes';
import { ModalFullImage } from '../components/ModalFullImage';
import CustomButton from '../components/CustomButton';
import AlternativeButton from '../components/AlternativeButton';



interface MappedImage {
  id: string;
  url: string;
  quantity: number;
}

interface Reactive71Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (updatedResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  images: MappedImage[];
  themeProps: ThemeProps;
  styles?: any;
  containerStyle?: ViewStyle;
}

export const Reactive71: React.FC<Reactive71Props> = ({
  reactive,
  responseUser,
  onResponseChange,
  userResponseStatus,
  images,
  themeProps,
  styles = {} as Reactive71Styles,
  containerStyle,
}) => {
  // Asegurar que spacing sea un array
  let spacingArray = themeProps.spacing;
  if (!Array.isArray(spacingArray) && typeof spacingArray === 'object' && spacingArray !== null) {
    const spacingObj = spacingArray as Record<string, number>;
    spacingArray = Object.keys(spacingObj)
      .map(Number)
      .sort((a, b) => a - b)
      .map((k: number) => spacingObj[String(k)]);
  }
  
  const [modalOpen, setModalOpen] = React.useState(false);
  const [showAlternatives, setShowAlternatives] = React.useState(false);
  const [showMainTitle, setShowMainTitle] = React.useState(false);

  const assignmentContent = React.useMemo(() => reactive.assignment?.config?.content || [], [
    reactive.assignment?.config?.content,
  ]);

  const infoContent = reactive.info?.config?.content || [];
  const infoDescription = infoContent[0]?.text?.response?.[0] ?? '';
  const mainTitle = assignmentContent[0]?.text?.response?.[0] ?? '';
  const imageResponse = assignmentContent[1]?.images?.response as ResponseMedia[] | undefined;
  const alternatives = reactive.alternatives?.config?.content?.[0]?.text?.response || [];
  const safeAlternatives: string[] = Array.isArray(alternatives)
    ? alternatives.filter((alt): alt is string => typeof alt === 'string').slice(0, 9)
    : [];
  const totalAlternatives = safeAlternatives.length;
  
  // Obtener las respuestas correctas
  const correctResponseData = reactive.alternatives?.config?.content?.[0]?.text?.correctResponse;
  const correctResponses: string[] = Array.isArray(correctResponseData) 
    ? correctResponseData.map(String) 
    : [];

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setShowAlternatives(true);
    setShowMainTitle(true);
  };

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
    if (totalAlternatives === 4) {
      return [
        defaultStyles.twoColumnsRow, 
        styles.twoColumnsRow
      ];
    } else if (totalAlternatives === 5) {
      return index < 1 
        ? [
            defaultStyles.threeColumnsRow, 
            styles.threeColumnsRow
          ]
        : [
            defaultStyles.twoColumnsRow, 
            styles.twoColumnsRow
          ];
    } else if (totalAlternatives === 6) {
      return [
        defaultStyles.threeColumnsRow, 
        styles.threeColumnsRow
      ];
    } else if (totalAlternatives === 7) {
      return index < 2 
        ? [
            defaultStyles.threeColumnsRow, 
            styles.threeColumnsRow
          ]
        : [
            defaultStyles.defaultRow, 
            styles.defaultRow
          ];
    } else if (totalAlternatives === 8) {
      return index < 2 
        ? [
            defaultStyles.threeColumnsRow, 
            styles.threeColumnsRow
          ]
        : [
            defaultStyles.twoColumnsRow, 
            styles.twoColumnsRow
          ];
    } else if (totalAlternatives === 9) {
      return [
        defaultStyles.threeColumnsRow, 
        styles.threeColumnsRow
      ];
    }
    return [
      defaultStyles.defaultRow, 
      styles.defaultRow
    ];
  };

  const getAlternativesRows = () => {
    if (totalAlternatives === 4) {
      return [safeAlternatives.slice(0, 2), safeAlternatives.slice(2)];
    } else if (totalAlternatives === 5) {
      return [safeAlternatives.slice(0, 3), safeAlternatives.slice(3)];
    } else if (totalAlternatives === 6) {
      return [safeAlternatives.slice(0, 3), safeAlternatives.slice(3)];
    } else if (totalAlternatives === 7) {
      return [safeAlternatives.slice(0, 3), safeAlternatives.slice(3, 6), safeAlternatives.slice(6)];
    } else if (totalAlternatives === 8) {
      return [safeAlternatives.slice(0, 3), safeAlternatives.slice(3, 6), safeAlternatives.slice(6)];
    } else if (totalAlternatives === 9) {
      return [safeAlternatives.slice(0, 3), safeAlternatives.slice(3, 6), safeAlternatives.slice(6)];
    }
    return [safeAlternatives];
  };

  const displayedTitle = showMainTitle ? mainTitle : infoDescription;
  const imageUrl = images.length > 0 ? images[0].url : '';

  // Crear los estilos usando useMemo y themeProps
  const defaultStyles = React.useMemo(() => createStyles(themeProps), [themeProps]);

  return (
    <View style={[
      defaultStyles.container, 
      styles.container,
      containerStyle
    ]}>
      <View style={[
        defaultStyles.buttonContainer, 
        styles.buttonContainer
      ]}>
        {images.length > 0 && !showAlternatives ? (
          <CustomButton
            label="Ver Imagen"
            onPress={handleOpenModal}
            icon={{
              name: 'play',
              size: 24,
              color: '#FFFFFF',
            }}
            backgroundColor={themeProps.colors.primary.main}
            borderColor={themeProps.colors.primary.dark}
            textColor="#FFFFFF"
            themeProps={themeProps}
          />
        ) : images.length === 0 && !showAlternatives ? (
          <Text style={[defaultStyles.noImageText, styles.noImageText]}>
            No hay imagen para mostrar.
          </Text>
        ) : null}
      </View>
      {showAlternatives && (
        safeAlternatives.length === 0 ? (
          <View style={[defaultStyles.noAlternativesContainer, styles.noAlternativesContainer]}>
            <Text style={[defaultStyles.noAlternativesText, styles.noAlternativesText]}>
              No hay alternativas disponibles.
            </Text>
          </View>
        ) : (
          <View style={[
            defaultStyles.alternativesContainer,
            styles.alternativesContainer
          ]}>
            {getAlternativesRows().map((row, rowIndex) => (
              <View key={rowIndex} style={getRowStyle(rowIndex)}>
                {row.map((alt) => {
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
                        isCorrectAnswer={isCorrectAnswer}
                        accessibilityLabel={`Seleccionar alternativa ${alt}`}
                        themeProps={themeProps}
                      />
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        )
      )}
      <ModalFullImage isVisible={modalOpen} onClose={handleCloseModal} imageUrl={imageUrl} 
        themeProps={themeProps}
      />
    </View>
  );
};

const createStyles = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      padding: theme.spacing[4],
      alignItems: 'center',
      flex: 1,
      backgroundColor: 'transparent',
    },
    infoTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing[3],
      textAlign: 'center',
      color: theme.colors.primary.dark,
      fontFamily: theme.typography.fontFamily,
    },
    buttonContainer: {
      marginBottom: theme.spacing[5],
      width: '30%',
      alignSelf: 'center',
      alignItems: 'center',
    },
    noImageText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.primary.dark,
      textAlign: 'center',
      fontFamily: theme.typography.fontFamily,
    },
    alternativesContainer: {
      width: '100%',
      backgroundColor: theme.colors.neutral.gray100,
      padding: theme.spacing[2],
      borderRadius: theme.borders.radius.md,
    },
    noAlternativesContainer: {
      marginTop: theme.spacing[5],
    },
    noAlternativesText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.primary.dark,
      textAlign: 'center',
      fontFamily: theme.typography.fontFamily,
    },
    defaultRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: theme.spacing[2],
    },
    twoColumnsRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: theme.spacing[2],
    },
    threeColumnsRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: theme.spacing[2],
    },
    alternativeWrapper: {
      margin: theme.spacing[1],
      flex: 1,
      maxWidth: '33%',
      alignItems: 'center',
    },
  });
};

export default Reactive71;
