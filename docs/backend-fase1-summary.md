# Resumen: FASE 1 - Backend (registro de cambios)

Fecha: 2025-11-19

Resumen de acciones realizadas en la FASE 1 (Paso 1 y 2):

- Scaffold del monorepo y aplicación `apps/api` usando NestJS + TypeScript.
- Implementación del flujo de autorización: invitación (`invite`) -> establecer contraseña (`set-password`) -> login (JWT invite + access tokens).
- Adaptador de correo para desarrollo (escritura de payloads locales) y placeholder para Mailgun en producción.
- Módulos principales añadidos: `pautas`, `uploads`, `companies`, `roles`, `machines`.
- `UploadsService`:
  - Guarda archivos en `public/uploads/<companyId>/<YYYYMMDD>`.
  - Se estandarizó el nombre de archivo a: `<timestamp>-<uuidv4>.<ext>`.
  - Se solucionó incompatibilidad con `uuid` ESM en Jest usando `uuid@8.3.2` (CommonJS) y mock en tests.
- Validación:
  - Habilitado `ValidationPipe` global en `main.ts` con `{ whitelist: true, transform: true }`.
  - Actualizados los tests e2e para usar la misma configuración de validación.
- Tests:
  - Unit y e2e tests añadidos y reparados; e2e usa `mongodb-memory-server`.
  - Se añadieron tests edge-case para `pautas` y `uploads`.
  - Se añadió un test unitario determinista para `UploadsService` (mocks de `fs`, `uuid` y tiempo).

Commits y flujo Git:
- Se creó la rama `tests/uploads/deterministic-filename` y se hizo commit con los cambios de test.
- La rama fue subida al remoto `https://github.com/GonzaloOrellanaC/plataforma-mantencion.git`.

Notas operativas y recomendaciones:
- El servicio de `uploads` usa almacenamiento en disco local para desarrollo. Para producción, considerar:
  - Usar almacenamiento en la nube (S3, Azure Blob) y configurar variables de entorno.
  - Limpieza/rolado de archivos y permisos.
- Mantener `uuid@8` o migrar a `uuid@9` con la configuración de Jest/ESM adecuada.
- Integración frontend:
  - Proveer endpoint de subida autenticado (`/uploads/photos`) y devolver `url` y `path` públicos.
  - Consentir CORS y configuración de `public` static assets en NestJS si el frontend necesita acceder directamente.

Registro de pruebas locales:
- `npm run test:unit` — tests unitarios pasan (22 tests).
- `npm run test:e2e` — suites e2e añadidas y verificadas localmente durante el desarrollo.

Contacto/estado:
- Cambios empujados a la rama `tests/uploads/deterministic-filename` en el remoto indicado.

---
Este archivo fue generado automáticamente como registro del trabajo completado en FASE 1 para que el equipo frontend pueda continuar con la implementación del cliente.
