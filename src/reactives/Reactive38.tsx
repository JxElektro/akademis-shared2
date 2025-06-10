// src/reactives/reactivesFiles/Reactive38.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, Image, ScrollView, Platform } from 'react-native';
import { DraxProvider, DraxView } from 'react-native-drax';
import { ReactiveSchema, Reactive38Styles, ThemeProps } from '../types';

interface MappedImage {
  id: string;
  url: string;
}

interface Reactive38Props {
  reactive: ReactiveSchema;
  images: MappedImage[];
  responseUser: string[];
  onResponseChange: (newResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  resetTrigger?: number;
  themeProps: ThemeProps;
  styles?: Reactive38Styles;
  containerStyle?: ViewStyle;
  screenWidth?: number;
}

// Componente para entornos web usando HTML5 Drag and Drop API
const WebImage = ({ id, url, onDragStart, isDraggable }: { 
  id: string; 
  url: string; 
  onDragStart: (id: string) => void;
  isDraggable: boolean;
}) => {
  if (typeof window === 'undefined' || !window.document) return null;
  
  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', id);
        onDragStart(id);
      }}
      style={{
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDraggable ? 'grab' : 'default',
        opacity: isDraggable ? 1 : 0.7,
        boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease',
      }}
    >
      <img
        src={url}
        alt={`Imagen ${id}`}
        style={{
          width: '90%',
          height: '90%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

// Componente de zona para soltar para entornos web
const WebDropZone = ({ 
  index, 
  onDrop, 
  imageId, 
  imageUrl,
  isEmpty,
  isDraggingOver, 
  isActive = true 
}: { 
  index: number; 
  onDrop: (index: number, id: string) => void;
  imageId?: string;
  imageUrl?: string;
  isEmpty: boolean;
  isDraggingOver?: boolean;
  isActive?: boolean;
}) => {
  if (typeof window === 'undefined' || !window.document) return null;
  
  return (
    <div
      onDragOver={(e) => {
        if (isActive) {
          e.preventDefault();
          e.currentTarget.classList.add('dragover');
        }
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove('dragover');
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        if (isActive) {
          const id = e.dataTransfer.getData('text/plain');
          onDrop(index, id);
        }
      }}
      style={{
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: isDraggingOver ? '#3366FF' : '#ccc',
        borderStyle: 'solid',
        backgroundColor: isEmpty ? '#f0f0f0' : 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isDraggingOver ? '0px 0px 8px rgba(51, 102, 255, 0.5)' : '0px 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
      }}
      className="dropzone"
    >
      {isEmpty ? (
        <span style={{ 
          fontSize: 24, 
          color: '#aaa', 
          fontWeight: 'bold' 
        }}>?</span>
      ) : (
        <img
          src={imageUrl}
          alt={`Imagen ${imageId}`}
          style={{
            width: '90%',
            height: '90%',
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  );
};

export const Reactive38: React.FC<Reactive38Props> = ({
  reactive,
  images = [],
  responseUser,
  onResponseChange,
  userResponseStatus,
  resetTrigger = 0,
  themeProps,
  styles = {} as Reactive38Styles,
  containerStyle,
  screenWidth,
}) => {
  // Detectar si estamos en entorno web
  const isWeb = typeof window !== 'undefined' && window.document;
  
  // Usar el ancho proporcionado o valor predeterminado
  const width = screenWidth || 375; // valor predeterminado seguro
  const CARD_SIZE = Math.min(width * 0.15, 110);
  // Crear estilos con themeProps
  const defaultStyles = React.useMemo(() => createStyles(themeProps), [themeProps]);

  // Depuración de imágenes recibidas
  // React.useEffect(() => {
  //   console.log('Reactive38: Imágenes recibidas:', JSON.stringify(images, null, 2));
  // }, [images]);

  const correctImages = React.useMemo(() => {
    const filtered = images
      .filter((img: MappedImage) => img.id && img.url)
      .slice(0, 6); // Se mantiene el límite de 6 imágenes si es necesario
    // console.log('Reactive38: Imágenes filtradas correctamente:', JSON.stringify(filtered, null, 2));
    return filtered;
  }, [images]);

  const [memorizing, setMemorizing] = React.useState(true);
  const [placed, setPlaced] = React.useState<string[]>([]);
  const [shuffled, setShuffled] = React.useState<Array<{ id: string; url: string }>>([]);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);

  const prevImagesRef = React.useRef<string[]>([]);
  const prevResetRef = React.useRef<number>(0);

  React.useEffect(() => {
    const imagesIds = correctImages.map((img) => img.id).join('|');
    const prevImagesIds = prevImagesRef.current.join('|');
    const imagesChanged = imagesIds !== prevImagesIds;
    const resetChanged = resetTrigger !== prevResetRef.current;

    if (!imagesChanged && !resetChanged) {
      return;
    }
    prevImagesRef.current = correctImages.map((img) => img.id);
    prevResetRef.current = resetTrigger;

    // console.log('Reactive38: Inicializando con imágenes:', correctImages.length);
    
    setMemorizing(true);
    setPlaced(correctImages.map((img) => img.id));
    setShuffled([]);
  }, [correctImages, resetTrigger]);

  const shuffleArray = (arr: any[]) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const handleStart = () => {
    // console.log('Reactive38: Iniciando juego con imágenes:', correctImages.length);
    setMemorizing(false);
    const shuffledImgs = shuffleArray(correctImages);
    setShuffled(shuffledImgs);
    setPlaced(Array.from({ length: correctImages.length }, () => ''));
    onResponseChange([]);
  };

  const handleDrop = (index: number, draggedId: string) => {
    if (userResponseStatus !== 'pending') return;
    // console.log('Reactive38: Recibiendo drop en posición', index, 'con id', draggedId);
    
    const newPlaced = [...placed];
    const oldId = newPlaced[index];
    if (oldId) {
      const oldImg = correctImages.find((img) => img.id === oldId);
      if (oldImg) {
        // console.log('Reactive38: Devolviendo imagen a la bandeja:', oldId);
        setShuffled((prev) => [...prev, oldImg]);
      }
    }
    newPlaced[index] = draggedId;
    setPlaced(newPlaced);
    setShuffled((prev) => prev.filter((img) => img.id !== draggedId));
    const finalArr = newPlaced.filter((val) => val !== '');
    // console.log('Reactive38: Nuevo estado de respuesta:', finalArr);
    onResponseChange(finalArr);
    setDraggingId(null);
  };

  const handleDragStart = (id: string) => {
    // console.log('Reactive38: Iniciando arrastre de imagen:', id);
    setDraggingId(id);
  };

  const renderNativeVersion = () => {
    const renderTopSlot = (idValue: string, index: number) => {
      let displayedUrl: string | null = null;
      if (memorizing) {
        const found = correctImages[index];
        if (found) displayedUrl = found.url;
      } else {
        if (idValue) {
          const found = correctImages.find((img) => img.id === idValue);
          if (found) displayedUrl = found.url;
        }
      }
      const isEmpty = !displayedUrl;
      
      // if (isEmpty) {
      //   console.log('Reactive38: Renderizando slot vacío en posición', index);
      // } else {
      //   console.log('Reactive38: Renderizando imagen en slot', index, 'con URL:', displayedUrl?.substring(0, 30) + '...');
      // }
      
      return (
        <DraxView
          key={`top-${index}`}
          style={[
            defaultStyles.dropZone, 
            styles.dropZone,
            { width: CARD_SIZE, height: CARD_SIZE }
          ]}
          receivingStyle={[
            defaultStyles.dropZoneActive, 
            styles.dropZoneActive
          ]}
          onReceiveDragDrop={(event: any) => {
            if (userResponseStatus === 'pending') {
              // console.log('Reactive38: onReceiveDragDrop llamado con evento:', event?.dragged?.payload?.id);
              const payload = event.dragged.payload;
              handleDrop(index, payload.id);
            }
          }}
        >
          <View style={[defaultStyles.dropContent, styles.dropContent]}>
            {isEmpty ? (
              <Text style={[defaultStyles.placeholder, styles.placeholder]}>?</Text>
            ) : (
              <Image 
                source={{ uri: displayedUrl || '' }} 
                style={[defaultStyles.image, styles.image]} 
                resizeMode="contain" 
                // onError={(e) => console.error('Reactive38: Error al cargar imagen:', e.nativeEvent.error, displayedUrl)}
                // onLoad={() => console.log('Reactive38: Imagen cargada correctamente en slot', index)}
              />
            )}
          </View>
        </DraxView>
      );
    };

    const renderBottomImages = () => {
      // console.log('Reactive38: Renderizando', shuffled.length, 'imágenes en la bandeja inferior');
      
      return (
        <ScrollView
          horizontal
          style={[defaultStyles.scrollRow, styles.scrollRow]}
          contentContainerStyle={[defaultStyles.scrollContentContainer, styles.scrollContentContainer]}
        >
          <View style={[defaultStyles.draggableRow, styles.draggableRow]}>
            {shuffled.map((img, idx) => (
              <DraxView
                key={`drag-${img.id}-${idx}`}
                style={[
                  defaultStyles.draggableBox, 
                  styles.draggableBox,
                  { width: CARD_SIZE, height: CARD_SIZE }
                ]}
                dragPayload={img}
                draggable={userResponseStatus === 'pending'}
                draggingStyle={[defaultStyles.dragging, styles.dragging]}
                dragReleasedStyle={[defaultStyles.dragging, styles.dragging]}
              >
                <Image 
                  source={{ uri: img.url }} 
                  style={[defaultStyles.image, styles.image]} 
                  resizeMode="contain" 
                  // onError={(e) => console.error('Reactive38: Error al cargar imagen arrastrable:', e.nativeEvent.error, img.url)}
                  // onLoad={() => console.log('Reactive38: Imagen arrastrable cargada correctamente:', img.id)}
                />
              </DraxView>
            ))}
          </View>
        </ScrollView>
      );
    };

    return (
      <DraxProvider>
        <View style={[
          defaultStyles.container, 
          styles.container,
          containerStyle
        ]}>
          <View style={[
            defaultStyles.topRow, 
            styles.topRow
          ]}>
            {placed.map((val, i) => renderTopSlot(val, i))}
          </View>
          {memorizing && (
            <Pressable 
              style={[
                defaultStyles.startButton, 
                styles.startButton
              ]} 
              onPress={handleStart}
            >
              <Text style={[defaultStyles.startText, styles.startText]}>Comenzar</Text>
            </Pressable>
          )}
          {!memorizing && (
            <View style={[
              defaultStyles.bottomContainer, 
              styles.bottomContainer
            ]}>
              {renderBottomImages()}
            </View>
          )}
        </View>
      </DraxProvider>
    );
  };

  const renderWebVersion = () => {
    // Renderizar versión web del componente
    return (
      <div style={{ 
        padding: 16, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}>
        {/* Área de slots para colocar imágenes */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          marginBottom: 16
        }}>
          {placed.map((id, index) => {
            let url = '';
            let isEmpty = true;
            
            if (memorizing) {
              const found = correctImages[index];
              if (found) {
                url = found.url;
                isEmpty = false;
              }
            } else if (id) {
              const found = correctImages.find(img => img.id === id);
              if (found) {
                url = found.url;
                isEmpty = false;
              }
            }
            
            return (
              <WebDropZone
                key={`slot-${index}`}
                index={index}
                onDrop={(idx, id) => handleDrop(idx, id)}
                imageId={id}
                imageUrl={url}
                isEmpty={isEmpty}
                isDraggingOver={draggingId !== null}
                isActive={userResponseStatus === 'pending' && !memorizing}
              />
            );
          })}
        </div>
        
        {/* Botón de comenzar o imágenes arrastrables */}
        {memorizing ? (
          <button
            onClick={handleStart}
            style={{
              marginTop: 20,
              padding: '8px 24px',
              backgroundColor: themeProps.colors.primary.main,
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Comenzar
          </button>
        ) : (
          <div style={{ 
            width: '100%', 
            overflowX: 'auto',
            marginTop: 16
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              justifyContent: 'center'
            }}>
              {shuffled.map((img) => (
                <WebImage
                  key={`drag-${img.id}`}
                  id={img.id}
                  url={img.url}
                  onDragStart={handleDragStart}
                  isDraggable={userResponseStatus === 'pending'}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* CSS para las animaciones de arrastre */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .dropzone.dragover {
              border-color: ${themeProps.colors.primary.main} !important;
              box-shadow: 0 0 8px ${themeProps.colors.primary.main}80 !important;
              transform: scale(1.05);
            }
          `
        }} />
      </div>
    );
  };

  // Si no hay imágenes, mostrar mensaje
  if (correctImages.length === 0) {
    return (
      <View style={[defaultStyles.container, styles.container, containerStyle]}>
        <Text style={[defaultStyles.warningText]}>
          No se pudieron cargar las imágenes. Por favor, intenta de nuevo.
        </Text>
      </View>
    );
  }

  // Renderizar versión web o nativa según el entorno
  return isWeb ? renderWebVersion() : renderNativeVersion();
};

const createStyles = (theme: ThemeProps) => StyleSheet.create({
  container: {
    padding: theme.spacing[4],
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing[5],
    textAlign: 'center',
    color: theme.colors.primary.dark,
  },
  topRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  dropZone: {
    margin: theme.spacing[2],
    borderRadius: theme.borders.radius.md,
    borderWidth: theme.borders.width.normal,
    borderColor: theme.colors.neutral.gray300,
    backgroundColor: theme.colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropZoneActive: {
    borderColor: theme.colors.primary.light,
    borderWidth: theme.borders.width.medium,
  },
  dropContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: (theme.typography.fontSize as any)['2xl'] || 30,
    color: theme.colors.neutral.gray300,
    fontWeight: theme.typography.fontWeight.bold,
  },
  startButton: {
    marginTop: theme.spacing[5],
    paddingHorizontal: theme.spacing[8],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.borders.radius.md,
    backgroundColor: theme.colors.primary.main,
  },
  startText: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
  },
  bottomContainer: {
    width: '100%',
    marginTop: theme.spacing[3],
  },
  scrollRow: {
    width: '100%',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draggableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  draggableBox: {
    marginHorizontal: theme.spacing[1],
    borderRadius: theme.borders.radius.md,
    borderWidth: theme.borders.width.normal,
    borderColor: theme.colors.neutral.gray300,
    backgroundColor: theme.colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragging: {
    opacity: theme.animations.opacity.pressed,
  },
  image: {
    width: '90%',
    height: '90%',
  },
  warningText: {
    color: theme.colors.feedback.error.main,
    fontSize: theme.typography.fontSize.lg,
    textAlign: 'center',
    padding: theme.spacing[4],
  }
});

export default Reactive38;
