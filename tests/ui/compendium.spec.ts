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
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Character Builder', exact: true }).click({ force: true });
  await page.getByRole('checkbox', { name: 'Show all spells' }).setChecked(true, { force: true });

  await expect(page.locator('label', { hasText: customSpellName }).first()).toBeVisible();
});

test('adds custom magic item in compendium with bonuses and finds it in builder', async ({ page }) => {
  await OpenFreshApp(page);
  await CreateCollectionAndOpenBuilder(page, 'Relic Forge');
  await CreateCharacter(page, 'Seren Vale');

  await page.getByRole('button', { name: 'Compendium' }).click();

  const magicItemsPanel = page.locator('div.panel', {
    has: page.getByRole('heading', { name: 'Magic Items' })
  }).first();

  await magicItemsPanel.getByRole('button', { name: 'Add Item' }).click();

  const customMagicItemName = 'Sentinel Ward Charm';
  await magicItemsPanel.locator('input[placeholder="Name"]').first().fill(customMagicItemName);
  await magicItemsPanel.locator('input[placeholder="Description"]').first().fill('A warding charm that reinforces defense and aim.');
  await magicItemsPanel.locator('label:has-text("AC Bonus") input').first().fill('2');
  await magicItemsPanel.locator('label:has-text("To-Hit Bonus") input').first().fill('1');
  await page.waitForTimeout(500);

  await page.reload();
  await page.getByRole('button', { name: 'Compendium', exact: true }).click();

  const reloadedMagicItemsPanel = page.locator('div.panel', {
    has: page.getByRole('heading', { name: 'Magic Items' })
  }).first();

  const nameInputs = reloadedMagicItemsPanel.locator('input[placeholder="Name"]');
  const nameInputCount = await nameInputs.count();
  let customItemIndex = -1;

  for (let i = 0; i < nameInputCount; i += 1) {
    const value = await nameInputs.nth(i).inputValue();
    if (value === customMagicItemName) {
      customItemIndex = i;
      break;
    }
  }

  expect(customItemIndex).toBeGreaterThanOrEqual(0);
  await expect(reloadedMagicItemsPanel.locator('label:has-text("AC Bonus") input').nth(customItemIndex)).toHaveValue('2');
  await expect(reloadedMagicItemsPanel.locator('label:has-text("To-Hit Bonus") input').nth(customItemIndex)).toHaveValue('1');

  await page.getByRole('button', { name: 'Character Builder', exact: true }).click({ force: true });
  await expect(page.locator('label', { hasText: customMagicItemName }).first()).toBeVisible();
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
