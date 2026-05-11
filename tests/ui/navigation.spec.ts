import { expect, test } from '@playwright/test';
import { OpenFreshApp } from './helpers';

test('navigates across primary app tabs', async ({ page }) => {
  await OpenFreshApp(page);

  await expect(page.getByRole('button', { name: 'Collections', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Character Builder', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Character Sheet', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Compendium', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Help', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Help', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Welcome to NPC Easy' })).toBeVisible();

  await page.getByRole('button', { name: 'Character Builder', exact: true }).click();
  await expect(page.getByText('Select or create a collection first in the Collections screen.')).toBeVisible();

  await page.getByRole('button', { name: 'Character Sheet', exact: true }).click();
  await expect(page.getByText('Open Character Builder and select a character to view the sheet.')).toBeVisible();

  await page.getByRole('button', { name: 'Compendium', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Editable Compendium' })).toBeVisible();

  await page.getByRole('button', { name: 'Collections', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Character Collections' })).toBeVisible();
});
