# Guía de Implementación de Estilos para fe-panel

Esta guía proporciona instrucciones específicas para implementar el sistema de estilos de @developersakademi/akademi-shared en el proyecto fe-panel.

## 📁 Estructura de Archivos

### Estructura Recomendada

```
src/
├── theme/
│   ├── index.ts           # Exportación principal de temas
│   ├── base.ts           # Tema base y tipos
│   ├── constants.ts      # Constantes de tema
│   ├── hooks/
│   │   ├── useTheme.ts   # Hook personalizado para tema
│   │   └── useStyles.ts  # Hook para estilos dinámicos
│   ├── subjects/         # Temas por materia
│   │   ├── index.ts
│   │   ├── matematicas/
│   │   │   ├── index.ts
│   │   │   ├── colors.ts
│   │   │   └── variants.ts
│   │   ├── lenguaje/
│   │   └── ciencias/
│   └── utils/
│       ├── themeUtils.ts
│       └── styleHelpers.ts
├── styles/
│   ├── components/       # Estilos específicos de componentes
│   ├── shared/          # Estilos compartidos
│   └── animations/      # Configuraciones de animación
```

### Integración con Estructura Existente

```typescript
// src/theme/index.ts
import { ThemeProps } from '@developersakademi/akademi-shared';
import { baseTheme } from './base';
import { subjectThemes } from './subjects';

export const themes: Record<string, ThemeProps> = {
  base: baseTheme,
  ...subjectThemes
};

// Exportar hooks y utilidades
export * from './hooks';
export * from './utils';
```

## 🔄 Temas Dinámicos

### Implementación de Cambio de Tema

```typescript
// src/theme/hooks/useTheme.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '../index';

const THEME_STORAGE_KEY = '@fe-panel/theme';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(themes.base);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tema guardado
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && themes[savedTheme]) {
          setCurrentTheme(themes[savedTheme]);
        }
      } catch (error) {
        console.error('Error al cargar el tema:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Cambiar tema
  const changeTheme = async (themeKey: string) => {
    if (themes[themeKey]) {
      setCurrentTheme(themes[themeKey]);
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, themeKey);
      } catch (error) {
        console.error('Error al guardar el tema:', error);
      }
    }
  };

  return { currentTheme, changeTheme, isLoading };
};
```

### Uso en Componentes

```typescript
// src/components/ExampleComponent.tsx
import { useTheme } from '../theme/hooks';
import { Reactive42 } from '@developersakademi/akademi-shared';

export const ExampleComponent = () => {
  const { currentTheme } = useTheme();

  return (
    <Reactive42
      themeProps={currentTheme}
      // ... otras props
    />
  );
};
```

## ⚡ Optimización de Rendimiento

### Memoización de Estilos

```typescript
// src/theme/hooks/useStyles.ts
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from './useTheme';

export const useStyles = <T extends object>(
  styleFactory: (theme: ThemeProps) => T
) => {
  const { currentTheme } = useTheme();

  return useMemo(
    () => StyleSheet.create(styleFactory(currentTheme)),
    [currentTheme]
  );
};

// Uso
const MyComponent = () => {
  const styles = useStyles((theme) => ({
    container: {
      backgroundColor: theme.colors.neutral.white,
      padding: theme.spacing[4]
    }
  }));

  return <View style={styles.container}>{/* ... */}</View>;
};
```

### Optimización de Reactivos

```typescript
// src/components/OptimizedReactive.tsx
import { memo } from 'react';
import { Reactive42 } from '@developersakademi/akademi-shared';

export const OptimizedReactive = memo(({ themeProps, ...props }) => (
  <Reactive42
    themeProps={themeProps}
    {...props}
  />
), (prevProps, nextProps) => {
  // Comparación personalizada para evitar re-renders innecesarios
  return (
    prevProps.themeProps === nextProps.themeProps &&
    prevProps.responseUser === nextProps.responseUser
  );
});
```

## 🔄 Estrategia de Migración

### 1. Análisis de Estilos Existentes

