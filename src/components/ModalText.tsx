import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Modal, View, Text, Image, Pressable, StyleSheet, ScrollView } from 'react-native';
import { ModalTextProps } from '../types/componentTypes';

export const ModalText: React.FC<ModalTextProps> = ({ 
  isVisible, 
  onClose, 
  title, 
  body, 
  images,
  themeProps,
  width: propWidth,
  height: propHeight
}) => {
  const screenWidth = propWidth || 375;
  const screenHeight = propHeight || 667;
  
  const MODAL_WIDTH = screenWidth * 0.9;
  const MODAL_HEIGHT = screenHeight * 0.8;
  const IMAGE_SIZE = MODAL_WIDTH * 0.3;

  const styles = React.useMemo(() => StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: MODAL_WIDTH,
      maxHeight: MODAL_HEIGHT,
      backgroundColor: themeProps.colors.neutral.white,
      borderRadius: themeProps.borders.radius.lg,
      paddingVertical: themeProps.spacing[6],
      paddingHorizontal: themeProps.spacing[5],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: themeProps.spacing[5],
      paddingHorizontal: themeProps.spacing[1],
    },
    titleContainer: {
      flex: 1,
      paddingRight: themeProps.spacing[10],
      justifyContent: 'center',
      marginTop: themeProps.spacing[5],
    },
    modalTitle: {
      fontSize: themeProps.typography.fontSize.xl || 28,
      fontWeight: themeProps.typography.fontWeight.bold,
      color: themeProps.colors.primary.dark,
      textAlign: 'center',
      lineHeight: 36,
    },
    closeButton: {
      position: 'absolute',
      right: 0,
      padding: themeProps.spacing[2],
      borderRadius: themeProps.borders.radius.md,
      backgroundColor: themeProps.colors.neutral.gray100,
    },
    closeButtonPressed: {
      opacity: themeProps.animations?.opacity?.pressed || 0.7,
      transform: [{ scale: 0.98 }],
    },
    bodyContainer: {
      flexGrow: 1,
    },
    contentWrapper: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'flex-start',
    },
    textSection: {
      flex: 0.75,
      paddingHorizontal: themeProps.spacing[6],
      marginBottom: themeProps.spacing[5],
      marginTop: themeProps.spacing[5],
    },
    fullWidth: {
      flex: 1,
      paddingRight: 0,
    },
    modalText: {
      fontSize: themeProps.typography.fontSize.xl,
      color: themeProps.colors.neutral.gray500,
      lineHeight: 28,
      fontWeight: themeProps.typography.fontWeight.bold,
      textAlign: 'justify',
    },
    imagesSection: {
      flex: 0.25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageContainer: {
      marginBottom: themeProps.spacing[3],
      width: '100%',
      alignItems: 'center',
    },
    imageWrapper: {
      marginVertical: themeProps.spacing[1],
      borderRadius: themeProps.borders.radius.md,
      overflow: 'hidden',
      backgroundColor: themeProps.colors.neutral.gray100,
    },
    image: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      borderRadius: themeProps.borders.radius.md,
    },
  }), [themeProps, MODAL_WIDTH, MODAL_HEIGHT, IMAGE_SIZE]);

  if (!isVisible) return null;

  const hasImages = (images?.length || 0) > 0;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.modalTitle} numberOfLines={2} adjustsFontSizeToFit>
                {title}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && { opacity: themeProps.animations?.opacity?.pressed || 0.7 }
              ]}
              hitSlop={12}
            >
              <Ionicons name="close" size={24} color={themeProps.colors.primary.dark} />
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={styles.bodyContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.contentWrapper}>
              <View style={[styles.textSection, !hasImages && styles.fullWidth]}>
                <Text style={styles.modalText}>{body}</Text>
              </View>
              {hasImages && (
                <View style={styles.imagesSection}>
                  {(images || []).map(img => (
                    <View key={img.id} style={styles.imageContainer}>
                      {Array.from({ length: img.quantity }).map((_, idx) => (
                        <View key={`${img.id}-${idx}`} style={styles.imageWrapper}>
                          <Image
                            source={{ uri: img.url }}
                            style={styles.image}
                            resizeMode="cover"
                          />
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
