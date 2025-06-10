// src/reactives/reactivesFiles/Reactive42.tsx
import React from 'react';
import { DraxProvider, DraxView } from 'react-native-drax';
import { ReactiveSchema } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';
import { Reactive42Styles } from '../types/reactiveTypes'; // debe traerse desde reactiveTypes
import { View as RNView, Text as RNText, StyleSheet, ViewStyle, ScrollView as RNScrollView } from 'react-native';

// Solución para el conflicto de tipos ReactNode
const View = RNView as React.ComponentType<any>;
const Text = RNText as React.ComponentType<any>;
const ScrollView = RNScrollView as React.ComponentType<any>;

// ================================================
// COMPONENTE WEB: SÍLABA ARRASTRABLE
// ================================================
const WebSyllable = ({ 
  id, 
  text, 
  onDragStart, 
  isDraggable,
  theme,
  feedbackColor
}: { 
  id: string; 
  text: string; 
  onDragStart: (id: string) => void;
  isDraggable: boolean;
  theme: ThemeProps;
  feedbackColor: string;
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
        width: 90,
        height: 90,
        margin: 8,
        borderRadius: 12,
        border: `1px solid ${feedbackColor}`,
        backgroundColor: theme.colors.neutral.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDraggable ? 'grab' : 'default',
        opacity: isDraggable ? 1 : 0.6,
        boxShadow: '0px 2px 6px rgba(130, 135, 255, 0.15)',
        transition: 'all 0.2s ease',
        fontSize: '16px',
        fontWeight: '600',
        color: feedbackColor,
        transform: isDraggable ? 'scale(1)' : 'scale(0.95)',
      }}
      onMouseEnter={(e) => {
        if (isDraggable) {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0px 4px 8px rgba(130, 135, 255, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (isDraggable) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0px 2px 6px rgba(130, 135, 255, 0.15)';
        }
      }}
    >
      {text}
    </div>
  );
};

// ================================================
// COMPONENTE WEB: ZONA DE DROP
// ================================================
const WebDropZone = ({ 
  index, 
  onDrop, 
  syllableText,
  isEmpty,
  isDraggingOver, 
  isActive = true,
  theme,
  feedbackColor
}: { 
  index: number; 
  onDrop: (index: number, id: string) => void;
  syllableText?: string;
  isEmpty: boolean;
  isDraggingOver?: boolean;
  isActive?: boolean;
  theme: ThemeProps;
  feedbackColor: string;
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
        width: 90,
        height: 90,
        margin: 8,
        borderRadius: 12,
        border: `2px dashed ${isEmpty ? '#E0E0E0' : feedbackColor}`,
        backgroundColor: isEmpty ? '#F8F9FF' : feedbackColor,
        color: isEmpty ? '#A1A1A1' : theme.colors.neutral.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isEmpty 
          ? '0px 2px 4px rgba(0,0,0,0.05)'
          : '0px 2px 6px rgba(130, 135, 255, 0.25)',
        transition: 'all 0.2s ease',
        fontSize: isEmpty ? '24px' : '16px',
        fontWeight: '600',
      }}
      className="dropzone"
    >
      {isEmpty ? '?' : syllableText}
    </div>
  );
};

interface Reactive42Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (newResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  resetTrigger?: number;
  themeProps: ThemeProps;
  styles?: Reactive42Styles;
  containerStyle?: ViewStyle;
  screenWidth?: number;
}

