// src/shared-components/reactives/reactivesFiles/ModalFullImage.tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProps } from '../types';
import { Modal, View, Text, Image, Pressable, StyleSheet } from 'react-native';


interface ModalFullImageProps {
  isVisible: boolean;
  onClose: () => void;
  imageUrl: string;
  themeProps: ThemeProps;
  // Propiedades opcionales para dimensiones
  width?: number;
  height?: number;
}

export const ModalFullImage: React.FC<ModalFullImageProps> = ({ 
  isVisible, 
  onClose, 
  imageUrl,
  themeProps,
  // Usar dimensiones proporcionadas o valores predeterminados
  width: propWidth,
  height: propHeight
}) => {
  const screenWidth = propWidth || 300; // valor predeterminado seguro
  const screenHeight = propHeight || 500; // valor predeterminado seguro
  
  const MODAL_WIDTH = screenWidth * 0.95;
  const MODAL_HEIGHT = screenHeight * 0.95;

  // Crear estilos basados en el tema
  const styles = React.useMemo(() => StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: MODAL_WIDTH,
      height: MODAL_HEIGHT,
      backgroundColor: themeProps.colors.neutral.gray500 || '#000000',
      borderRadius: themeProps.borders.radius.lg,
      padding: themeProps.spacing[5],
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    fullImage: {
      width: '100%',
      height: '100%',
      borderRadius: themeProps.borders.radius.md,
    },
    closeButton: {
      position: 'absolute',
      top: themeProps.spacing[5],
      right: themeProps.spacing[5],
      padding: themeProps.spacing[2],
      borderRadius: themeProps.borders.radius.md,
      backgroundColor: 'rgba(240, 240, 240, 0.7)',
    },
  }), [themeProps, MODAL_WIDTH, MODAL_HEIGHT]);

  if (!isVisible) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Full-size Image */}
          <Image
            source={{ uri: imageUrl }}
            style={styles.fullImage}
            resizeMode="contain"
          />
          {/* Close Button */}
          <Pressable 
            onPress={onClose} 
            style={({ pressed }) => [
              styles.closeButton,
              pressed && { opacity: themeProps.animations?.opacity?.pressed || 0.7 }
            ]} 
            hitSlop={10}
          >
            <Ionicons 
              name="close" 
              size={24} 
              color={themeProps.colors.neutral.white} 
            />
            </Pressable>
        </View>
      </View>
    </Modal>
  );
};
