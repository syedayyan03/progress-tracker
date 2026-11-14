import { test, expect } from '@playwright/test';

test.describe('Analytics View Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Load sample data first via settings to ensure rich analytics
    await page.getByRole('button', { name: 'Settings' }).first().click();
    await page.getByRole('button', { name: 'Load Sample Data (Preview)' }).click();
    await page.getByRole('button', { name: 'Load Demo Data' }).click();
    // Navigate to Analytics
    await page.getByRole('button', { name: 'Analytics' }).first().click();
  });

  test('should display all 6 KPI cards with calculated metrics', async ({ page }) => {
    await expect(page.getByText('TOPICS COMPLETED')).toBeVisible();
    await expect(page.getByText('OVERALL COMPLETION')).toBeVisible();
    await expect(page.getByText('CURRENT STREAK')).toBeVisible();
    await expect(page.getByText('PROJECTED FINISH')).toBeVisible();
    await expect(page.getByText('BEST DAY RECORD')).toBeVisible();
    await expect(page.getByText('PENDING / OVERDUE')).toBeVisible();
  });

  test('should display Smart Performance Insights', async ({ page }) => {
    await expect(page.getByText('Smart Performance Insights')).toBeVisible();
    await expect(page.getByText('Strongest Day', { exact: true })).toBeVisible();
    await expect(page.getByText('Lowest Day', { exact: true })).toBeVisible();
    await expect(page.getByText('Friction Spot', { exact: true })).toBeVisible();
    await expect(page.getByText('Consistency Rockstar', { exact: true })).toBeVisible();
  });

  test('should toggle tabs in Annual Activity Heatmap', async ({ page }) => {
    await expect(page.getByText('Annual Activity Heatmap')).toBeVisible();

    // Click Medicine tab
    await page.getByRole('button', { name: 'Medicine', exact: true }).click();
    // Click Ortho tab
    await page.getByRole('button', { name: 'Ortho', exact: true }).click();
    // Click Habits tab
    await page.getByRole('button', { name: 'Habits', exact: true }).click();
    // Click Overall tab
    await page.getByRole('button', { name: 'Overall', exact: true }).click();
  });

  test('should switch completion trend ranges', async ({ page }) => {
    await expect(page.getByText('Completion Trend & 7-Day Moving Average')).toBeVisible();

    await page.getByRole('button', { name: '7D', exact: true }).click();
    await page.getByRole('button', { name: '90D', exact: true }).click();
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await page.getByRole('button', { name: '30D', exact: true }).click();
  });

  test('should render charts and habit ranking', async ({ page }) => {
    await expect(page.getByText('Syllabus Completion')).toBeVisible();
    await expect(page.getByText('Habit Performance & Skipped Analysis')).toBeVisible();
    await expect(page.getByText('Study & Habit Domain Balance')).toBeVisible();
    await expect(page.getByText('Day of Week Consistency')).toBeVisible();
    await expect(page.getByText('Weekly Progress Comparison (Past 8 Weeks)')).toBeVisible();
  });
});
