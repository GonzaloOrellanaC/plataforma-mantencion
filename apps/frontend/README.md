# Frontend (Ionic) — apps/frontend

Este directorio contiene la aplicación cliente generada con Ionic (Angular). Este README resume cómo instalar, ejecutar y configurar la app para conectarse al backend `apps/api`.

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
npm run start
# o con Ionic CLI
npx ionic serve
```

Configuración de la URL del backend

La app usa `environment` de Angular para configurar la URL base de la API. Edita:

```text
apps/frontend/src/environments/environment.ts
```

Modifica la propiedad `apiUrl` (o añade una) por la URL donde se ejecuta el backend (ej: `http://localhost:3000`). Ejemplo:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

Consumo del endpoint de uploads

- El backend expone un endpoint de subida (ej: `POST /uploads/photos`) que espera `multipart/form-data` con el campo `file`.
- Asegúrate de enviar el token Bearer en `Authorization` para endpoints protegidos.

Notas para desarrollo
- Si vas a probar integraciones con archivos, la carpeta `apps/api/public/uploads` contiene los archivos subidos en modo desarrollo.
- Ajusta CORS en el backend si es necesario (`app.enableCors({ origin: 'http://localhost:8100' })`).

Construir para producción

```powershell
npm run build
# para Capacitor (opcional)
npx ionic capacitor add android
npx ionic capacitor add ios
```

Soporte y siguientes pasos
- Puedes añadir servicios Angular para encapsular llamadas a la API en `apps/frontend/src/app/services`.
- Si quieres, puedo añadir un ejemplo de `UploadService` y un componente de prueba que suba fotos al backend.
