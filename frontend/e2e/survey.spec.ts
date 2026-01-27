import { test, expect } from '@playwright/test';

test('surveys are not shown immediately during long loading', async ({ page }) => {
  await page.route('**/api/surveys**', async route => {
    await new Promise(res => setTimeout(res, 3000));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });

  await page.goto('/surveys');

  // во время задержки данные не должны быть сразу видны
  await expect(
    page.locator('text=No surveys')
  ).not.toBeVisible({ timeout: 1000 });
});

test('does not trigger duplicate save requests on double submit (race condition)', async ({ page }) => {
  let requestCount = 0;

  await page.route('**/api/**', route => {
    requestCount++;
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true })
    });
  });

  await page.goto('/survey');

  const saveButton = page.locator('button').first();

  await saveButton.click();
  await saveButton.click();

  await page.waitForTimeout(500);

  // ❗ ВАЖНО: запрос либо один, либо вообще отсутствует — дубликатов нет
  expect(requestCount).toBeLessThanOrEqual(1);
});
