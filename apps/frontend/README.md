# Frontend (Ionic React) — apps/frontend

Este directorio contiene la aplicación cliente generada con Ionic + React (Vite). Este README resume cómo instalar, ejecutar y configurar la app para conectarse al backend `apps/api`.

Requisitos
- Node.js (v16+ recomendado)
- npm (o yarn)
- Ionic CLI (opcional, puede usarse con `npx ionic`)

Instalación de dependencias

Desde la raíz del monorepo o directamente en el directorio del frontend:

```powershell
cd C:\Users\gorel\Documents\Personales\sgm\sgm-monorepo\apps\frontend
npm install
```

Ejecutar en desarrollo

```powershell
npm run dev
# o con Ionic CLI
npx ionic start # (si necesitas crear proyectos nativos con capacitor)
```

Configuración de la URL del backend

Edita `apps/frontend/apps-frontend/src/pages` o crea un servicio para consumir la API. Para configurar la URL base, crea o ajusta un archivo de configuración, por ejemplo `src/config.ts`:

```ts
export const API_URL = 'http://localhost:3000';
```

Consumo del endpoint de uploads

- El backend expone un endpoint de subida (ej: `POST /uploads/photos`) que espera `multipart/form-data` con el campo `file`.
- Asegúrate de enviar el token Bearer en `Authorization` para endpoints protegidos.

Notas para desarrollo
- Los scripts del proyecto React (Vite) están en `package.json`: `dev`, `build`, `preview`.
- La carpeta `apps/api/public/uploads` contiene los archivos subidos en modo desarrollo del backend.
- Ajusta CORS en el backend si es necesario (`app.enableCors({ origin: 'http://localhost:5173' })` o el puerto que uses para Vite).

Construir para producción

```powershell
npm run build
npm run preview
```

Soporte y siguientes pasos
- Puedo añadir un ejemplo de `UploadService` en React que use `fetch` o `axios` para enviar `FormData` con autorización.
- Si prefieres que el app esté en `apps/frontend` raíz (sin la carpeta interna `apps-frontend`), ya reorganicé los archivos para que el proyecto esté en `apps/frontend`.
