import { test, expect } from '@playwright/test';

test.describe('Subjects and Custom Checklist Items', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all 10 clinical subjects in filter tabs and settings', async ({ page }) => {
    // Check subject filters on Today view
    const expectedSubjects = [
      'Medicine',
      'Ortho',
      'Paediatrics',
      'Obgyn',
      'Surgery',
      'Derma',
      'Anesthesia',
      'Psychiatry',
      'Ent',
      'Opthal'
    ];

    for (const name of expectedSubjects) {
      await expect(page.getByRole('button', { name: new RegExp(name, 'i') }).first()).toBeVisible();
    }
  });

  test('should open Add Checklist Item modal from Today view and create new topic', async ({ page }) => {
    // Click "Add Checklist Item" button on Today view
    const addBtn = page.getByRole('button', { name: 'Add Checklist Item' });
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Modal should appear
    await expect(page.getByText('Add Subject Checklist Item')).toBeVisible();

    // Fill topic title
    const titleInput = page.locator('input[placeholder*="Acute Appendicitis"]');
    await titleInput.fill('Paediatric Growth Hormone Deficiency');

    // Submit
    await page.getByRole('button', { name: 'Add Topic' }).click();

    // Toast and new topic should be visible
    await expect(page.getByText('Item added')).toBeVisible();
    await expect(page.getByText('Paediatric Growth Hormone Deficiency')).toBeVisible();
  });

  test('should create a new custom subject and add items under it in Manage Tasks', async ({ page }) => {
    // Navigate to Manage Tasks
    await page.getByRole('button', { name: 'Manage Tasks' }).first().click();

    // Click "+ Add Subject" button
    await page.getByRole('button', { name: '+ Add Subject' }).click();
    await expect(page.getByText('Create New Subject')).toBeVisible();

    // Enter name
    const nameInput = page.locator('input[placeholder*="Pathology"]');
    await nameInput.fill('Radiology');

    // Select color
    await page.getByRole('button', { name: 'yellow' }).click();

    // Submit
    await page.getByRole('button', { name: 'Create Subject' }).click();
    await expect(page.getByText('Added subject: Radiology')).toBeVisible();

    // Subject tab should now exist and be clickable
    const radiologyTab = page.getByRole('button', { name: /Radiology/ });
    await expect(radiologyTab).toBeVisible();
    await radiologyTab.click();

    // Add topic under Radiology
    const topicInput = page.locator('input[placeholder*="Add new Radiology item"]');
    await topicInput.fill('Chest X-Ray Lobar Consolidation');
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('Item added')).toBeVisible();
    await expect(page.getByText('Chest X-Ray Lobar Consolidation')).toBeVisible();
  });

  test('should delete a subject with confirmation modal', async ({ page }) => {
    // Navigate to Manage Tasks
    await page.getByRole('button', { name: 'Manage Tasks' }).first().click();

    // Select a subject, e.g. Opthal
    await page.getByRole('button', { name: /Opthal/ }).click();

    // Click "Delete Subject"
    const deleteSubjBtn = page.getByRole('button', { name: 'Delete Subject' });
    await expect(deleteSubjBtn).toBeVisible();
    await deleteSubjBtn.click();

    // Confirmation modal should appear
    await expect(page.getByText(/Delete Subject "Opthal"?/i)).toBeVisible();

    // Cancel first
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText(/Delete Subject "Opthal"?/i)).not.toBeVisible();

    // Click Delete again and confirm
    await deleteSubjBtn.click();
    await page.getByRole('button', { name: 'Delete Subject' }).last().click();

    await expect(page.getByText('Subject and syllabus topics removed')).toBeVisible();
  });
});