```typescript
// scripts/analyzeStyles.ts
import { glob } from 'glob';
import { parse } from '@babel/parser';
import { readFileSync } from 'fs';

const analyzeStyles = async () => {
  const files = await glob('src/**/*.{ts,tsx}');
  const stylePatterns = new Set();

  files.forEach(file => {
    const content = readFileSync(file, 'utf8');
    // Analizar uso de estilos
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });
    // ... lógica de análisis
  });

  return stylePatterns;
};
```

### 2. Utilidad de Migración

```typescript
// src/theme/utils/migrationUtils.ts
import { ThemeProps } from '@developersakademi/akademi-shared';

export const migrateStyles = (oldStyles: any, theme: ThemeProps) => {
  const mappings = {
    // Mapeo de valores antiguos a nuevos
    primaryColor: theme.colors.primary.main,
    secondaryColor: theme.colors.primary.light,
    // ... más mappings
  };

  return Object.entries(oldStyles).reduce((acc, [key, value]) => {
    acc[key] = mappings[value as string] || value;
    return acc;
  }, {} as Record<string, any>);
};

// Uso
const oldStyles = {
  container: {
    backgroundColor: 'primaryColor',
    padding: 16
  }
};

const newStyles = migrateStyles(oldStyles, currentTheme);
```

### 3. Plan de Migración Gradual

1. **Fase 1: Preparación**
   ```typescript
   // Crear archivo de tema base
   // src/theme/base.ts
   export const baseTheme: ThemeProps = {
     // Mapear valores existentes
     colors: {
       primary: {
         main: existingColors.primary,
         // ...
       }
     },
     // ...
   };
   ```

2. **Fase 2: Migración por Componente**
   ```typescript
   // Componente migrado
   const MigratedComponent = () => {
     const { currentTheme } = useTheme();
     
     return (
       <Reactive42
         themeProps={currentTheme}
         // Props migradas
       />
     );
   };
   ```

3. **Fase 3: Validación**
   ```typescript
   // src/theme/utils/validation.ts
   export const validateMigration = (
     oldStyles: any,
     newStyles: any
   ) => {
     const differences = [];
     // Lógica de validación
     return differences;
   };
   ```

## 📊 Monitoreo y Mantenimiento

### Herramienta de Diagnóstico

```typescript
// src/theme/utils/diagnostics.ts
export const ThemeDiagnostics = {
  analyzeThemeUsage: (component: string) => {
    if (__DEV__) {
      console.group(`Diagnóstico de Tema - ${component}`);
      // Análisis de uso
      console.groupEnd();
    }
  },

  validateThemeIntegrity: (theme: ThemeProps) => {
    const issues = [];
    // Validación de integridad
    return issues;
  }
};
```

### Sistema de Logging

```typescript
// src/theme/utils/logger.ts
export const ThemeLogger = {
  logThemeChange: (oldTheme: string, newTheme: string) => {
    if (__DEV__) {
      console.log(
        `Cambio de tema: ${oldTheme} -> ${newTheme}`,
        new Date().toISOString()
      );
    }
  },

  logStyleError: (component: string, error: Error) => {
    console.error(
      `Error de estilo en ${component}:`,
      error.message
    );
  }
};
```

## 🔍 Depuración

### Herramientas de Desarrollo

```typescript
// src/theme/utils/devTools.ts
export const ThemeDevTools = {
  inspectComponent: (component: string, props: any) => {
    if (__DEV__) {
      console.group(`Inspección de ${component}`);
      console.log('Props:', props);
      console.log('Tema actual:', props.themeProps);
      console.groupEnd();
    }
  },

  compareThemes: (themeA: ThemeProps, themeB: ThemeProps) => {
    const differences = {};
    // Lógica de comparación
    return differences;
  }
};
```

## 📝 Documentación Continua

Mantener un registro de cambios y decisiones:

```markdown
# Registro de Cambios de Tema

## [Fecha] - Actualización de Sistema de Temas

### Cambios
- Implementación de nuevo sistema de temas
- Migración de componentes legacy
- Optimizaciones de rendimiento

### Decisiones Técnicas
1. Uso de hooks personalizados para manejo de tema
2. Implementación de memoización para estilos
3. Estructura de archivos modular
```

## 🤝 Soporte y Recursos

- Documentación de @developersakademi/akademi-shared
- Guías de estilo de React Native
- Herramientas de desarrollo recomendadas
- Canales de soporte del equipo 