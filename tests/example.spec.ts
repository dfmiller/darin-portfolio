import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('unknown route shows 404 page', async ({ page }) => {
  await page.goto('/nope')
  await expect(page.getByText(/not found/i)).toBeVisible()
})