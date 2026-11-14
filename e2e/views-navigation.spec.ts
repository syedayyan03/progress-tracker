import { test, expect } from '@playwright/test';

test.describe('Views Navigation & Global Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display initial Today view with branding and header', async ({ page }) => {
    await expect(page).toHaveTitle(/Daily Progress Tracker/i);
    await expect(page.getByRole('heading', { name: 'Daily Progress' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Today', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calendar' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Analytics' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Settings' }).first()).toBeVisible();
  });

  test('should navigate between all 4 views seamlessly', async ({ page }) => {
    // Navigate to Calendar
    await page.getByRole('button', { name: 'Calendar' }).first().click();
    await expect(page.getByText('Calendar Progress')).toBeVisible();
    await expect(page.getByText('AVG COMPLETION')).toBeVisible();

    // Navigate to Analytics
    await page.getByRole('button', { name: 'Analytics' }).first().click();
    await expect(page.getByText('Study & Habits Analytics')).toBeVisible();
    await expect(page.getByText('TOPICS COMPLETED')).toBeVisible();

    // Navigate to Settings
    await page.getByRole('button', { name: 'Settings' }).first().click();
    await expect(page.getByText('Settings & Configuration')).toBeVisible();
    await expect(page.getByText('Study Start Date Mapping')).toBeVisible();

    // Navigate back to Today
    await page.getByRole('button', { name: 'Today', exact: true }).first().click();
    await expect(page.getByText("Today's Study & Habits")).toBeVisible();
  });

  test('should navigate days with date switcher controls', async ({ page }) => {
    const prevDayBtn = page.getByRole('button', { name: 'Previous day' });
    const nextDayBtn = page.getByRole('button', { name: 'Next day' });

    // Click previous day
    await prevDayBtn.click();
    // Center button should now display formatted date instead of "Today"
    const dateBtn = page.locator('header button').nth(1);
    await expect(dateBtn).not.toHaveText('Today');

    // Click center button to return to Today
    await dateBtn.click();
    await expect(dateBtn).toContainText('Today');

    // Click next day
    await nextDayBtn.click();
    await expect(dateBtn).not.toHaveText('Today');
  });

  test('should toggle dark/light theme', async ({ page }) => {
    const themeBtn = page.getByRole('button', { name: 'Toggle theme' });
    const html = page.locator('html');

    // Initially dark
    await expect(html).toHaveClass(/dark/);

    // Toggle to light
    await themeBtn.click();
    await expect(html).not.toHaveClass(/dark/);

    // Toggle back to dark
    await themeBtn.click();
    await expect(html).toHaveClass(/dark/);
  });
});
