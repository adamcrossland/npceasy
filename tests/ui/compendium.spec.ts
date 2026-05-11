import { expect, test } from '@playwright/test';
import { promises as fs } from 'node:fs';
import { CreateCharacter, CreateCollectionAndOpenBuilder, OpenFreshApp } from './helpers';

test('adds custom spell in compendium and finds it in builder', async ({ page }) => {
  await OpenFreshApp(page);
  await CreateCollectionAndOpenBuilder(page, 'Arcane Cartel');
  await CreateCharacter(page, 'Ilyra Quill');

  await page.getByRole('button', { name: 'Compendium' }).click();

  const spellsPanel = page.locator('div.panel', {
    has: page.getByRole('heading', { name: 'Spells' })
  }).first();

  await spellsPanel.getByRole('button', { name: 'Add Item' }).click();

  const customSpellName = 'Test Spell of Embers';
  await spellsPanel.locator('input[placeholder="Name"]').first().fill(customSpellName);
  await spellsPanel.locator('input[placeholder="Description"]').first().fill('Deals controlled ember damage.');

  await page.getByRole('button', { name: 'Character Builder', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Show all spells' }).check();

  await expect(page.locator('label', { hasText: customSpellName }).first()).toBeVisible();
});

test('exports app data as JSON backup', async ({ page }) => {
  await OpenFreshApp(page);
  await CreateCollectionAndOpenBuilder(page, 'Backup Validation');
  await CreateCharacter(page, 'Archivist Vale');

  await page.getByRole('button', { name: 'Compendium' }).click();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export Data' }).click()
  ]);

  expect(download.suggestedFilename()).toMatch(/^npceasy-backup-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.json$/);

  const filePath = await download.path();
  expect(filePath).toBeTruthy();

  const raw = await fs.readFile(filePath!, 'utf-8');
  const backup = JSON.parse(raw) as {
    collections?: Array<{ name?: string }>;
  };

  const collectionNames = (backup.collections ?? []).map((entry) => entry.name ?? '');
  expect(collectionNames).toContain('Backup Validation');
});
