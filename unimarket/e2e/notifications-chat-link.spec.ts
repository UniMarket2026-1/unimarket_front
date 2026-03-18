import { expect, test } from "@playwright/test";

test("notification panel opens and deep-links to specific chat", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Notificaciones|Notifications/i }).click();

  await expect(page.getByRole("dialog", { name: /Notificaciones|Notifications/i })).toBeVisible();
  await expect(page.getByText(/Nuevo mensaje de Maria Garcia/i)).toBeVisible();

  await page.getByText(/Nuevo mensaje de Maria Garcia/i).click();

  await expect(page).toHaveURL(/\/chat\?chatId=c1/);
  await expect(page.getByRole("main", { name: /Chat con Maria Garcia/i })).toBeVisible();
});
