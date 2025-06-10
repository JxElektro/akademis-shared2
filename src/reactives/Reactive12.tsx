import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';


import { Reactive12Styles, Reactive12Props, DraggableProps, DropZoneProps } from '../types/reactiveTypes';
import { ReactiveSchema, DeviceInfo } from '../types/reactiveSchema';
import { ThemeProps } from '../types/uiTypes';

// Componente arrastrable usando drag & drop nativo de HTML (específico para web)
const Draggable: React.FC<DraggableProps> = ({ 
  value, 
  onDragStart, 
  disabled, 
  styles = {} as Reactive12Styles, 
  themeProps 
}) => {
  // Mapa de colores para asignar colores específicos a cada valor
  const colorMap: Record<string, string> = {};

  // Función para obtener un color Akademi basado en el valor
  const getAkademiColor = (value: string): string => {
    // Lista de colores disponibles de Akademi o fallback a colores predefinidos
    const colors = themeProps.AkademiColors ? [
      themeProps.AkademiColors.azulClaro,     // Azul Claro
      themeProps.AkademiColors.verdeAkademi,  // Verde Akademi
      themeProps.AkademiColors.amarilloAkademi, // Amarillo Akademi
      themeProps.AkademiColors.rojoAkademi,   // Rojo Akademi
      themeProps.AkademiColors.turquesa,      // Turquesa
      `${themeProps.AkademiColors.azulClaro}99`,  // Con transparencia
      `${themeProps.AkademiColors.verdeAkademi}99`, // Con transparencia
      `${themeProps.AkademiColors.amarilloAkademi}99`, // Con transparencia
      `${themeProps.AkademiColors.rojoAkademi}99`, // Con transparencia
      `${themeProps.AkademiColors.turquesa}99`, // Con transparencia
      `${themeProps.AkademiColors.azulPrincipal}40`, // Con alta transparencia
    ] : [
      '#8287FF', // Azul claro
      '#87EB77', // Verde
      '#FFCD1A', // Amarillo
      '#FF5977', // Rojo
      '#72DEED', // Turquesa
      '#8287FF99', // Con transparencia
      '#87EB7799', // Con transparencia
      '#FFCD1A99', // Con transparencia
      '#FF597799', // Con transparencia
      '#72DEED99', // Con transparencia
      '#2A287040', // Con alta transparencia
    ];
    
    // Si ya tenemos un color asignado para este valor, lo reutilizamos
    if (colorMap[value]) {
      return colorMap[value];
    }
    
    // Encuentra un color que no esté siendo utilizado
    const usedColors = Object.values(colorMap);
    const availableColors = colors.filter(color => !usedColors.includes(color));
    
    // Si hay colores disponibles, usa uno; de lo contrario, vuelve al comportamiento anterior
    if (availableColors.length > 0) {
      colorMap[value] = availableColors[0];
    } else {
      // Si todos los colores están siendo usados, crea una variación
      const baseIndex = parseInt(value) % colors.length;
      colorMap[value] = colors[baseIndex];
    }
    
    return colorMap[value];
  };

  if (typeof window !== 'undefined' && window.document) {
    // Web
    const backgroundColor = getAkademiColor(value);
    const azulPrincipal = themeProps.AkademiColors?.azulPrincipal || '#2A2870';
    return (
      <div 
        draggable={!disabled}
        onDragStart={() => onDragStart(value)}
        className="draggable-item"
        style={{
          minHeight: 66,
          minWidth: 66,
          padding: 12,
          borderWidth: 0,
          borderRadius: themeProps.borders.radius.md,
          backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          margin: 8,
          cursor: disabled ? 'default' : 'grab',
          opacity: disabled ? 0.5 : 1,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            fontSize: themeProps.typography.fontSize.xl,
            fontWeight: themeProps.typography.fontWeight.bold,
            textAlign: 'center',
            color: '#FFFFFF',
            fontFamily: themeProps.typography.fontFamily,
            textShadow: `-1px -1px 0 ${azulPrincipal}, 1px -1px 0 ${azulPrincipal}, -1px 1px 0 ${azulPrincipal}, 1px 1px 0 ${azulPrincipal}`,
          }}
        >
          {value}
        </span>
      </div>
    );
  } else {
    // Nativo
    return (
      <View style={[
        defaultStyles(themeProps).item, 
        disabled && defaultStyles(themeProps).disabledItem,
        styles?.item,
        disabled && styles?.disabledItem
      ]}>
        <Text style={[defaultStyles(themeProps).itemText, styles?.itemText]}>{value}</Text>
      </View>
    );
  }
};

