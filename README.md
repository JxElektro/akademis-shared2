# Akademi Shared

Este paquete contiene componentes y reactivos compartidos para proyectos de Akademi.

## Instalación

```bash
npm install @developersakademi/akademi-shared
# o
yarn add @developersakademi/akademi-shared
```

## Estructura del proyecto

```
akademi-shared/
├── .storybook/        # Configuración de Storybook
├── src/
│   ├── components/    # Componentes UI reutilizables
│   ├── reactives/     # Componentes de preguntas específicos
│   ├── styles/        # Estilos y tema compartido
│   ├── theme/         # Contexto y proveedor del tema de la app
│   ├── types/         # Definiciones de tipos TypeScript
│   ├── utils/         # Funciones utilitarias
│   └── index.ts       # Punto de entrada principal
├── __tests__/         # Tests unitarios
└── dist/              # Código compilado (generado automáticamente)
```

## Uso

Actualmente la librería expone principalmente los **reactivos pedagógicos**.  
Para utilizarlos en tu proyecto basta con importar los que necesites:

```jsx
import { Reactive1, Reactive21 } from '@developersakademi/akademi-shared';
```

Si deseas utilizar alguno de los **componentes internos** (por ejemplo `Card` o `ModalText`) puedes importarlos directamente desde la carpeta compilada `dist`. Ten en cuenta que su API puede cambiar sin previo aviso:

```tsx
import Card from '@developersakademi/akademi-shared/dist/components/Card';
```

## Temas (Theme)

Todos los componentes y reactivos consumen un objeto `themeProps` que describe su paleta de colores, tipografías, espaciamiento y otros tokens de diseño.

La librería incluye un tema base llamado `defaultThemeProps`. Si **no** envías la prop `themeProps`, se aplicará automáticamente este tema por defecto.

```tsx
import { defaultThemeProps } from '@developersakademi/akademi-shared/dist/theme/defaultProps';

<Reactive1
  reactive={data}
  responseUser={responses}
  onResponseChange={setResponses}
  themeProps={defaultThemeProps} // <- opcional, se usa por defecto
/>
```

### Usar un tema personalizado

1. Crea un objeto que cumpla con la interfaz `ThemeProps` exportada por la librería.
2. Pásalo a tus Reactives/Componentes vía la prop `themeProps`.

```ts
import type { ThemeProps } from '@developersakademi/akademi-shared';

export const darkTheme: ThemeProps = {
  ...defaultThemeProps,
  colors: {
    ...defaultThemeProps.colors,
    primary: {
      ...defaultThemeProps.colors.primary,
      main: '#ffffff',
      dark: '#e5e5e5',
    },
    neutral: {
      ...defaultThemeProps.colors.neutral,
      white: '#1a1a1a',
      gray100: '#333333',
    },
  },
};
```

```tsx
<Reactive20
  reactive={data}
  responseUser={responses}
  onResponseChange={setResponses}
  themeProps={darkTheme} // <- tu tema
/>
```

> Asegúrate de incluir todas las propiedades requeridas por la interfaz `ThemeProps`; de lo contrario, TypeScript señalará los campos faltantes.

### Interfaz `ThemeProps` completa

```ts
export interface ThemeProps {
  colors: {
    primary: {
      main: string;      // Texto/borde no seleccionado
      light: string;     // Fondo seleccionado
      lighter?: string;  // Fondo no seleccionado
      dark: string;
      lightest?: string; // Texto/borde seleccionado
    };
    neutral: {
      white: string;
      gray100?: string;
      gray200?: string;
      gray300?: string;
      gray400?: string;
      gray500?: string;
    };
    feedback: {
      success: {
        main: string;
        light: string;
        dark: string;
      };
      error: {
        main: string;
        light: string;
        dark: string;
      };
      warning?: {
        main: string;
        light: string;
        dark: string;
      };
      info?: {
        main: string;
        light: string;
        dark: string;
      };
    };
    ui?: {
      button: string;
    };
    state?: {
      default: string;
      selected?: string;
      focused?: string;
      disabled?: string;
      correct?: string;
      incorrect?: string;
      pending?: string;
    };
  };
  typography: {
    fontSize: {
      base: number;
      lg: number;
      xl: number;
      sm?: number;
      md?: number;
    };
    fontWeight: {
      semibold: "600" | 600;
      bold: "700" | 700;
      normal?: "400" | 400;
    };
    fontFamily: string;
  };
  spacing: number[];
  borders: {
    radius: {
      lg: number;
      md: number;
      sm?: number;
    };
    width: {
      normal: number;
      thin?: number;
      medium?: number;
      thick?: number;
    };
  };
  shadows: {
    md: any; // Simplificado
  };
  animations: {
    opacity: {
      pressed: number;
      disabled?: number;
      normal?: number;
    };
    scale?: {
      pressed?: number;
      normal?: number;
    };
  };
  sizes?: {
    squareButton?: {
      small: { height: number };
      medium: { height: number };
      large: { height: number };
    };
  };
  AkademiColors?: {
    azulPrincipal: string;
    verdeAkademi: string;
    amarilloAkademi: string;
    azulClaro: string;
    rojoAkademi: string;
    turquesa: string;
  };
}
```

## Componentes disponibles

- AlternativeButton
- Card
- CustomButton
- ModalFullImage
- ModalText
- SquareButton

## Reactivos disponibles

- Reactive1
- Reactive2
- Reactive3
- Reactive7
- Reactive12
- Reactive18
- Reactive20
- Reactive21
- Reactive25
- Reactive38
- Reactive40
- Reactive42
- Reactive52
- Reactive58
- Reactive68
- Reactive70
- Reactive71
- NoReactive

## Desarrollo

Para desarrollar y probar los componentes:

```bash
npm run storybook
```

Para construir la librería:

```bash
npm run build
```

## Publicación

Para publicar una nueva versión:

```bash
npm version patch # o minor, o major
npm publish
```

## Storybook

Storybook permite visualizar y documentar los componentes React Native de la librería.

1. Ejecuta Storybook en modo web:

```bash
npm run storybook
```

2. Abre http://localhost:6006 en tu navegador para ver todos los componentes.

No es necesario instalar Expo ni utilizar un emulador, ya que utilizamos `react-native-web` para renderizar los componentes en el navegador web.

### Escribir historias

Crea archivos con extensión `.stories.tsx` junto a tus componentes:

```tsx
// MiComponente.stories.tsx
import React from 'react';
import MiComponente from './MiComponente';

export default {
  title: 'Componentes/MiComponente',
  component: MiComponente,
};

export const Normal = () => <MiComponente />;
export const ConPropiedades = () => <MiComponente propiedad="valor" />;
```

### Buenas prácticas

Asegúrate de que tus componentes se ejecuten correctamente tanto en React Native como en `react-native-web` para una mejor experiencia de desarrollo.
