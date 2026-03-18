# Guia de Ejecucion

## Requisitos previos

- Node.js 20+
- npm 10+
- Docker (opcional)

## Ejecucion local

Desde `unimarket/`:

```bash
npm install
npm run dev
```

Abrir:

- http://localhost:3000

## Comandos utiles

```bash
npm run build
npm run start
npm test
npm run test:coverage
npm run test:e2e
```

## Ejecucion con Docker

Desde `unimarket/`:

```bash
docker build -t unimarket .
docker run -p 3000:3000 unimarket
```

Abrir:

- http://localhost:3000

## Pruebas

- Unitarias: `npm test`
- E2E Playwright: `npm run test:e2e`
- Reporte E2E HTML: `npm run test:e2e:report`
