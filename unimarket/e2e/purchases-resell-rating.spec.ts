import { expect, test } from "@playwright/test";

test("purchase rating and resell prefill flow", async ({ page }) => {
  await page.goto("/purchases");

  await expect(page.getByRole("heading", { name: /Mis Compras|My Purchases/i })).toBeVisible();

  await page.getByRole("button", { name: /Calificar vendedor|Rate Seller/i }).first().click();

  await expect(page.getByRole("dialog", { name: /Calificar vendedor|Rate Seller/i })).toBeVisible();

  await page.getByRole("button", { name: /5 estrellas|5 stars/i }).click();
  await page
    .getByLabel(/Comentario|Comment/i)
    .fill("Entrega puntual y producto en buen estado, recomendado.");

  await page.getByRole("button", { name: /Enviar Calificación|Submit Rating/i }).click();

  await expect(page.getByText(/Calificado|Rated/i).first()).toBeVisible();

  await page.getByRole("button", { name: /Revender|Resell/i }).first().click();

  await expect(page).toHaveURL(/\/publish/);
  await expect(page.getByLabel(/Nombre del producto/i)).toHaveValue(/Libro Cálculo de Stewart/i);
});
