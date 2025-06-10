# Apuntes sobre configuración de tests en React Native dentro de un monorepo de TypeScript

## 1. Preset de Jest
- Para proyectos RN la forma más sencilla es usar `preset: 'react-native'`, que ya incluye `babel-jest`, mocks y reglas de transformación.
- Si se quiere compilar TS con `ts-jest`, sigue siendo posible; basta con mantener la regla de `transform` con `ts-jest` **y** el preset `react-native`.

```js
module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  // resto de config…
};
```

## 2. Babel
- El preset que entiende la sintaxis de RN/Flow es `metro-react-native-babel-preset`.
- Añadir `babel.config.js` con:

```js
module.exports = { presets: ['module:metro-react-native-babel-preset'] };
```

## 3. Transformación de node_modules
- El preset anterior transpila internamente RN y sus polyfills, evitando errores como _"Missing semicolon (14:4) type ErrorHandler = …"_.
- Aun así, si se requiere procesar librerías externas adicionales, usar `transformIgnorePatterns`.

## 4. Mocks
- Evitar dependencias nativas no disponibles en Jest añadiendo mocks en `src/__mocks__` y mapeándolos con `moduleNameMapper`.
- Ej.: `react-native-vector-icons`, `@expo/vector-icons`, `react-native-drax`, `NativeAnimatedHelper`.
- No mockear `react-native` completo cuando se usa `preset: 'react-native'`; ya incluye un mock adecuado. Mockearlo manualmente causa elementos no válidos (`undefined` en `createElement`).

## 5. @testing-library/react-native
- Requiere componentes nativos (mockeados por RN preset). Si el componente no es válido obtendremos: _"Element type is invalid"_.
- Por eso no debemos reemplazar el mock de `react-native` incorporado.

## 6. Flujo recomendado
1. Instalar dependencias: `jest`, `react-test-renderer`, `@testing-library/react-native`, `metro-react-native-babel-preset`, `ts-jest`.
2. Configurar `babel.config.js`.
3. Configurar `jest.config.js` con `preset: 'react-native'` y `ts-jest`.
4. Añadir mocks **solamente** para librerías faltantes, no para `react-native`.

## 7. Errores por Flow en node_modules (`Unexpected token`, `EventEmitter.js`)
- El preset `react-native` ya provee un `transformIgnorePatterns` que **transpila** los paquetes `react-native`, `@react-native` y algunos más dentro de `node_modules` usando Babel.
- Si sobrescribimos esa clave o la dejamos vacía, Jest saltará la transformación y aparecerá el error de Flow (`type ErrorHandler = …`).
- Solución:
  1. **No** eliminar ni sobreescribir `transformIgnorePatterns`.
  2. Si necesitamos ampliarlo, extenderlo así:

  ```js
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  ```
  3. Mantener `babel-jest` como transformer para JS/JSX.
- Después de restaurar/ajustar esa opción los archivos dentro de `react-native` vuelven a ser transformados y desaparece el error.

## 8. Intentos adicionales y hallazgos (10 Jun 2025)

Durante la sesión de depuración surgió de nuevo el error de Flow en `EventEmitter.js`:

```
node_modules/react-native/Libraries/vendor/emitter/EventEmitter.js: Unexpected token, expected "]" (39:5)
```

### 8.1 Búsqueda en internet

Se consultaron diversos hilos y documentación con la búsqueda:

> "EventEmitter.js Unexpected token jest react native testing library flow"

Conclusiones extraídas:

1. El preset `metro-react-native-babel-preset` **ya incluye** el plugin para eliminar tipos Flow.
2. Añadir otros presets (por ejemplo `@babel/preset-typescript`) **antes** del preset de RN causa que Babel intente parsear los archivos `.js` con DCE/TS, fallando sobre la sintaxis Flow.
3. La recomendación oficial es **mantener** únicamente `module:metro-react-native-babel-preset` en `babel.config.js` cuando se trabaja con React Native 0.76+ y Jest.

Referencia principal: https://reactnative.dev/docs/testing-overview#jest-configuration (apartado *babel.config.js*)

### 8.2 Cambios aplicados

1. Se revirtió `babel.config.js` para dejar solo:

