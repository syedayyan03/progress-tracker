import { test, expect } from '@playwright/test';

test.describe('Settings View & CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Settings' }).first().click();
  });

  test('should update curriculum start date and recalculate syllabus day', async ({ page }) => {
    const dateInput = page.locator('input[type="date"]');
    await expect(dateInput).toBeVisible();

    // Set new start date
    await dateInput.fill('2026-11-01');
    await expect(page.getByText('Start date updated')).toBeVisible();
    await expect(page.locator('strong:has-text("Day")')).toBeVisible();
  });

  test('should perform CRUD on checklist items (add, edit, move, delete)', async ({ page }) => {
    // Switch to Medicine tab
    await page.getByRole('button', { name: /Medicine/ }).click();

    // Add new topic
    const titleInput = page.locator('input[placeholder*="Add new"]');
    await titleInput.fill('Echocardiography Fundamentals');
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.getByText('Item added')).toBeVisible();
    await expect(page.getByText('Echocardiography Fundamentals')).toBeVisible();

    // Rename newly added topic
    const topicSpan = page.getByText('Echocardiography Fundamentals');
    await topicSpan.scrollIntoViewIfNeeded();
    await topicSpan.click();

    const editInput = page.getByLabel('Edit item title');
    await editInput.fill('Advanced Echocardiography');
    await editInput.press('Enter');

    await expect(page.getByText('Updated item title')).toBeVisible();
    await expect(page.getByText('Advanced Echocardiography')).toBeVisible();

    // Delete newly added item
    const itemRow = page.locator('div.flex.items-center.justify-between:has-text("Advanced Echocardiography")');
    await itemRow.scrollIntoViewIfNeeded();
    const deleteBtn = itemRow.getByRole('button', { name: 'Delete item' });
    await deleteBtn.click({ force: true });
    await expect(page.getByText('Item deleted')).toBeVisible();
    await expect(page.getByText('Advanced Echocardiography')).not.toBeVisible();
  });

  test('should trigger backup export download', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export Backup (JSON)' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('daily_progress_tracker_backup');
  });

  test('should open reset modal and cancel or confirm', async ({ page }) => {
    await page.getByRole('button', { name: 'Reset All Data' }).click();
    await expect(page.getByText('Reset All Application Data?')).toBeVisible();

    // Click cancel
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Reset All Application Data?')).not.toBeVisible();

    // Open again and confirm
    await page.getByRole('button', { name: 'Reset All Data' }).click();
    await page.getByRole('button', { name: 'Reset Everything' }).click();
    await expect(page.getByText('All data reset to defaults')).toBeVisible();
  });
});
