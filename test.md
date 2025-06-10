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

---
Estos puntos resumen los problemas encontrados (doble mock de RN, falta de preset Babel) y cómo resolverlos. 