```js
module.exports = { presets: ['module:metro-react-native-babel-preset'] };
```

2. Se eliminó la dependencia `@babel/preset-typescript` del `package.json`.

3. Se mantuvo la regla de transformación para JS en `jest.config.js` usando `'babel-jest'` y la de `ts-jest` para TS/TSX.

Al ejecutar `npm test` tras estos cambios, Jest vuelve a transformar los módulos de RN correctamente y los tests pasan.

### 8.3 Ajustes finales de Babel (hermes y métodos privados)

Aparecieron nuevos errores de sintaxis:

* `Class private methods are not enabled. Please add @babel/plugin-transform-private-methods…`

Tras investigar hilos en GitHub y documentación oficial de Babel se concluyó que, desde React Native 0.72+, el código fuente incluye:

* Nuevas extensiones de Flow que requieren el **parser de Hermes**.
* Métodos y propiedades privadas de clase `#foo` ya compilados en el core de RN.

Para soportar ambas características en Jest/Babel se añadieron los plugins:

```js
plugins: [
  'babel-plugin-syntax-hermes-parser',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-private-methods',
  '@babel/plugin-proposal-private-property-in-object',
]
```

Con esto los 12/14 tests pasaron; los dos restantes fallan por la búsqueda de botones en el componente `Modal*`, lo cual ya es una cuestión de lógica de test y no de configuración.

Referencia principal:

* https://github.com/facebook/jest/issues/13173
* https://babeljs.io/docs/babel-plugin-transform-private-methods

## 9. Corrección de accesibilidad en componentes (todos los tests pasan)

Se añadieron atributos `accessibilityRole="button"` y `accessibilityLabel` en los elementos `Pressable` de `ModalFullImage` y `ModalText`, además de convertir el overlay a `Pressable` y agregar `testID="modal-content"`.

Resultado: **6/6 suites – 14/14 tests** aprobados.

## 10. Guía de tests por componente Reactivo

A partir de esta versión vamos a incluir **tests de integración con Testing Library** para cada componente de *reactivos* que vive en `src/reactives/`.  El objetivo es validar los casos de uso más importantes (render inicial, interacción principal y feedback de estado) sin depender de lógica interna ni de APIs nativas.

### 10.1 Patrones generales
1. **Renderizar el componente dentro de `ThemeProvider`** usando el tema por defecto o un mock de `themeProps`.
2. **Proveer todas las props requeridas** (p.
   ej. `reactive`, `responseUser`, `themeProps`, etc.).  Para cada prop compleja se recomienda crear un *fixture* en `__fixtures__/reactives/`.
3. **Simular la interacción principal** con `fireEvent` o `userEvent`:
   * `press` para botones (`AlternativeButton`, `SquareButton`).
   * `drag` y `drop` (solo en web) con `fireEvent.dragStart/dragOver/drop` cuando sea posible.
4. **Afirmar el cambio de estado visual**:
   * Comprobar que los estilos cambian (bordes de éxito/error) o que aparecen elementos de feedback.
   * Verificar que el *callback* `onResponseChange` se invoque con los valores esperados.
5. **Evitar snapshots** salvo para componentes puros sin interacción.

### 10.2 Checklist inicial de componentes a cubrir

| Componente | Archivo | Estado |
|------------|---------|--------|
| NoReactive | `src/reactives/NoReactive.tsx` | ✔ creado |
| Reactive1 | `src/reactives/Reactive1.tsx` | ✔ creado |
| Reactive2 | `src/reactives/Reactive2.tsx` | ✔ creado |
| Reactive3 | `src/reactives/Reactive3.tsx` | ✔ creado |
| Reactive7 | `src/reactives/Reactive7.tsx` | ✔ creado |
| Reactive12 | `src/reactives/Reactive12.tsx` | ✔ creado |
| Reactive18 | `src/reactives/Reactive18.tsx` | ✔ creado |
| Reactive20 | `src/reactives/Reactive20.tsx` | ✔ creado |
| Reactive21 | `src/reactives/Reactive21.tsx` | ✔ creado |
| Reactive25 | `src/reactives/Reactive25.tsx` | ✔ creado |
| Reactive38 | `src/reactives/Reactive38.tsx` | ✔ creado |
| Reactive40 | `src/reactives/Reactive40.tsx` | ✔ creado |
| Reactive42 | `src/reactives/Reactive42.tsx` | ✔ creado |
| Reactive52 | `src/reactives/Reactive52.tsx` | ✔ creado |
| Reactive58 | `src/reactives/Reactive58.tsx` | ✔ creado |
| Reactive68 | `src/reactives/Reactive68.tsx` | ✔ creado |
| Reactive70 | `src/reactives/Reactive70.tsx` | ✔ creado |
| Reactive71 | `src/reactives/Reactive71.tsx` | ✔ creado |

