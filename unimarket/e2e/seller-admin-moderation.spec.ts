import { expect, test } from "@playwright/test";

test("seller actions and admin moderation access", async ({ page }) => {
  await page.goto("/seller");

  await expect(page.getByRole("heading", { name: /Panel de Vendedor|Seller Dashboard/i })).toBeVisible();

  const deactivateButton = page.getByRole("button", { name: /Desactivar|Deactivate/i }).first();
  await deactivateButton.click();

  await expect(page.getByRole("button", { name: /Activar|Activate/i }).first()).toBeVisible();

  await page.goto("/admin");
  await expect(page.getByText(/Acceso restringido a administradores/i)).toBeVisible();

  await page.getByRole("button", { name: /ADMIN/i }).click();

  await expect(page.getByRole("heading", { name: /Panel de Administración/i })).toBeVisible();

  await page.getByRole("button", { name: /^Eliminar$/i }).first().click();
  await expect(page.getByText(/Producto eliminado correctamente/i)).toBeVisible();
});
