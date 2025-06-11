// src/shared-components/reactives/reactivesFiles/Reactive58.tsx

import { ModalText } from '../components/ModalText';
import CustomButton from '../components/CustomButton';
import AlternativeButton from '../components/AlternativeButton';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { ReactiveSchema, ResponseMedia } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';
import { Reactive58Props, MappedImage } from '../types/reactiveTypes';

export const Reactive58: React.FC<Reactive58Props> = ({
  reactive,
  responseUser,
  onResponseChange,
  userResponseStatus,
  images,
  themeProps,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const { width, height } = useWindowDimensions();
  
  const assignmentContent = reactive.assignment?.config?.content || [];
  const infoContent = reactive.info?.config?.content || [];
  const textTitle = assignmentContent[1]?.text?.response?.[0] ?? '';
  const textBody = assignmentContent[2]?.text?.response?.[0] ?? '';
  const imageResponse = assignmentContent[3]?.images?.response as ResponseMedia[] | undefined;
  const alternatives = reactive.alternatives?.config?.content?.[0]?.text?.response || [];
  const safeAlternatives: string[] = Array.isArray(alternatives) ? alternatives.map(String) : [];

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setShowAlternatives(true);
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

  const modalTitle = textTitle || 'Sin título';
  const modalBody = textBody;

  return (
    <View style={[styles.container]}>
      <View style={[styles.buttonContainer, { width: '30%', alignSelf: 'center' }]}>
        {!showAlternatives && (
          <CustomButton
            label="Ver Texto"
            onPress={handleOpenModal}
            icon={{
              name: 'play',
              size: 24,
              color: '#FFFFFF',
            }}
            backgroundColor={themeProps.colors.primary.main}
            borderColor={themeProps.colors.primary.dark}
            textColor="#FFFFFF"
            style={{}}
            textStyle={{}}
            themeProps={themeProps}
          />
        )}
      </View>
      {showAlternatives && (
        <View style={[styles.alternativesContainer]}>
          {safeAlternatives.length === 0 ? (
            <View style={[styles.noAlternativesContainer]}>
              <Text style={[styles.noAlternativesText]}>
                No hay alternativas disponibles.
              </Text>
            </View>
          ) : (
            safeAlternatives.map((alt: string) => {
              const isSelected = responseUser.includes(alt);

              return (
                <AlternativeButton
                  key={alt}
                  onPress={() => handleSelectAlternative(alt)}
                  text={alt}
                  isSelected={isSelected}
                  userResponseStatus={userResponseStatus}
                  accessibilityLabel={`Seleccionar alternativa ${alt}`}
                  themeProps={themeProps}
                />
              );
            })
          )}
        </View>
      )}
      <ModalText
        isVisible={modalOpen}
        onClose={handleCloseModal}
        title={String(modalTitle)}
        body={String(modalBody)}
        images={images}
        themeProps={themeProps}
        width={width}
        height={height}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    flex: 1,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  alternativesContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 8,
    borderRadius: 8,
    width: '100%',
  },
  noAlternativesContainer: {
    marginTop: 20,
  },
  noAlternativesText: {
    fontSize: 16,
    color: '#2A2870',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Reactive58;