export const Reactive42: React.FC<Reactive42Props> = ({
  reactive,
  responseUser,
  onResponseChange,
  userResponseStatus,
  resetTrigger = 0,
  themeProps,
  styles = {} as Reactive42Styles,
  containerStyle,
  screenWidth,
}) => {
  // ================================================
  // DETECTAR ENTORNO WEB
  // ================================================
  const isWeb = typeof window !== 'undefined' && window.document;

  // ================================================
  // DEBUG: Verificar datos de entrada
  // ================================================
  console.log('[Reactive42] Props recibidas:', {
    userResponseStatus,
    syllablesLength: reactive?.correctAlternative?.inputType?.config?.content?.length || 0,
    resetTrigger,
    isWeb
  });

  // ================================================
  // CONFIGURACIÓN INICIAL Y ESTILOS
  // ================================================
  
  // Crear estilos con themeProps mejorados
  const defaultStyles = React.useMemo(() => createStyles(themeProps), [themeProps]);
  
  // Sistema responsive para el tamaño de tarjetas
  const width = screenWidth || 375;
  const CARD_SIZE = React.useMemo(() => {
    if (width >= 1024) return 100; // Desktop
    if (width >= 768) return 90;   // Tablet
    return 80;                     // Phone
  }, [width]);
  
  // ================================================
  // PROCESAMIENTO DE DATOS DE SÍLABAS
  // ================================================
  
  // Extraer sílabas del reactive - RUTA CORREGIDA PARA REACTIVO DE ORDEN
  const rawContent = reactive?.correctAlternative?.inputType?.config?.content || [];
  const syllables = React.useMemo(() => {
    return rawContent
      .map((elem: any, idx: number) => {
        const resp = elem?.text?.response;
        const textValue = Array.isArray(resp) && resp[0] ? resp[0] : '';
        return { id: `${textValue}-${idx}`, text: textValue };
      })
      .filter((item: { id: string; text: string }) => item.text !== '');
  }, [rawContent]);

  console.log('[Reactive42] Sílabas procesadas:', syllables);
  
  // ================================================
  // ESTADO DEL COMPONENTE
  // ================================================
  
  // Estado: sílabas colocadas en las zonas de drop
  const [placed, setPlaced] = React.useState<string[]>([]);
  // Estado: sílabas disponibles para arrastrar (desordenadas)
  const [shuffled, setShuffled] = React.useState<Array<{ id: string; text: string }>>([]);
  // Referencias para detectar cambios
  const prevSyllablesRef = React.useRef<string[]>([]);
  const prevResetRef = React.useRef<number>(0);
  // Estado para seguimiento de arrastre en web
  const [draggingId, setDraggingId] = React.useState<string | null>(null);

  console.log('[Reactive42] Estado shuffled:', shuffled);
  console.log('[Reactive42] Estado placed:', placed);

  // ================================================
  // EFECTOS Y LÓGICA DE INICIALIZACIÓN
  // ================================================
  
  React.useEffect(() => {
    const syllablesIds = syllables.map((s) => s.id).join('|');
    const prevSyllablesIds = prevSyllablesRef.current.join('|');
    const hasSyllablesChanged = syllablesIds !== prevSyllablesIds;
    const hasResetChanged = resetTrigger !== prevResetRef.current;
    if (!hasSyllablesChanged && !hasResetChanged) return;
    prevSyllablesRef.current = syllables.map((s) => s.id);
    prevResetRef.current = resetTrigger;
    setShuffled(shuffleArray(syllables));
    setPlaced(Array.from({ length: syllables.length }, () => ''));
    onResponseChange([]);
  }, [syllables, resetTrigger, onResponseChange]);

  // ================================================
  // FUNCIÓN: DESORDENAR ARRAY
  // ================================================
  const shuffleArray = (arr: any[]) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // ================================================
  // FUNCIÓN: MANEJAR DROP DE SÍLABAS
  // ================================================
  const handleDrop = (index: number, draggedId: string) => {
    if (userResponseStatus !== 'pending') return;
    console.log('[Reactive42] Drop en índice', index, 'con ID', draggedId);
    
    const newPlaced = [...placed];
    const oldId = newPlaced[index];
    
    // Si ya había una sílaba en esa posición, regresarla a la zona de arrastrar
    if (oldId) {
      const oldItem = syllables.find((s) => s.id === oldId);
      if (oldItem) {
        setShuffled((prev) => [...prev, oldItem]);
      }
    }
    
    // Colocar la nueva sílaba en la posición
    newPlaced[index] = draggedId;
    setPlaced(newPlaced);
    
    // Remover la sílaba de la zona de arrastrar
    setShuffled((prev) => prev.filter((s) => s.id !== draggedId));
    
    // Actualizar respuesta del usuario
    const finalArr = newPlaced.map((itemId) => {
      const found = syllables.find((s) => s.id === itemId);
      return found ? found.text : '';
    });
    onResponseChange(finalArr);
    setDraggingId(null);
  };

  const handleDragStart = (id: string) => {
    console.log('[Reactive42] Iniciando arrastre de:', id);
    setDraggingId(id);
  };

  // ================================================
  // OBTENER TÍTULO DE LA PREGUNTA
  // ================================================
  const title = reactive?.assignment?.config?.content?.[0]?.text?.response?.[0] || 'Ordena las sílabas para formar la palabra';

  // ================================================
  // VERSIÓN WEB DEL COMPONENTE
  // ================================================
  const renderWebVersion = () => {
    const feedbackColor = getFeedbackColor();
    
    return (
      <div style={{ 
        padding: 24, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',
        minHeight: '100%',
        backgroundColor: 'transparent',
      }}>
        
        {/* Zona de drop - slots superiores simplificada */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          marginBottom: 32,
          padding: 16,
          borderRadius: 16,
          backgroundColor: 'rgba(130, 135, 255, 0.05)', // Muy sutil
          ...getFeedbackStyle(),
        }}>
          {placed.map((id, index) => {
            const found = syllables.find(s => s.id === id);
            const syllableText = found ? found.text : '';
            const isEmpty = !found;
            
            return (
              <WebDropZone
                key={`slot-${index}`}
                index={index}
                onDrop={handleDrop}
                syllableText={syllableText}
                isEmpty={isEmpty}
                isDraggingOver={draggingId !== null}
                isActive={userResponseStatus === 'pending'}
                theme={themeProps}
                feedbackColor={feedbackColor}
              />
            );
          })}
        </div>
        
        {/* Separador simple */}
        <div style={{ 
          height: 2, 
          backgroundColor: feedbackColor,
          width: '40%', 
          margin: '16px 0',
          borderRadius: 1,
          opacity: 0.3,
        }} />
        
        {/* Sílabas arrastrables - zona inferior simplificada */}
        <div style={{ 
          width: '100%', 
          padding: 16,
          borderRadius: 16,
          backgroundColor: 'rgba(130, 135, 255, 0.05)', // Mismo sutil que arriba
          ...getFeedbackStyle(),
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {shuffled.map((item) => (
              <WebSyllable
                key={`drag-${item.id}`}
                id={item.id}
                text={item.text}
                onDragStart={handleDragStart}
                isDraggable={userResponseStatus === 'pending'}
                theme={themeProps}
                feedbackColor={feedbackColor}
              />
            ))}
          </div>
        </div>
        
        {/* CSS simplificado para las animaciones */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .dropzone.dragover {
              border-color: ${feedbackColor} !important;
              box-shadow: 0 0 12px ${feedbackColor}40 !important;
              transform: scale(1.05) !important;
            }
            
            .dropzone {
              transition: all 0.2s ease !important;
            }
          `
        }} />
      </div>
    );
  };

  // ================================================
  // VERSIÓN NATIVA DEL COMPONENTE
  // ================================================
  const renderNativeVersion = () => {
    const feedbackStyle = getFeedbackStyle();
    const feedbackColor = getFeedbackColor();
    
    return (
      <DraxProvider>
        <View style={[
          defaultStyles.container, 
          styles.container,
          containerStyle,
        ]}>

          {/* Zona de drop - slots superiores */}
          <View style={[
            defaultStyles.dropSection,
            feedbackStyle
          ]}>
            <View style={[defaultStyles.topRow, styles.topRow]}>
              {placed.map((val, i) => (
                <DraxView
                  key={`top-${i}`}
                  style={[
                    defaultStyles.dropZone, 
                    defaultStyles.dropZoneFilled,
                    styles.dropZone,
                    styles.dropZoneFilled,
                    { 
                      width: CARD_SIZE, 
                      height: CARD_SIZE,
                      borderColor: val ? feedbackColor : '#E0E0E0',
                      backgroundColor: val ? feedbackColor : '#F8F9FF',
                    }
                  ]}
                  receivingStyle={[
                    defaultStyles.dropZoneActive, 
                    defaultStyles.dropZoneFilledActive,
                    styles.dropZoneActive, 
                    styles.dropZoneFilledActive,
                    { borderColor: feedbackColor }
                  ]}
                  onReceiveDragDrop={(event: any) => {
                    if (userResponseStatus === 'pending') {
                      const payload = event.dragged.payload;
                      handleDrop(i, payload.id);
                    }
                  }}
                >
                  <View style={[defaultStyles.dropContent]}>
                    {val ? (
                      <Text style={[
                        defaultStyles.syllableText, 
                        defaultStyles.dropZoneFilledText,
                        styles.syllableText, 
                        styles.dropZoneFilledText
                      ]}>
                        {val}
                      </Text>
                    ) : (
                      <Text style={[defaultStyles.placeholder, styles.placeholder]}>?</Text>
                    )}
                  </View>
                </DraxView>
              ))}
            </View>
          </View>

          {/* Separador simple */}
          <View style={[
            defaultStyles.separator,
            { backgroundColor: feedbackColor }
          ]} />

          {/* Sílabas arrastrables - zona inferior */}
          <View style={[
            defaultStyles.bottomSection,
            feedbackStyle
          ]}>
            <View style={[defaultStyles.bottomContainer, styles.bottomContainer]}>
              <ScrollView
                horizontal
                style={[defaultStyles.scrollRow, styles.scrollRow]}
                contentContainerStyle={[defaultStyles.scrollContentContainer, styles.scrollContentContainer]}
                showsHorizontalScrollIndicator={false}
              >
                <View style={[defaultStyles.draggableRow, styles.draggableRow]}>
                  {shuffled.map((item, idx) => (
                    <DraxView
                      key={`drag-${item.id}-${idx}`}
                      style={[
                        defaultStyles.draggableBox, 
                        styles.draggableBox,
                        { 
                          width: CARD_SIZE, 
                          height: CARD_SIZE,
                          borderColor: feedbackColor,
                        }
                      ]}
                      dragPayload={item}
                      draggable={userResponseStatus === 'pending'}
                      draggingStyle={[defaultStyles.dragging, styles.dragging]}
                      dragReleasedStyle={[defaultStyles.dragging, styles.dragging]}
                    >
                      <Text style={[
                        defaultStyles.draggableBoxText, 
                        styles.draggableBoxText,
                        { color: feedbackColor }
                      ]}>
                        {item.text}
                      </Text>
                    </DraxView>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </DraxProvider>
    );
  };

  // ================================================
  // FUNCIÓN: OBTENER ESTILOS DE FEEDBACK VISUAL
  // ================================================
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

  const getFeedbackColor = () => {
    if (userResponseStatus === 'correct') {
      return themeProps.colors.feedback.success.main;
    } else if (userResponseStatus === 'incorrect') {
      return themeProps.colors.feedback.error.main;
    }
    return themeProps.colors.primary.light;
  };

  // ================================================
  // RENDERIZADO PRINCIPAL - SELECCIÓN DE VERSIÓN
  // ================================================
  return isWeb ? renderWebVersion() : renderNativeVersion();
};

export default Reactive42;

const createStyles = (theme: ThemeProps) => StyleSheet.create({
  container: {
    padding: theme.spacing[4],
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  dropSection: {
    marginBottom: theme.spacing[4],
    padding: theme.spacing[3],
    borderRadius: theme.borders.radius.lg,
    backgroundColor: 'rgba(130, 135, 255, 0.05)',
  },
  separator: {
    height: 2,
    backgroundColor: theme.colors.primary.light,
    width: '40%',
    marginVertical: theme.spacing[3],
    borderRadius: theme.borders.radius.sm,
    opacity: 0.3,
  },
  topRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dropZone: {
    margin: theme.spacing[2],
    borderRadius: theme.borders.radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  dropZoneActive: {
    borderColor: theme.colors.primary.main,
    backgroundColor: 'rgba(130, 135, 255, 0.1)',
  },
  dropZoneFilled: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
    borderStyle: 'solid',
  },
  dropZoneFilledActive: {
    backgroundColor: theme.colors.primary.light,
  },
  dropContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: (theme.typography.fontSize as any)['2xl'] || 24,
    color: '#A1A1A1',
    fontWeight: theme.typography.fontWeight.bold,
  },
  bottomSection: {
    marginTop: theme.spacing[4],
    padding: theme.spacing[3],
    borderRadius: theme.borders.radius.lg,
    backgroundColor: 'rgba(130, 135, 255, 0.05)',
  },
  bottomContainer: {
    width: '100%',
  },
  scrollRow: {
    width: '100%',
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[2],
  },
  draggableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  draggableBox: {
    marginHorizontal: theme.spacing[1],
    borderRadius: theme.borders.radius.lg,
    borderWidth: theme.borders.width.normal,
    borderColor: theme.colors.primary.light,
    backgroundColor: theme.colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  dragging: {
    opacity: theme.animations.opacity.pressed,
    transform: [{ scale: 0.98 }],
  },
  syllableText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    paddingHorizontal: theme.spacing[1],
    color: theme.colors.primary.main,
  },
  dropZoneFilledText: {
    color: theme.colors.neutral.white,
  },
  draggableBoxText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
  },
});
