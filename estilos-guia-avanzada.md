# Guía Avanzada de Estilos - @developersakademi/akademi-shared

Esta guía proporciona respuestas detalladas a preguntas específicas sobre el sistema de estilos y su implementación avanzada.

## 📱 Responsividad

### Valores Recomendados para screenWidth

```typescript
const DEVICE_SIZES = {
  mobile: {
    min: 320,
    max: 480,
    default: 375
  },
  tablet: {
    min: 481,
    max: 768,
    default: 600
  },
  desktop: {
    min: 769,
    max: 1024,
    default: 900
  },
  wide: {
    min: 1025,
    default: 1200
  }
};
```

### Manejo de Breakpoints

Los componentes manejan la responsividad internamente siguiendo estas pautas:

```typescript
// Ejemplo de uso interno en componentes
const getResponsiveStyles = (screenWidth: number) => {
  if (screenWidth <= DEVICE_SIZES.mobile.max) {
    return {
      fontSize: themeProps.typography.fontSize.sm,
      padding: themeProps.spacing[2]
    };
  }
  
  if (screenWidth <= DEVICE_SIZES.tablet.max) {
    return {
      fontSize: themeProps.typography.fontSize.base,
      padding: themeProps.spacing[3]
    };
  }
  
  return {
    fontSize: themeProps.typography.fontSize.xl,
    padding: themeProps.spacing[4]
  };
};
```

## 🎨 Personalización de Reactivos

### Reactive1 - Estilos Específicos

```typescript
interface Reactive1Styles {
  container: ViewStyle;
  questionText: TextStyle;
  optionContainer: ViewStyle;
  selectedOption: ViewStyle;
  feedbackText: TextStyle;
}

// Ejemplo de uso
const customStyles: Reactive1Styles = {
  container: {
    backgroundColor: themeProps.colors.neutral.white,
    padding: themeProps.spacing[4]
  },
  questionText: {
    fontSize: themeProps.typography.fontSize.xl,
    fontWeight: themeProps.typography.fontWeight.bold
  },
  // ... otros estilos
};
```

### Reactive2 - Estilos Específicos

```typescript
interface Reactive2Styles {
  mainContainer: ViewStyle;
  imageContainer: ViewStyle;
  responseArea: ViewStyle;
  feedbackContainer: ViewStyle;
}

// Ejemplo de uso
const customStyles: Reactive2Styles = {
  mainContainer: {
    gap: themeProps.spacing[3]
  },
  imageContainer: {
    borderRadius: themeProps.borders.radius.md
  },
  // ... otros estilos
};
```

## ✅ Validación y TypeScript

### Exportación del ThemeSchema

```typescript
// theme.validation.ts
import { z } from 'zod';

export const ThemeSchema = z.object({
  colors: z.object({
    primary: z.object({
      main: z.string(),
      dark: z.string(),
      light: z.string(),
    }),
    neutral: z.object({
      white: z.string(),
      gray100: z.string(),
      gray300: z.string(),
    }),
  }),
  // ... resto del schema
});

// Uso
const validateTheme = (theme: unknown) => {
  try {
    return ThemeSchema.parse(theme);
  } catch (error) {
    console.error('Error de validación del tema:', error);
    throw error;
  }
};
```

### Tipos TypeScript para Reactivos

```typescript
// types/reactive-styles.ts
export interface BaseReactiveStyles {
  container: ViewStyle;
  text: TextStyle;
  feedback: {
    correct: TextStyle;
    incorrect: TextStyle;
  };
}

export interface Reactive1Styles extends BaseReactiveStyles {
  options: ViewStyle;
  selectedOption: ViewStyle;
}

export interface Reactive2Styles extends BaseReactiveStyles {
  imageArea: ViewStyle;
  responseArea: ViewStyle;
}

// ... otros tipos específicos
```

## 🎯 Mejores Prácticas

### Estructura de Múltiples Temas

