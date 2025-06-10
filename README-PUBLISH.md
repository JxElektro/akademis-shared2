# Guía: Cómo subir una nueva versión de `@developersakademi/akademi-shared`

Este documento describe el **flujo completo** para publicar una nueva versión de la librería privada en Artifact Registry y posteriormente consumirla en tu aplicación.

---

## 📋 Prerrequisitos

1. **Google Cloud SDK instalado** (`gcloud`).
2. **Permisos** en el proyecto `akademiapp-backend-qa`: al menos **Artifact Registry Writer** o **Editor**.
3. **Node.js** y **npm** configurados.
4. (Opcional) En tu máquina local, **ignorar `.npmrc`** en Git: añade `.npmrc` a tu `.gitignore`.

---

## 🔄 Flujo para publicar en la librería

1. **Sitúate en tu repo**:
   ```bash
   cd ~/ruta/a/akademi-shared
   ```

2. **Commitea tus cambios** (nuevos exports, fixes, etc.):

   ```bash
   git status
   git add .
   git commit -m "Describe brevemente los cambios para la próxima versión"
   ```

3. **Limpia `dist/`** para evitar restos de versiones anteriores:

   ```bash
   rm -rf dist
   ```

4. **Bump de versión** (patch, minor o la versión exacta):

   ```bash
   # Para patch:
   npm version patch

   # O explícito:
   npm version 1.0.20
   ```

   Esto actualiza `package.json`, crea el tag Git `v1.0.20` y hace commit.

5. **Recompila**:

   ```bash
   npm run build
   ```

   Verifica:

   ```bash
   ls dist
   cat dist/index.d.ts | head -n 20
   ```

6. **Dry-run** (opcional, para revisar empaquetado):

   ```bash
   npm publish --dry-run
   ```

   Asegúrate de que solo incluye `dist/`, `package.json` y `README.md`.

7. **Configura tu token** y `.npmrc` local (NO versionarlo):

   ```bash
   export TOKEN=$(gcloud auth print-access-token)
   cat <<EOF > .npmrc
   @developersakademi:registry=https://us-central1-npm.pkg.dev/akademiapp-backend-qa/akademi-shared/
   //us-central1-npm.pkg.dev/akademiapp-backend-qa/akademi-shared/:_authToken=\${TOKEN}
   EOF
   ```

8. **Publica** la nueva versión:

   ```bash
   npm publish
   ```

   Deberías ver:

   ```
   + @developersakademi/akademi-shared@1.0.20
   ```

9. **Verifica en GCP**:

   ```bash
   gcloud artifacts versions list \
     --repository=akademi-shared \
     --location=us-central1 \
     --package="@developersakademi/akademi-shared" \
     --format="table(name.basename(),createTime)"
   ```

   Confirma que **1.0.20** aparece con la fecha y hora adecuadas.

---

## 📦 Flujo para consumir la nueva versión

En cualquier proyecto que quiera usar la librería:

1. **Sitúate** en la carpeta del proyecto:

   ```bash
   cd ~/ruta/a/tu-proyecto
   ```

2. **Genera un token** fresco:

   ```bash
   export TOKEN=$(gcloud auth print-access-token)
   ```

3. **Crea o actualiza** `.npmrc` local:

   ```ini
   @developersakademi:registry=https://us-central1-npm.pkg.dev/akademiapp-backend-qa/akademi-shared/
   //us-central1-npm.pkg.dev/akademiapp-backend-qa/akademi-shared/:_authToken=${TOKEN}
   ```

   > Asegúrate de **no** tener otras entradas `registry=` que anulen este scope.

4. **Limpia e instala**:

   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install @developersakademi/akademi-shared@^1.0.20
   npm install   # instala el resto de dependencias desde npmjs.org
   ```

5. **Importa** en tu código:

   ```js
   import { AlternativeButton, Verify } from '@developersakademi/akademi-shared';
   ```

---

## 🛠️ Solución de problemas

* **403 Forbidden**: Regenera `TOKEN`, revisa roles en GCP y tu `.npmrc`.
* **No matching version**: Lista versiones con `gcloud artifacts versions list` y ajusta el rango (`^1.0.x`).
* **ENOSPC**: Libera espacio en disco.

---

## 📝 Notas de la Versión 1.0.20

### 🔧 Correcciones de Bugs
- **ModalText.tsx**: Agregada validación segura para props `images`
  - Cambio: `images.length > 0` → `(images?.length || 0) > 0`
  - Cambio: `images.map()` → `(images || []).map()`
  - **Impacto**: Previene errores cuando `images` es `undefined` o `null`

### 🛡️ Mejoras de Seguridad
- Validación null-safe implementada siguiendo mejores prácticas
- Uso de optional chaining (`?.`) y operadores de coalescencia (`||`)

### 📅 Fecha de Publicación
- **Versión**: 1.0.20
- **Fecha**: 2025-06-04 20:14:41 UTC
- **Tipo**: Patch (corrección de bugs)

---

*Última actualización: 2025-06-04 20:14:41* 