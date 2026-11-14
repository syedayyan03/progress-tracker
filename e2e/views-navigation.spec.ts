import { test, expect } from '@playwright/test';

test.describe('Views Navigation & Global Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display initial Today view with branding and header', async ({ page }) => {
    await expect(page).toHaveTitle(/Daily Progress Tracker/i);
    await expect(page.getByRole('heading', { name: 'Daily Progress' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Today', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Manage Tasks' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calendar' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Analytics' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Settings' }).first()).toBeVisible();
  });

  test('should navigate between all 5 views seamlessly', async ({ page }) => {
    // Navigate to Manage Tasks
    await page.getByRole('button', { name: 'Manage Tasks' }).first().click();
    await expect(page.getByText('Manage Tasks & Curriculum')).toBeVisible();

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
    const dateBtn = page.getByTestId('date-switcher-center');
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

  test('should open and close hamburger sidebar drawer on mobile/tablet viewports', async ({ page }) => {
    // Set mobile/tablet viewport
    await page.setViewportSize({ width: 414, height: 896 });

    const menuBtn = page.getByRole('button', { name: 'Open sidebar menu' });
    await expect(menuBtn).toBeVisible();

    // Click hamburger button to open drawer
    await menuBtn.click();
    const closeBtn = page.getByRole('button', { name: 'Close menu' });
    await expect(closeBtn).toBeVisible();
    await expect(page.getByText('SQLite3 Cache Active')).toBeVisible();

    // Click Close 'X' button
    await closeBtn.click();
    await expect(closeBtn).not.toBeVisible();

    // Open again and click a nav item inside drawer
    await menuBtn.click();
    const tasksDrawerBtn = page.locator('.fixed.inset-0.z-50 button:has-text("Manage Tasks")');
    await expect(tasksDrawerBtn).toBeVisible();
    await tasksDrawerBtn.click();
    await expect(page).toHaveURL(/\/tasks/);
  });
});
