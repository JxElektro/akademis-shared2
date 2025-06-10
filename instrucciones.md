# Instrucciones para la Librería @developersakademi/akademi-shared

Esta librería contiene componentes reactivos y elementos de UI reutilizables para aplicaciones React Native.

## 📋 Estructura del Proyecto

```
src/
├── components/          # Componentes de UI reutilizables
├── reactives/          # Componentes reactivos (actividades educativas)
├── types/              # Definiciones de tipos TypeScript
└── index.ts            # Punto de entrada principal
```

## 🚀 Instalación

```bash
npm install @developersakademi/akademi-shared
```

## ⚙️ Configuración Requerida

### Dependencias Peer

Esta librería requiere las siguientes dependencias en tu proyecto:

```json
{
  "react": "^19.0.0",
  "react-native": "^0.79.0"
}
```

### Configuración TypeScript

Si usas TypeScript, asegúrate de tener esta configuración en tu `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-native",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "node"
  }
}
```

**⚠️ Importante:** NO instales `@types/react-native` ya que React Native 0.79+ incluye sus propios tipos.

## 📦 Uso Básico

### Importar Componentes

```javascript
import { Card, CustomButton, AlternativeButton } from '@developersakademi/akademi-shared';
```

### Importar Reactivos

```javascript
import { Reactive1, Reactive21, Reactive42 } from '@developersakademi/akademi-shared';
```

### Importar Tipos

```javascript
import { ThemeProps, ReactiveSchema } from '@developersakademi/akademi-shared';
```

## 🎯 Ejemplo de Uso - Reactive42

El Reactive42 es un componente de ordenamiento de sílabas:

```jsx
import React, { useState } from 'react';
import { Reactive42 } from '@developersakademi/akademi-shared';

const MyComponent = () => {
  const [responseUser, setResponseUser] = useState([]);
  const [userResponseStatus, setUserResponseStatus] = useState('pending');

  const reactiveData = {
    correctAlternative: {
      inputType: {
        config: {
          content: [
            { text: { response: ['Sí'] } },
            { text: { response: ['la'] } },
            { text: { response: ['ba'] } },
            { text: { response: ['más'] } },
            { text: { response: ['tica'] } }
          ]
        }
      }
    },
    assignment: {
      config: {
        content: [
          { text: { response: ['Ordena las sílabas para formar la palabra'] } }
        ]
      }
    }
  };

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

  return (
    <Reactive42
      reactive={reactiveData}
      responseUser={responseUser}
      onResponseChange={setResponseUser}
      userResponseStatus={userResponseStatus}
      themeProps={themeProps}
      screenWidth={375}
    />
  );
};
```

## 🛠️ Solución de Problemas

### Error: '"react-native"' has no exported member named 'View'

**Causa:** Incompatibilidad de tipos entre versiones de React Native.

**Solución:**
1. Remover `@types/react-native` si está instalado:
   ```bash
   npm uninstall @types/react-native
   ```

2. Asegurar configuración correcta en `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "jsx": "react-native",
       "skipLibCheck": true
     }
   }
   ```

### Error: JSX element class does not support attributes

**Causa:** Configuración incorrecta de JSX en TypeScript.

**Solución:** Verificar que `jsx: "react-native"` esté configurado en `tsconfig.json`.

### Error de importación de react-native-drax

**Causa:** El paquete react-native-drax no está instalado.

**Solución:** Esta librería usa componentes nativos en lugar de react-native-drax. No es necesario instalarlo.

## 🔧 Mejoras de TypeScript

### Configuración Robusta para Producción

Para mejorar la seguridad de tipos y resolver errores de TypeScript:

#### 1. tsconfig.json Mejorado

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "ES2021"],
    "module": "es2015",
    "moduleResolution": "node",
    "jsx": "react-native",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    
    // Configuración estricta mejorada
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    // Resolución de módulos
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    
    // Para desarrollo - remover en producción
    "skipLibCheck": false,
    "noEmitOnError": true
  },
  "include": [
    "src/**/*",
    "src/types/global.d.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.test.tsx"
  ]
}
```

#### 2. Tipos Personalizados Mejorados

Crear `src/types/improved.d.ts`:

```typescript
// Tipos mejorados para React Native
declare module 'react-native' {
  export interface ViewStyle {
    [key: string]: any;
  }
  
  export interface TextStyle {
    [key: string]: any;
  }
  
  export interface ImageStyle {
    [key: string]: any;
  }
}