> Marca la casilla cuando el *test suite* correspondiente exista y pase (`npm test`).

### 10.3 Estructura de archivos de test

```
src/
  __tests__/reactives/
    Reactive1.test.tsx
    Reactive2.test.tsx
    …
__fixtures__/
  reactives/
    reactive1-basic.json
    reactive1-correct.json
    …
```

*Los fixtures contendrán los JSON mínimos de `ReactiveSchema` necesarios para renderizar cada componente.*

### 10.4 Ejemplo mínimo (NoReactive)

```tsx
afterEach(cleanup);

describe('<NoReactive />', () => {
  const defaultProps = { themeProps: defaultThemeProps };

  it('muestra el texto por defecto', () => {
    const { getByText } = render(<NoReactive {...defaultProps} />);
    expect(getByText(/No hay reactivo seleccionado/i)).toBeTruthy();
  });
});
```

> Copia este patrón y ajusta *props* y *expectations* según el componente.

### 10.5 Próximos pasos
1. Crear carpeta `__tests__/reactives` y el primer test para `<NoReactive />`.
2. Ejecutar `npm test` y actualizar la columna **Estado** a "✔" cuando pase.
3. Repetir para el resto de componentes.

## 11. Resumen de cobertura después de la segunda iteración (10 Jun 2025)

Tras añadir casos extra para los componentes con menor cobertura se obtuvieron los siguientes resultados con `npm test --coverage`:

| Métrica global | Antes | Ahora |
| -------------- | ----- | ----- |
| % Statements   | 68 %  | **71 %** |
| % Branches     | 45 %  | **48 %** |
| % Functions    | 62 %  | **66 %** |
| % Lines        | 71 %  | **75 %** |

Componentes que superaron el umbral mínimo (55 % líneas): `Reactive38`, `Reactive42`, `Reactive58`, `Reactive71`.

Componente que **sigue por debajo** y requiere más pruebas:

* `Reactive12` → 49 % líneas / 47 % statements (falta cubrir drag-and-drop completo y callbacks de respuesta final).

> Próximo objetivo: llevar `Reactive12` por encima del 70 % añadiendo tests que simulen la colocación correcta de todas las alternativas y validen los bordes de éxito/error.

### 11.1 Detalle de cobertura por componente (líneas)

| Componente | Cobertura líneas |
| ---------- | ---------------- |
| NoReactive | 100 % |
| Reactive1 | 83 % |
| Reactive2 | 97 % |
| Reactive3 | 94 % |
| Reactive7 | 93 % |
| **Reactive12** | **49 %** |
| Reactive18 | 74 % |
| Reactive20 | 85 % |
| Reactive21 | 91 % |
| Reactive25 | 90 % |
| Reactive38 | 55 % |
| Reactive40 | 90 % |
| Reactive42 | 60 % |
| Reactive52 | 90 % |
| Reactive58 | 94 % |
| Reactive68 | 82 % |
| Reactive70 | 81 % |
| Reactive71 | 77 % |

### 11.2 Comandos rápidos

* Ejecutar todas las pruebas con cobertura:

```bash
npm test -- --coverage
```

* Ver reporte HTML de cobertura:

```bash
open coverage/lcov-report/index.html  # macOS
```

* Ejecutar una sola suite:

```bash
npm test src/__tests__/reactives/Reactive12.test.tsx
```

* Correr Jest en modo watch interactivo:

```bash
npm test -- --watch
```

---
Estos puntos resumen los problemas encontrados (doble mock de RN, falta de preset Babel) y cómo resolverlos. 