// Zona de drop usando drag & drop nativo de HTML (específico para web)
const DropZone: React.FC<DropZoneProps> = ({ 
  index, 
  value, 
  onDrop, 
  onDragOver,
  isCorrect,
  isIncorrect,
  correctValue,
  userResponseStatus,
  styles = {} as Reactive12Styles,
  themeProps
}) => {
  // Mapa de colores para asignar colores específicos a cada valor
  const colorMap: Record<string, string> = {};

  // Función para obtener un color Akademi basado en el valor
  const getAkademiColor = (value: string): string => {
    // Lista de colores disponibles de Akademi o fallback a colores predefinidos
    const colors = themeProps.AkademiColors ? [
      themeProps.AkademiColors.azulClaro,     // Azul Claro
      themeProps.AkademiColors.verdeAkademi,  // Verde Akademi
      themeProps.AkademiColors.amarilloAkademi, // Amarillo Akademi
      themeProps.AkademiColors.rojoAkademi,   // Rojo Akademi
      themeProps.AkademiColors.turquesa,      // Turquesa
      `${themeProps.AkademiColors.azulClaro}99`,  // Con transparencia
      `${themeProps.AkademiColors.verdeAkademi}99`, // Con transparencia
      `${themeProps.AkademiColors.amarilloAkademi}99`, // Con transparencia
      `${themeProps.AkademiColors.rojoAkademi}99`, // Con transparencia
      `${themeProps.AkademiColors.turquesa}99`, // Con transparencia
      `${themeProps.AkademiColors.azulPrincipal}40`, // Con alta transparencia
    ] : [
      '#8287FF', // Azul claro
      '#87EB77', // Verde
      '#FFCD1A', // Amarillo
      '#FF5977', // Rojo
      '#72DEED', // Turquesa
      '#8287FF99', // Con transparencia
      '#87EB7799', // Con transparencia
      '#FFCD1A99', // Con transparencia
      '#FF597799', // Con transparencia
      '#72DEED99', // Con transparencia
      '#2A287040', // Con alta transparencia
    ];
    
    // Si ya tenemos un color asignado para este valor, lo reutilizamos
    if (colorMap[value]) {
      return colorMap[value];
    }
    
    // Encuentra un color que no esté siendo utilizado
    const usedColors = Object.values(colorMap);
    const availableColors = colors.filter(color => !usedColors.includes(color));
    
    // Si hay colores disponibles, usa uno; de lo contrario, vuelve al comportamiento anterior
    if (availableColors.length > 0) {
      colorMap[value] = availableColors[0];
    } else {
      // Si todos los colores están siendo usados, crea una variación
      const baseIndex = parseInt(value) % colors.length;
      colorMap[value] = colors[baseIndex];
    }
    
    return colorMap[value];
  };

  if (typeof window !== 'undefined' && window.document) {
    // Web
    let backgroundColor = value ? getAkademiColor(value) : 'transparent';
    let borderStyle = '0px solid transparent';
    let boxShadowColor = 'rgba(0, 0, 0, 0.2)';
    
    // Aplicar estilos según el estado de la respuesta
    if (userResponseStatus !== 'pending') {
      if (isCorrect) {
        borderStyle = `3px solid ${themeProps.colors.feedback.success.main}`;
        boxShadowColor = `${themeProps.colors.feedback.success.main}80`;
      } else if (isIncorrect) {
        borderStyle = `3px solid ${themeProps.colors.feedback.error.main}`;
        boxShadowColor = `${themeProps.colors.feedback.error.main}80`;
        // Si tenemos un valor correcto para mostrar, lo usamos
        if (correctValue) {
          backgroundColor = getAkademiColor(correctValue);
        }
      }
    }

    const azulPrincipal = themeProps.AkademiColors?.azulPrincipal || '#2A2870';

    return (
      <div
        onDrop={(e) => {
          e.preventDefault();
          onDrop(index);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver();
        }}
        className={`drop-zone ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
        style={{
          backgroundColor,
          borderRadius: themeProps.borders.radius.md,
          margin: 8,
          width: 66,
          height: 66,
          justifyContent: 'center',
          alignItems: 'center',
          border: borderStyle,
          display: 'flex',
          boxShadow: `0px 4px 8px ${boxShadowColor}`,
          transition: 'all 0.3s ease',
          position: 'relative',
        }}
      >
        {value || (userResponseStatus !== 'pending' && correctValue) ? (
          <span
            style={{
              fontSize: themeProps.typography.fontSize.xl,
              fontWeight: themeProps.typography.fontWeight.bold,
              textAlign: 'center',
              color: '#FFFFFF',
              fontFamily: themeProps.typography.fontFamily,
              textShadow: `-1px -1px 0 ${azulPrincipal}, 1px -1px 0 ${azulPrincipal}, -1px 1px 0 ${azulPrincipal}, 1px 1px 0 ${azulPrincipal}`,
            }}
          >
            {value || correctValue}
          </span>
        ) : (
          <span
            style={{
              fontSize: themeProps.typography.fontSize.xl,
              fontWeight: themeProps.typography.fontWeight.bold,
              color: themeProps.colors.neutral.gray300,
            }}
          >
            _
          </span>
        )}
      </div>
    );
  } else {
    // Nativo
    return (
      <View style={[
        defaultStyles(themeProps).dropZone, 
        userResponseStatus !== 'pending' && isCorrect && defaultStyles(themeProps).correctDropZone,
        userResponseStatus !== 'pending' && isIncorrect && defaultStyles(themeProps).incorrectDropZone,
        styles?.dropZone,
        userResponseStatus !== 'pending' && isCorrect && styles?.correctDropZone,
        userResponseStatus !== 'pending' && isIncorrect && styles?.incorrectDropZone
      ]}>
        {value ? (
          <Text style={[defaultStyles(themeProps).dropZoneText, styles?.dropZoneText]}>{value}</Text>
        ) : (
          <Text style={[defaultStyles(themeProps).placeholderText, styles?.placeholderText]}>_</Text>
        )}
      </View>
    );
  }
};

export const Reactive12: React.FC<Reactive12Props> = ({
  reactive,
  responseUser,
  onResponseChange,
  userResponseStatus = 'pending',
  resetTrigger = 0,
  onCorrectOrderChange,
  themeProps,
  styles = {} as Reactive12Styles,
  containerStyle,
}) => {
  // Generar estilos basados en las props de tema
  const componentStyles = React.useMemo(() => defaultStyles(themeProps), [themeProps]);

  const assignmentContent = reactive.assignment?.config?.content || [];
  const questionText = String(assignmentContent[0]?.text?.response?.[0] || '');

  // Obtener la serie completa y la respuesta correcta
  const fullSeries: string[] = useMemo(() => (
    (reactive.alternatives?.config?.content?.[0]?.number?.response || []).map(String)
  ), [reactive]);

  const correctResponse: string[] = useMemo(() => (
    (reactive.alternatives?.config?.content?.[0]?.number?.correctResponse || []).map(String)
  ), [reactive]);

  // Informar el orden correcto al componente padre
  useEffect(() => {
    onCorrectOrderChange?.(fullSeries);
  }, [fullSeries, onCorrectOrderChange]);

  // Estado de los slots y alternativas disponibles
  const [slotValues, setSlotValues] = useState<(string | null)[]>([]);
  const [availableValues, setAvailableValues] = useState<string[]>([]);
  
  // Valor actualmente siendo arrastrado
  const [draggingValue, setDraggingValue] = useState<string | null>(null);

  // Inicializar el estado cuando cambia el reactivo o se resetea
  React.useEffect(() => {
    const initialSlots: (string | null)[] = [];
    const initialAvailableValues: string[] = [];

    fullSeries.forEach((value) => {
      if (correctResponse.includes(value)) {
        // Este valor debe ser colocado por el usuario
        initialSlots.push(null);
        initialAvailableValues.push(value);
      } else {
        // Este valor es fijo y no se puede mover
        initialSlots.push(value);
      }
    });

    setSlotValues(initialSlots);
    setAvailableValues(initialAvailableValues);
    
    // No enviar respuesta inicial para evitar falsos positivos
    // La respuesta se enviará solo cuando el usuario interactúe con el componente
  }, [resetTrigger, fullSeries, correctResponse, onResponseChange]);

  // Manejar el inicio del arrastre
  const handleDragStart = (value: string) => {
    if (userResponseStatus !== 'pending') return;
    setDraggingValue(value);
  };

  // Manejar el evento sobre una zona de drop
  const handleDragOver = () => {
    // Necesario para que onDrop funcione en HTML5
  };

  // Manejar el drop en una zona
  const handleDrop = (dropZoneIndex: number) => {
    if (userResponseStatus !== 'pending' || !draggingValue) return;
    
    // Verificar si el slot es válido para colocar (debe ser null y corresponder a un espacio correcto)
    if (dropZoneIndex >= 0 && dropZoneIndex < slotValues.length) {
      if (slotValues[dropZoneIndex] === null && correctResponse.includes(fullSeries[dropZoneIndex])) {
        // Crear una copia del array de slots
        const newSlotValues = [...slotValues];
        newSlotValues[dropZoneIndex] = draggingValue;
        
        // Actualizar los slots
        setSlotValues(newSlotValues);
        
        // Remover el valor de disponibles
        setAvailableValues(prev => prev.filter(v => v !== draggingValue));
        
        // Solo enviar la respuesta si está completa
        if (isResponseComplete(newSlotValues)) {
          onResponseChange?.(newSlotValues.map((it) => (it ? it : '')));
        }
      }
    }
    
    // Limpiar el valor siendo arrastrado
    setDraggingValue(null);
  };

  // Verificar respuestas correctas e incorrectas
  const checkCorrectness = (index: number, value: string | null) => {
    if (userResponseStatus === 'pending' || !value) return { isCorrect: false, isIncorrect: false };
    
    const expectedValue = fullSeries[index];
    const isCorrect = value === expectedValue;
    
    return {
      isCorrect: isCorrect,
      isIncorrect: !isCorrect,
      correctValue: isCorrect ? undefined : expectedValue
    };
  };

  // Verificar si la respuesta está completa (todas las posiciones requeridas tienen valor)
  const isResponseComplete = (slots: (string | null)[]) => {
    return slots.every((value, index) => {
      // Si esta posición requiere una respuesta (está en correctResponse),
      // entonces debe tener un valor asignado
      return !correctResponse.includes(fullSeries[index]) || value !== null;
    });
  };

  const azulPrincipal = themeProps.AkademiColors?.azulPrincipal || '#2A2870';

  return (
    <View style={[
      componentStyles.container, 
      styles?.container,
      containerStyle
    ]}>
      {/* Fila de slots para colocar las alternativas */}
      <View style={[
        componentStyles.dropZonesRow, 
        styles?.dropZonesRow
      ]}>
        {slotValues.map((value, idx) => {
          const { isCorrect, isIncorrect, correctValue } = checkCorrectness(idx, value);
          
          return (
            <DropZone
              key={`slot-${idx}`}
              index={idx}
              value={value}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              isCorrect={isCorrect}
              isIncorrect={isIncorrect}
              correctValue={correctValue}
              userResponseStatus={userResponseStatus}
              styles={styles}
              themeProps={themeProps}
            />
          );
        })}
      </View>
      
      {/* Lista de alternativas disponibles */}
      <View style={[
        componentStyles.alternativesContainer, 
        styles?.alternativesContainer
      ]}>
        {availableValues.map((value, idx) => (
          <Draggable
            key={`drag-${value}-${idx}`}
            value={value}
            onDragStart={handleDragStart}
            disabled={userResponseStatus !== 'pending'}
            styles={styles}
            themeProps={themeProps}
          />
        ))}
      </View>
      
      {/* Estilos CSS para comportamiento de arrastre en web */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .draggable-item:active {
            cursor: grabbing;
            transform: scale(1.05);
            box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
          }
          .drop-zone.dragover {
            box-shadow: 0px 0px 12px ${azulPrincipal}80;
          }
          .drop-zone.correct {
            box-shadow: 0px 0px 12px ${themeProps.colors.feedback.success.main}80 !important;
          }
          .drop-zone.incorrect {
            box-shadow: 0px 0px 12px ${themeProps.colors.feedback.error.main}80 !important;
          }
        `
      }} />
    </View>
  );
};

