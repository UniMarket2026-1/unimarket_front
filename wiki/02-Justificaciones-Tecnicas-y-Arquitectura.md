# Justificaciones Tecnicas y Arquitectura

## 1. Arquitectura de rutas con Next.js App Router

Se eligio App Router sobre Pages Router para aprovechar layouts anidados, separacion por carpeta/ruta y composicion mas limpia de vistas por HU.

Rutas principales:

- `/` marketplace
- `/product/[id]` detalle
- `/publish` publicacion
- `/chat` mensajeria
- `/profile` perfil
- `/purchases` compras
- `/seller` panel vendedor
- `/admin` panel admin

## 2. Estado global con AppContext

El estado transversal (productos, usuario, reportes, chat, notificaciones, compras y ratings) vive en `unimarket/src/contexts/AppContext.tsx`.

Beneficios:

- Persistencia de estado entre rutas sin prop drilling
- API de acciones consistente por HU
- Centralizacion de reglas de negocio

## 3. Hooks por dominio

Se encapsulo logica por HU en hooks dedicados:

- `useFavorites`
- `useFilters`
- `useNotifications`
- `useChat` y `useStartChat`
- `useProducts`

Beneficio principal: componentes de UI mas simples y testeables.

## 4. Internacionalizacion

`unimarket/src/i18n/translations.ts` centraliza textos ES/EN.

Ventajas:

- Evita hardcode de strings
- Facilita pruebas de UI con claves estables
- Mejora mantenibilidad

## 5. Accesibilidad (a11y)

Medidas implementadas:

- `aria-label` en controles interactivos
- estructura `tablist/tab/tabpanel`
- dialogos con `role="dialog"` y `aria-modal`
- `role="switch"` para toggles
- regiones con `aria-live`
- estilos globales `focus-visible`
- `skip-link` para salto a contenido principal
- respeto a `prefers-reduced-motion`

## 6. Observaciones de calidad

- Tipado estricto con TypeScript
- Pruebas unitarias + E2E
- Separacion clara de capas (UI, estado, logica)
