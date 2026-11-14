import { test, expect } from '@playwright/test';

test.describe('Calendar View Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Calendar' }).first().click();
  });

  test('should display month switcher and navigate months', async ({ page }) => {
    await expect(page.getByText('Calendar Progress')).toBeVisible();

    const monthDisplay = page.locator('span.font-display.font-bold.text-sm');
    const initialText = await monthDisplay.textContent();

    // Click next month
    await page.getByRole('button', { name: 'Next Month' }).click();
    await expect(monthDisplay).not.toHaveText(initialText || '');

    // Click prev month twice
    await page.getByRole('button', { name: 'Previous Month' }).click();
    await page.getByRole('button', { name: 'Previous Month' }).click();
    await expect(monthDisplay).not.toHaveText(initialText || '');
  });

  test('should display 3 KPI stat cards', async ({ page }) => {
    await expect(page.getByText('AVG COMPLETION')).toBeVisible();
    await expect(page.getByText('ACTIVE DAYS')).toBeVisible();
    await expect(page.getByText('100% DAYS')).toBeVisible();
  });

  test('should click a calendar day and show Day Inspector with tasks', async ({ page }) => {
    // Click any day button in the monthly grid
    const dayCells = page.locator('div.grid-cols-7 button');
    await dayCells.nth(15).click();

    // Day inspector should be visible
    await expect(page.getByText('Day Inspector')).toBeVisible();
    await expect(page.getByText('Syllabus Topics')).toBeVisible();
    await expect(page.getByText('Daily Habits')).toBeVisible();
  });
});
