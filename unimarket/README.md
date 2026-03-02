# UniMarket — Marketplace Universitario

Plataforma de compra-venta entre estudiantes universitarios. Permite publicar, buscar, comprar y calificar productos dentro de la comunidad académica.

## Equipo

| Integrante | HUs asignadas |
|---|---|
| Integrante 1 | HU-01 (Favoritos), HU-02 (Búsqueda/Filtros), HU-03 (Calificaciones) |
| Integrante 2 | HU-04 (Reventa), HU-05 (Notificaciones), HU-06 (Chat) |
| Integrante 3 | HU-07 (Publicar), HU-08 (Historial ventas), HU-09 (Detalle condición) |
| Integrante 4 | HU-10 (Activar/desactivar), HU-11 (Métricas admin), HU-12 (Moderación) |

## Stack Técnico

- **Next.js 16 (App Router)** — Enrutamiento por archivos, Server/Client components
- **React 19 + TypeScript** — UI declarativa con tipado estático
- **Tailwind CSS v4** — Estilos utility-first
- **Framer Motion (motion/react)** — Animaciones fluidas
- **Recharts** — Gráficos de métricas para administradores
- **Sonner** — Notificaciones toast
- **Jest 30 + @testing-library/react** — Pruebas unitarias

## Decisiones Arquitectónicas

### Next.js App Router
Se eligió App Router sobre Pages Router para aprovechar React Server Components, layouts anidados y el sistema de rutas con carpetas. Cada vista principal es una ruta independiente (`/`, `/product/[id]`, `/publish`, `/chat`, `/profile`, `/purchases`, `/seller`, `/admin`), lo que mejora la navegabilidad y el SEO.

### Estado Global con React Context (AppContext)
Toda la lógica de estado (productos, usuario, chats, notificaciones, reportes) se centraliza en `AppContext` envuelto en el `layout.tsx` raíz. Esto garantiza que el estado persiste entre navegaciones de página sin rerenders innecesarios. Los handlers usan `useCallback` para estabilizar referencias.

### Custom Hooks por Dominio
Cada HU tiene su propio hook para separar lógica de presentación:
- `useFavorites` (HU-01) — Toggle favoritos con toast feedback
- `useFilters` (HU-02) — `useMemo` para filtrado eficiente
- `useNotifications` (HU-05) — Navegación al hacer clic en notificaciones
- `useChat` / `useStartChat` (HU-06) — Mensajería con URL params
- `useProducts` (HU-07/10) — CRUD de productos con toasts

### Navegación de Notificaciones (HU-05 + HU-06)
Las notificaciones de tipo `message` incluyen el campo `linkChatId`. Al hacer clic, `useNotifications` usa `useRouter.push(`/chat?chatId=${linkChatId}`)` para abrir directamente el chat específico. La página `/chat` usa `useSearchParams()` envuelto en `<Suspense>` (requerimiento de App Router).

### AI Auto-fill Stub (Bonus)
La función `analyzeImageWithAI(imageUrl)` en `src/lib/ai.ts` simula análisis de imagen con un delay de 1.5-2.5s y devuelve datos predeterminados. Para Ciclo 2, **solo hay que reemplazar el cuerpo de esta función** con la llamada real (OpenAI Vision, Gemini Pro Vision, etc.) — la firma y la UI permanecen intactas.

## Instalación y Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Pruebas

```bash
npm test
```

Las pruebas cubren las 12 HUs con mínimo 3 tests por HU (utils, hooks y componentes).

## Docker

### Construir imagen

```bash
docker build -t unimarket .
```

### Ejecutar contenedor

```bash
docker run -p 3000:3000 unimarket
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

La imagen usa **multi-stage build** (deps → builder → runner) con salida `standalone` de Next.js para minimizar el tamaño final (~80% más pequeño que una imagen estándar). El runner usa un usuario no-root por seguridad.

## Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (providers + nav)
│   ├── page.tsx            # / → Marketplace
│   ├── product/[id]/       # /product/:id → ProductDetail
│   ├── publish/            # /publish → PublishProduct (+ AI)
│   ├── chat/               # /chat → ChatView
│   ├── purchases/          # /purchases → PurchaseHistory
│   ├── profile/            # /profile → Profile
│   ├── seller/             # /seller → SellerDashboard
│   └── admin/              # /admin → AdminDashboard
├── components/
│   ├── layout/             # Header, BottomNav
│   ├── shared/             # NotificationsPanel, ReportModal, ImageWithFallback
│   ├── marketplace/        # Marketplace + ProductCard
│   ├── product/            # ProductDetail
│   ├── publish/            # PublishProduct (AI autofill)
│   ├── seller/             # SellerDashboard
│   ├── admin/              # AdminDashboard (recharts)
│   ├── chat/               # ChatView
│   ├── purchases/          # PurchaseHistory (rating modal)
│   └── profile/            # Profile (favorites, settings)
├── contexts/
│   └── AppContext.tsx      # Global state provider
├── hooks/
│   ├── useFavorites.ts     # HU-01
│   ├── useFilters.ts       # HU-02
│   ├── useNotifications.ts # HU-05
│   ├── useChat.ts          # HU-06
│   └── useProducts.ts      # HU-07/10
├── i18n/
│   ├── translations.ts     # ES/EN strings
│   └── LanguageContext.tsx # Language provider
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── mockData.ts         # Datos de prueba
│   ├── utils.ts            # cn, formatCurrency, timeAgo
│   └── ai.ts               # AI stub (analyzeImageWithAI)
└── __tests__/              # Jest tests (36+ tests, 12 HUs)
```

## Internacionalización (i18n)

La app soporta **Español** (por defecto) e **Inglés**. El idioma se controla desde el header. Todos los textos visibles al usuario pasan por `useLang()` → `t.namespace.key` sin texto hardcoded en componentes.

## Accesibilidad (a11y)

- Todos los botones interactivos tienen `aria-label`
- Formularios usan `<label>` o `aria-label` en inputs
- Listas usan `role="list"` + `role="listitem"`
- Tabs usan `role="tab"`, `aria-selected`, `role="tablist"`
- Modales usan `role="dialog"`, `aria-modal`
- Switches de toggle usan `role="switch"`, `aria-checked`
- Regiones dinámicas usan `aria-live="polite"` o `"assertive"`
- Íconos decorativos tienen `aria-hidden="true"`

