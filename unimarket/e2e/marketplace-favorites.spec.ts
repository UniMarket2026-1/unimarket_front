import { expect, test } from "@playwright/test";

test("marketplace search and favorites flow", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /Marketplace Universitario|University Marketplace/,
    })
  ).toBeVisible();

  await page.getByRole("searchbox", { name: /Buscar|Search/i }).fill("MacBook");

  await expect(page.getByText("MacBook Air M1 2020")).toBeVisible();
  await expect(page.getByText("Calculadora Científica Casio FX-991LAX")).toHaveCount(0);

  await page
    .getByRole("button", { name: /Guardar MacBook Air M1 2020|Quitar MacBook Air M1 2020/i })
    .click();

  await page.getByRole("tab", { name: /Favoritos|Favorites/i }).click();

  await expect(page.getByText("MacBook Air M1 2020")).toBeVisible();
});
