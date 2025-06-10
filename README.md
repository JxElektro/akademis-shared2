# Akademi Shared

Este paquete contiene componentes y reactivos compartidos para proyectos de Akademi.

## Instalación

```bash
npm install @developersakademi/akademi-shared
```

o

```bash
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
│   ├── theme/         # Context y provider del tema
│   ├── types/         # Definiciones de tipos TypeScript
│   ├── utils/         # Funciones utilitarias
│   └── index.tsx      # Punto de entrada principal
├── __tests__/         # Tests unitarios
└── dist/              # Código compilado (generado automáticamente)
```

## Uso

Para importar componentes:

```jsx
import {  Card, IconButton } from '@developersakademi/akademi-shared';


Para importar reactivos:

```jsx
import { Reactive1, Reactive21 } from '@developersakademi/akademi-shared';

// Usar el reactivo
<Reactive1 
  reactive={reactiveData}
  responseUser={responseUser}
  onResponseChange={handleResponse}
/>
```

## Componentes disponibles

- AlternativeButton
- AlternativesTarget
- Card
- CustomButtom
- IconButton
- ModalFullImage
- ModalText
- SimpleIconButton
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

## Documentación de componentes

Puedes ver la documentación de los componentes disponibles ejecutando Storybook.

## Storybook

Esta biblioteca incluye Storybook para visualizar y documentar los componentes React Native.

### Desarrollo con Storybook

1. Ejecuta Storybook en modo web:
```bash
npm run storybook
```

2. Abre http://localhost:6006 en tu navegador para ver todos los componentes.

3. No es necesario instalar Expo ni utilizar un emulador, ya que utilizamos react-native-web para renderizar los componentes en el navegador web.

### Escribir historias

Crea archivos con extensión `.stories.tsx` junto a tus componentes:

```tsx
// MiComponente.stories.tsx
import React from 'react';
import MiComponente from './MiComponente';

export default {
  title: 'Componentes/MiComponente', // Categorización en Storybook
  component: MiComponente,
};

// Diferentes variantes del componente
export const Normal = () => <MiComponente />;
export const ConPropiedades = () => <MiComponente propiedad="valor" />;
```

### Implementaciones de componentes

Asegúrate de que tus componentes se ejecuten correctamente tanto en React Native como en react-native-web para una mejor experiencia de desarrollo. # akademis-shared2