```typescript
// themes/index.ts
import { matematicasTheme } from './matematicas';
import { lenguajeTheme } from './lenguaje';
import { cienciasTheme } from './ciencias';

export const themes = {
  matematicas: matematicasTheme,
  lenguaje: lenguajeTheme,
  ciencias: cienciasTheme
} as const;

// themes/matematicas.ts
export const matematicasTheme = {
  colors: {
    primary: {
      main: '#2E3192',
      dark: '#1A1B5E',
      light: '#5457C6'
    },
    // ... otros colores
  },
  // ... resto del tema
};

// Uso
import { themes } from './themes';

const MiComponente = () => {
  const temaActual = themes.matematicas;
  
  return (
    <Reactive1
      themeProps={temaActual}
      // ... otras props
    />
  );
};
```

### Manejo de Animaciones

```typescript
// animations/index.ts
import { Animated } from 'react-native';

export const animationConfigs = {
  fadeIn: {
    duration: 300,
    toValue: 1,
    useNativeDriver: true
  },
  slideIn: {
    duration: 400,
    toValue: { x: 0, y: 0 },
    useNativeDriver: true
  }
};

// Uso en componentes
const FadeInView = ({ children }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, animationConfigs.fadeIn).start();
  }, []);

  return (
    <Animated.View style={{ opacity }}>
      {children}
    </Animated.View>
  );
};
```

## 📝 Recomendaciones Adicionales

### 1. Organización de Temas

```
src/
├── themes/
│   ├── index.ts
│   ├── base.ts
│   ├── matematicas/
│   │   ├── index.ts
│   │   ├── colors.ts
│   │   └── typography.ts
│   ├── lenguaje/
│   │   └── ...
│   └── ciencias/
│       └── ...
├── styles/
│   ├── components/
│   │   ├── reactive1.ts
│   │   └── reactive2.ts
│   └── shared/
│       ├── animations.ts
│       └── responsive.ts
```

### 2. Manejo de Estados Visuales

```typescript
const getStateStyles = (status: 'default' | 'active' | 'disabled') => {
  const styles = {
    default: {
      opacity: 1,
      backgroundColor: themeProps.colors.neutral.white
    },
    active: {
      opacity: 1,
      backgroundColor: themeProps.colors.primary.light
    },
    disabled: {
      opacity: 0.5,
      backgroundColor: themeProps.colors.neutral.gray100
    }
  };

  return styles[status];
};
```

### 3. Extensión de Temas Base

```typescript
const extendTheme = (baseTheme: ThemeProps, overrides: Partial<ThemeProps>) => {
  return {
    ...baseTheme,
    ...overrides,
    colors: {
      ...baseTheme.colors,
      ...overrides.colors
    },
    // ... otras propiedades
  };
};

// Uso
const temaPersonalizado = extendTheme(themes.matematicas, {
  colors: {
    primary: {
      main: '#NEW_COLOR'
    }
  }
});
```

## 🔍 Depuración y Desarrollo

### Herramienta de Inspección de Temas

```typescript
const inspectTheme = (theme: ThemeProps) => {
  console.table({
    'Primary Colors': theme.colors.primary,
    'Font Sizes': theme.typography.fontSize,
    'Spacing Values': theme.spacing
  });
};

// Uso en desarrollo
if (__DEV__) {
  inspectTheme(currentTheme);
}
```

### Validación de Consistencia

```typescript
const validateThemeConsistency = (theme: ThemeProps) => {
  // Verificar colores
  const hasValidColors = Object.values(theme.colors.primary).every(
    color => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
  );

  // Verificar espaciado
  const hasValidSpacing = theme.spacing.every(
    value => typeof value === 'number' && value >= 0
  );

  return {
    isValid: hasValidColors && hasValidSpacing,
    errors: {
      colors: !hasValidColors ? 'Colores inválidos detectados' : null,
      spacing: !hasValidSpacing ? 'Valores de espaciado inválidos' : null
    }
  };
};
```

## 📚 Referencias Útiles

- [Documentación de React Native StyleSheet](https://reactnative.dev/docs/stylesheet)
- [Guía de Diseño Responsive](https://reactnative.dev/docs/dimensions)
- [Animaciones en React Native](https://reactnative.dev/docs/animated)

## 🤝 Soporte

Para preguntas específicas sobre estilos o temas:

1. Revisar la documentación existente
2. Consultar los ejemplos de implementación
3. Verificar la compatibilidad de versiones
4. Contactar al equipo de desarrollo 