// Función para crear estilos basados en el tema
const defaultStyles = (theme: ThemeProps) => {
  const azulPrincipal = theme.AkademiColors?.azulPrincipal || '#2A2870';
  const azulClaro = theme.AkademiColors?.azulClaro || '#8287FF';
  
  return StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: '10%',
    },
    dropZonesRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[5],
      flexWrap: 'wrap',
    },
    dropZone: {
      backgroundColor: "transparent",
      borderRadius: theme.borders.radius.md,
      margin: theme.spacing[2],
      width: 66,
      height: 66,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0,
    },
    correctDropZone: {
      borderWidth: 3,
      borderColor: theme.colors.feedback.success.main,
    },
    incorrectDropZone: {
      borderWidth: 3,
      borderColor: theme.colors.feedback.error.main,
    },
    dropZoneText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
      textAlign: 'center',
      color: '#FFFFFF',
      fontFamily: theme.typography.fontFamily,
    },
    placeholderText: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: theme.colors.neutral.gray300 || '#C4C4C4',
    },
    alternativesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing[4],
    },
    item: {
      minHeight: 66,
      minWidth: 66,
      padding: theme.spacing[3],
      margin: theme.spacing[2],
      borderWidth: 0,
      borderRadius: theme.borders.radius.md,
      backgroundColor: azulClaro,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledItem: {
      opacity: theme.animations.opacity.disabled || 0.6,
    },
    itemText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
      textAlign: 'center',
      color: '#FFFFFF',
      fontFamily: theme.typography.fontFamily,
    },
  });
};

export default Reactive12; 