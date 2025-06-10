# Guía de Estilos - @developersakademi/akademi-shared

Esta guía proporciona una visión detallada del sistema de estilos en la librería @developersakademi/akademi-shared, incluyendo la implementación de temas, personalización de componentes y mejores prácticas.

## 📚 Índice

1. [Sistema de Temas](#sistema-de-temas)
2. [Personalización de Componentes](#personalización-de-componentes)
3. [Tipos TypeScript](#tipos-typescript)
4. [Mejores Prácticas](#mejores-prácticas)
5. [Ejemplos de Implementación](#ejemplos-de-implementación)
6. [Validación de Estilos](#validación-de-estilos)
7. [Limitaciones y Consideraciones](#limitaciones-y-consideraciones)
8. [Recomendaciones](#recomendaciones)

## Sistema de Temas

La librería utiliza un sistema de temas consistente a través de la prop `themeProps`. La estructura base es:

```typescript
const themeProps = {
  colors: {
    primary: {
      main: '#007AFF',    // Color principal
      dark: '#0056CC',    // Variante oscura
      light: '#4DA3FF'    // Variante clara
    },
    neutral: {
      white: '#FFFFFF',   // Blanco
      gray100: '#F5F5F5', // Gris claro
      gray300: '#D1D1D1'  // Gris medio
    }
  },
  spacing: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48], // Sistema de espaciado
  typography: {
    fontSize: {
      sm: 14,    // Texto pequeño
      base: 16,  // Texto base
      xl: 24,    // Texto grande
      '2xl': 32  // Texto extra grande
    },
    fontWeight: {
      normal: '400', // Peso normal
      bold: '700'   // Peso negrita
    }
  },
  borders: {
    width: {
      normal: 1,  // Borde normal
      medium: 2   // Borde medio
    },
    radius: {
      md: 8      // Radio de borde medio
    }
  }
}
```

## Personalización de Componentes

### Propiedades Aceptadas

Cada componente reactivo acepta las siguientes propiedades para personalización:

- `themeProps`: Configuración global de estilos
- `screenWidth`: Ajustes responsivos
- Propiedades específicas del componente

### Ejemplo de Uso

```jsx
<Reactive42
  reactive={reactiveData}
  responseUser={responseUser}
  onResponseChange={setResponseUser}
  userResponseStatus={userResponseStatus}
  themeProps={themeProps}
  screenWidth={375}
/>
```

## Tipos TypeScript

La librería incluye definiciones de tipos robustas:

```typescript
interface StrictThemeProps {
  colors: {
    primary: {
      main: string;
      dark: string;
      light: string;
      lightest?: string;
    };
    neutral: {
      white: string;
      gray100: string;
      gray300: string;
    };
  };
  spacing: readonly number[];
  typography: {
    fontSize: Record<string, number>;
    fontWeight: Record<string, string>;
    fontFamily?: string;
  };
  borders: {
    width: Record<string, number>;
    radius: Record<string, number>;
  };
}
```

## Mejores Prácticas

### 1. Consistencia Visual

- ✅ Utilizar siempre los valores definidos en `themeProps`
- ✅ Mantener la paleta de colores consistente
- ✅ Respetar el sistema de espaciado
- ❌ Evitar valores hardcodeados

### 2. Personalización

- ✅ Utilizar el sistema de temas para cambios globales
- ✅ Mantener la responsividad usando `screenWidth`
- ❌ Evitar estilos inline
- ❌ No modificar estilos internos directamente

## Ejemplos de Implementación

### Componente con Tema Personalizado

```jsx
import { Reactive42 } from '@developersakademi/akademi-shared';

const MyComponent = () => {
  const themeProps = {
    colors: {
      primary: {
        main: '#007AFF',
        dark: '#0056CC',
        light: '#4DA3FF'
      },
      neutral: {
        white: '#FFFFFF',
        gray100: '#F5F5F5',
        gray300: '#D1D1D1'
      }
    },
    // ... resto de la configuración
  };

  return (
    <Reactive42
      reactive={reactiveData}
      themeProps={themeProps}
      screenWidth={375}
    />
  );
};
```

## Validación de Estilos

La librería incluye validación en tiempo de ejecución usando Zod:

```typescript
const ThemeSchema = z.object({
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
  spacing: z.array(z.number()),
  typography: z.object({
    fontSize: z.record(z.number()),
    fontWeight: z.record(z.string()),
  }),
});
```

## Limitaciones y Consideraciones

1. **No hay ThemeProvider global**
   - Los estilos se pasan como props a cada componente
   - No existe contexto global de tema

2. **Personalización Limitada**
   - Se realiza principalmente a través de `themeProps`
   - No se pueden modificar estilos internos directamente

3. **Responsividad**
   - Depende de la prop `screenWidth`
   - No hay sistema de breakpoints complejo

## Recomendaciones

### 1. Para Consistencia Global

- Crear un archivo de tema centralizado
- Reutilizar la misma configuración de `themeProps`
- Mantener un sistema de diseño coherente

### 2. Para Personalización

- Mantener modificaciones dentro del sistema de temas
- Documentar personalizaciones específicas
- Utilizar propiedades existentes antes de crear nuevas

### 3. Para Mantenimiento

- Mantener registro de personalizaciones
- Revisar compatibilidad en actualizaciones
- Seguir convenciones de nombres establecidas

## 🔍 Ejemplo de Archivo de Tema Centralizado

```typescript
// theme.ts
export const appTheme = {
  colors: {
    primary: {
      main: '#007AFF',
      dark: '#0056CC',
      light: '#4DA3FF'
    },
    neutral: {
      white: '#FFFFFF',
      gray100: '#F5F5F5',
      gray300: '#D1D1D1'
    }
  },
  spacing: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48],
  typography: {
    fontSize: {
      sm: 14,
      base: 16,
      xl: 24,
      '2xl': 32
    },
    fontWeight: {
      normal: '400',
      bold: '700'
    }
  },
  borders: {
    width: {
      normal: 1,
      medium: 2
    },
    radius: {
      md: 8
    }
  }
};

// Uso en componentes
import { appTheme } from './theme';

const MyComponent = () => (
  <Reactive42
    themeProps={appTheme}
    // ... otras props
  />
);
```

## 📝 Notas Adicionales

- Los componentes son responsivos por diseño
- Se recomienda mantener un sistema de diseño documentado
- Las actualizaciones de la librería pueden incluir cambios en el sistema de estilos
- Consultar la documentación oficial para cambios recientes

## 🤝 Contribución

Si encuentras mejoras posibles en el sistema de estilos:

1. Documenta el caso de uso
2. Crea un ejemplo reproducible
3. Propón mejoras manteniendo la compatibilidad
4. Sigue las guías de estilo existentes 