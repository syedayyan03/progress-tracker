import { test, expect } from '@playwright/test';

test.describe('Direct Route Loading & Strict Responsiveness', () => {
  // 1. Direct Route Loading Tests
  test('direct navigation to /today loads Today view', async ({ page }) => {
    await page.goto('/today');
    await expect(page).toHaveURL(/\/today/);
    await expect(page.getByRole('heading', { name: /Today's Study/i })).toBeVisible();
  });

  test('direct navigation to /tasks loads Manage Tasks view', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page).toHaveURL(/\/tasks/);
    await expect(page.getByText('Manage Tasks & Curriculum')).toBeVisible();
  });

  test('direct navigation to /manage-tasks redirects to /tasks', async ({ page }) => {
    await page.goto('/manage-tasks');
    await expect(page).toHaveURL(/\/tasks/);
    await expect(page.getByText('Manage Tasks & Curriculum')).toBeVisible();
  });

  test('direct navigation to /calendar loads Calendar view', async ({ page }) => {
    await page.goto('/calendar');
    await expect(page).toHaveURL(/\/calendar/);
    await expect(page.getByText('Calendar Progress')).toBeVisible();
    await expect(page.getByText('AVG COMPLETION')).toBeVisible();
  });

  test('direct navigation to /calender redirects to /calendar', async ({ page }) => {
    await page.goto('/calender');
    await expect(page).toHaveURL(/\/calendar/);
    await expect(page.getByText('Calendar Progress')).toBeVisible();
  });

  test('direct navigation to /analytics loads Analytics view', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page).toHaveURL(/\/analytics/);
    await expect(page.getByText('Study & Habits Analytics')).toBeVisible();
    await expect(page.getByText('TOPICS COMPLETED')).toBeVisible();
  });

  test('direct navigation to /settings loads Settings view', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByText('Settings & Configuration')).toBeVisible();
    await expect(page.getByText('Study Start Date Mapping')).toBeVisible();
  });

  // 2. Strict Responsiveness Tests Across Aspect Ratios
  const viewports = [
    { name: 'Mobile Ultra-Compact (360x640)', width: 360, height: 640 },
    { name: 'Mobile Standard (390x844)', width: 390, height: 844 },
    { name: 'Tablet Portrait (768x1024)', width: 768, height: 1024 },
    { name: 'Tablet Landscape (1024x768)', width: 1024, height: 768 },
    { name: 'Laptop HD (1366x768)', width: 1366, height: 768 },
    { name: 'Desktop Full HD (1920x1080)', width: 1920, height: 1080 },
    { name: 'Ultrawide 2K (2560x1440)', width: 2560, height: 1440 },
  ];

  for (const vp of viewports) {
    test(`should render layout cleanly on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/today');

      // Header is visible
      await expect(page.getByRole('heading', { name: 'Daily Progress' }).first()).toBeVisible();

      // Navigation is accessible (either desktop sidebar or mobile bottom nav)
      const calendarBtn = page.getByRole('button', { name: 'Calendar' });
      await expect(calendarBtn.first()).toBeVisible();

      // Hero progress ring is rendered
      await expect(page.locator('section svg circle').first()).toBeVisible();

      // Test navigation to Calendar on this viewport
      await calendarBtn.first().click();
      await expect(page).toHaveURL(/\/calendar/);
      await expect(page.getByText('Calendar Progress')).toBeVisible();

      // Test navigation to Settings on this viewport
      const settingsBtn = page.getByRole('button', { name: 'Settings' });
      await settingsBtn.first().click();
      await expect(page).toHaveURL(/\/settings/);
      await expect(page.getByText('Settings & Configuration')).toBeVisible();
    });
  }
});
