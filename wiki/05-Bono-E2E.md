# Bono E2E (Implementacion y Ejecucion)

## Stack y configuracion

Se implemento Playwright con:

- `@playwright/test`
- `unimarket/playwright.config.ts`
- navegador Chromium para CI/local
- arranque automatico del servidor con `npm run dev -- --port 3001`

Scripts agregados en `unimarket/package.json`:

- `test:e2e`
- `test:e2e:headed`
- `test:e2e:report`

## Cobertura E2E implementada

Carpeta: `unimarket/e2e/`

### 1) Marketplace y favoritos

Archivo: `marketplace-favorites.spec.ts`

Valida:

- carga del marketplace
- busqueda por termino
- agregar favorito
- visualizacion en tab de favoritos

### 2) Detalle de producto, reporte y chat

Archivo: `product-report-chat.spec.ts`

Valida:

- acceso a detalle de producto
- apertura y envio de reporte
- contacto a vendedor
- envio de mensaje en chat

### 3) Notificaciones con deep-link

Archivo: `notifications-chat-link.spec.ts`

Valida:

- apertura del panel de notificaciones
- click en notificacion de mensaje
- redireccion a chat correcto (`chatId=c1`)

### 4) Compras: calificacion y reventa

Archivo: `purchases-resell-rating.spec.ts`

Valida:

- flujo de calificacion de vendedor
- cambio visual a estado calificado
- boton revender y prellenado de formulario en `/publish`

### 5) Vendedor y moderacion admin

Archivo: `seller-admin-moderation.spec.ts`

Valida:

- activar/desactivar publicacion en panel vendedor
- acceso restringido a `/admin` sin rol admin
- cambio de rol a admin
- accion de moderacion (eliminar) y feedback visual

## Como correr E2E

Desde `unimarket/`:

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Modo visual:

```bash
npm run test:e2e:headed
```

Ver reporte:

```bash
npm run test:e2e:report
```

## Resultado de verificacion actual

- Suite ejecutada localmente: 5/5 tests pasando
- Flujos cubren navegacion critica y acciones HU de mayor impacto funcional