// Tipos específicos para la librería
export interface StrictThemeProps {
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

// Tipos para respuestas de reactivos
export interface ReactiveResponse {
  text?: {
    response?: string[];
    correctResponse?: string[];
  };
  images?: {
    response?: Array<{
      url: string;
      alt?: string;
    }>;
  };
}

// Configuración estricta para contenido
export interface ReactiveContentConfig {
  content: ReactiveResponse[];
}
```

#### 3. Estrategias de Resolución de Errores

**A. Tipos Faltantes:**

```typescript
// En src/types/missing.d.ts
declare module 'react-native' {
  // Solo exportar lo que realmente necesitamos
  export const View: any;
  export const Text: any;
  export const ScrollView: any;
  export const TouchableOpacity: any;
  export const StyleSheet: any;
  
  export interface ViewStyle extends Record<string, any> {}
  export interface TextStyle extends Record<string, any> {}
}
```

**B. Tipos de Componentes Problemáticos:**

```typescript
// Para componentes que fallan en tipos
import { ComponentType } from 'react';

export const SafeComponent = <P extends object>(
  Component: ComponentType<P>
): ComponentType<P> => {
  return Component as ComponentType<P>;
};

// Uso:
const SafeView = SafeComponent(View);
const SafeText = SafeComponent(Text);
```

**C. Utility Types para Props:**

```typescript
// src/types/utilities.d.ts
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type StrictProps<T> = {
  [K in keyof T]-?: T[K];
};

export type ReactiveProps<T = {}> = T & {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (response: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  themeProps: StrictThemeProps;
};
```

#### 4. Herramientas de Debugging

**A. Script de verificación de tipos:**

```json
// En package.json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "type-coverage": "npx type-coverage --detail"
  }
}
```

**B. ESLint para TypeScript:**

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```json
// .eslintrc.js
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error"
  }
}
```

#### 5. Migración Gradual

**Paso 1: Configuración Base**
- Mantener `skipLibCheck: true` temporalmente
- Agregar tipos básicos para componentes principales

**Paso 2: Tipos Específicos**
- Crear tipos estrictos para ThemeProps
- Definir interfaces para ReactiveSchema

**Paso 3: Validación Estricta**
- Cambiar `skipLibCheck: false`
- Activar `strict: true`
- Resolver errores uno por uno

**Paso 4: Optimización**
- Usar utility types
- Implementar validación en runtime con zod/yup
- Generar tipos automáticamente

#### 6. Validación en Runtime

```typescript
// src/utils/validation.ts
import { z } from 'zod';

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

export const validateTheme = (theme: unknown): StrictThemeProps => {
  return ThemeSchema.parse(theme);
};
```

### Beneficios de las Mejoras

✅ **Mejor autocompletado** en IDEs  
✅ **Detección temprana de errores**  
✅ **Código más mantenible**  
✅ **Mejor documentación automática**  
✅ **Refactoring más seguro**

## 🔧 Desarrollo de la Librería

### Configuración del Entorno

1. **Remover tipos externos de React Native:**
   ```bash
   npm uninstall @types/react-native
   ```

2. **Configurar TypeScript:**
   - Usar `jsx: "react-native"`
   - Activar `skipLibCheck: true`
   - Incluir `"lib": ["ES2020", "DOM"]`

3. **Compilar:**
   ```bash
   npm run build
   ```

### Publicación

1. Incrementar versión en `package.json`
2. Compilar: `npm run build`
3. Publicar: `npm publish`

## 📝 Notas de Versión

### v1.1.0+
- ✅ Corregido Reactive42 para usar nueva estructura de datos
- ✅ Removida dependencia de react-native-drax
- ✅ Mejorada compatibilidad con React Native 0.79+
- ✅ Solucionados errores de tipos TypeScript

### Cambios Importantes

- **Reactive42:** Ahora busca sílabas en `correctAlternative.inputType.config.content` 
- **TouchableOpacity:** Reemplazado por implementación nativa
- **Tipos:** React Native 0.79+ incluye tipos nativos

## 🎨 Temas y Estilos

La librería utiliza un sistema de temas consistente. Todos los componentes aceptan `themeProps`:

```javascript
const themeProps = {
  colors: {
    primary: { main: '#007AFF', dark: '#0056CC', light: '#4DA3FF' },
    neutral: { white: '#FFFFFF', gray100: '#F5F5F5' }
  },
  spacing: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48],
  typography: { fontSize: {}, fontWeight: {} },
  borders: { width: {}, radius: {} }
};
```

## 🤝 Contribución

Para contribuir al desarrollo:
1. Hacer fork del repositorio
2. Crear branch con cambios
3. Asegurar que `npm run build` funcione sin errores
4. Crear pull request

## 📞 Soporte

Si encuentras problemas:
1. Verificar configuración de TypeScript
2. Comprobar versiones de React/React Native
3. Revisar que no tengas `@types/react-native` instalado 