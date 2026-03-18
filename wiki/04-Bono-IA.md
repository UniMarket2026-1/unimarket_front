# Bono IA

## Objetivo

Acelerar la creacion de publicaciones con autocompletado inteligente a partir de una imagen.

## Flujo funcional

En `/publish`, despues de cargar imagen, aparece el boton de IA:

- "Autocompletar con IA"
- estado de carga: "Analizando imagen..."
- al completar: precarga nombre, descripcion, categoria, condicion, detalle y precio sugerido

## Implementacion actual (Ciclo 1)

Archivo clave:

- `unimarket/src/lib/ai.ts`

Contrato de la funcion:

```ts
analyzeImageWithAI(imageUrl: string): Promise<ProductSuggestion>
```

Estado actual:

- Stub funcional con latencia simulada
- UI completa y conectada en `unimarket/src/components/publish/PublishProduct.tsx`
- pruebas unitarias dedicadas en `unimarket/src/__tests__/ai.test.ts`

## Plan de conexion para Ciclo 2

Solo se reemplaza la implementacion interna de `analyzeImageWithAI`, manteniendo firma y retorno.

Esto minimiza impacto en UI y evita regresiones en la integracion de formulario.
