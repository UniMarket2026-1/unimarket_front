import { expect, test } from "@playwright/test";

test("product detail, report submission and chat contact", async ({ page }) => {
  await page.goto("/product/p1");

  await expect(page).toHaveURL(/\/product\//);
  await expect(page.getByRole("heading", { name: /Libro Cálculo de Stewart/i })).toBeVisible();

  await page.getByRole("button", { name: /Reportar publicación|Report listing/i }).click();
  await expect(page.getByRole("dialog", { name: /Reportar Publicación/i })).toBeVisible();

  await page.getByLabel(/Motivo breve/i).fill("Inconsistencia entre precio y estado");
  await page
    .getByLabel(/Descripción detallada/i)
    .fill("El estado reportado no coincide con la información mostrada en las imágenes.");

  await page.getByRole("button", { name: /Enviar Reporte/i }).click();
  await expect(page.getByRole("dialog", { name: /Reportar Publicación/i })).toHaveCount(0);

  await page.getByRole("button", { name: /Contactar Vendedor|Contact Seller/i }).click();

  await expect(page).toHaveURL(/\/chat\?chatId=/);
  await expect(page.getByRole("main", { name: /Chat con/i })).toBeVisible();

  await page.getByRole("textbox", { name: /Escribe un mensaje|Write a message/i }).fill("Hola, ¿sigue disponible?");
  await page.getByRole("button", { name: /Enviar mensaje/i }).click();

  await expect(page.getByText("Hola, ¿sigue disponible?").last()).toBeVisible();
});
