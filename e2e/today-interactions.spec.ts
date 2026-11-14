import { test, expect } from '@playwright/test';

test.describe('Today View Interactions & Data Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before testing to ensure clean state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should toggle habit completion, update count and persist across reload', async ({ page }) => {
    const fajrHabit = page.getByText('Fajr');
    await expect(fajrHabit).toBeVisible();

    // Initial state: 0 / 10 Done
    await expect(page.getByText('0 / 10 Done')).toBeVisible();

    // Toggle Fajr
    const toggleBtn = page.getByRole('button', { name: 'Toggle Fajr' });
    await toggleBtn.click();

    // Habit count should update to 1 / 10 Done
    await expect(page.getByText('1 / 10 Done')).toBeVisible();

    // Title should have line-through
    await expect(fajrHabit).toHaveClass(/line-through/);

    // Reload page to verify persistence
    await page.reload();
    await expect(page.getByText('1 / 10 Done')).toBeVisible();
    await expect(page.getByText('Fajr')).toHaveClass(/line-through/);
  });

  test('should toggle topic completion and update progress percentage', async ({ page }) => {
    // Initial progress 0%
    await expect(page.getByText('0%')).toBeVisible();

    // Toggle Medicine topic
    const medTopic = page.locator('text=Intro to ECG').first();
    await expect(medTopic).toBeVisible();
    const medToggle = page.getByRole('button', { name: 'Toggle Intro to ECG' });
    await medToggle.click();

    // Progress percentage should be greater than 0%
    await expect(page.getByText('0%')).not.toBeVisible();
    await expect(page.getByText(/\d+ Done/).first()).toBeVisible();
  });

  test('should open and save topic details modal', async ({ page }) => {
    // Click info button for Intro to ECG
    const infoBtn = page.locator('button[title="Topic Details & Rating"]').first();
    await infoBtn.click();

    // Modal should appear
    await expect(page.getByText('Understanding Rating (1-5)')).toBeVisible();
    await expect(page.getByText('Clinical Notes & Mnemonics')).toBeVisible();

    // Rate 5 stars
    const starButtons = page.locator('button:has(svg.lucide-star)');
    await starButtons.nth(4).click(); // 5th star
    await expect(page.getByText('5 / 5 Stars')).toBeVisible();

    // Check revision flag
    await page.getByLabel('Flag for Revision').check();

    // Fill notes
    const textarea = page.locator('textarea[placeholder*="diagnostic points"]');
    await textarea.fill('High-yield ECG diagnostic criteria memorized.');

    // Save
    await page.getByRole('button', { name: 'Save Details' }).click();

    // Modal should close and toast should appear
    await expect(page.getByText('Understanding Rating (1-5)')).not.toBeVisible();
    await expect(page.getByText('★ 5').first()).toBeVisible();
    await expect(page.getByText('Revision')).toBeVisible();
    await expect(page.getByText(/High-yield ECG diagnostic/)).toBeVisible();
  });

  test('should auto-save daily reflection notes', async ({ page }) => {
    const reflectionTextarea = page.locator('textarea[placeholder*="How was your focus today?"]');
    await reflectionTextarea.fill('Finished cardiac cycle review and crushed morning workout.');

    // Reload page
    await page.reload();

    // Value should still be present
    await expect(reflectionTextarea).toHaveValue('Finished cardiac cycle review and crushed morning workout.');
  });
});
