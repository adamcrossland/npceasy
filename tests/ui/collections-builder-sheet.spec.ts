import { expect, test } from '@playwright/test';
import { CreateCharacter, CreateCollectionAndOpenBuilder, GetCharacterEditor, OpenFreshApp } from './helpers';

test('creates collection and character with persisted edits', async ({ page }) => {
  await OpenFreshApp(page);
  await CreateCollectionAndOpenBuilder(page, 'Storm Coast NPCs');
  await CreateCharacter(page, 'Captain Aria');

  const editor = GetCharacterEditor(page);
  await editor.locator('label:has-text("Experience") input').first().fill('900');
  await editor.locator('label:has-text("Max HP") input').first().fill('45');
  await editor.locator('label:has-text("Personality") textarea').first().fill('Always plans two moves ahead.');

  await page.getByRole('button', { name: 'Character Sheet', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Character Sheet' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Captain Aria' })).toBeVisible();

  await page.reload();

  await page.getByRole('button', { name: 'Character Builder', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Captain Aria' })).toBeVisible();

  const reloadedEditor = GetCharacterEditor(page);
  await expect(reloadedEditor.locator('label:has-text("Experience") input').first()).toHaveValue('900');
  await expect(reloadedEditor.locator('label:has-text("Max HP") input').first()).toHaveValue('45');
  await expect(reloadedEditor.locator('label:has-text("Personality") textarea').first()).toHaveValue('Always plans two moves ahead.');
});

test('updates sheet when class and loadout change', async ({ page }) => {
  await OpenFreshApp(page);
  await CreateCollectionAndOpenBuilder(page, 'Verdant Accord');
  await CreateCharacter(page, 'Marshal Thorne');

  const editor = GetCharacterEditor(page);

  await page.getByRole('button', { name: 'Add Class' }).click();
  const classSelect = editor.locator('select.input-base').filter({
    has: page.locator('option', { hasText: 'Choose class' })
  }).first();
  await classSelect.selectOption({ label: 'Fighter' });

  const classRow = classSelect.locator('xpath=ancestor::div[contains(@class, "grid")][1]');
  await classRow.locator('input[type="number"]').first().fill('5');

  await editor.locator('label', { hasText: 'Longsword' }).locator('input[type="checkbox"]').check();
  await editor.locator('label', { hasText: 'Using a shield (+2 AC)' }).locator('input[type="checkbox"]').check();
  await editor.locator('label:has-text("Primary Weapon") select').first().selectOption({ label: 'Longsword' });

  await page.getByRole('button', { name: 'Character Sheet', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Marshal Thorne' })).toBeVisible();
  await expect(page.getByText(/^Fighter Lv 5$/).first()).toBeVisible();
  await expect(page.locator('li', { hasText: 'Primary:' }).first()).toContainText('Longsword');
  await expect(page.locator('li', { hasText: 'Shield:' }).first()).toBeVisible();
});

test('applies equipped magic item bonuses to AC and weapon attacks on sheet', async ({ page }) => {
  await OpenFreshApp(page);
  await CreateCollectionAndOpenBuilder(page, 'Aegis Trials');
  await CreateCharacter(page, 'Rook Halden');

  const editor = GetCharacterEditor(page);

  await page.getByRole('button', { name: 'Add Class' }).click();
  const classSelect = editor.locator('select.input-base').filter({
    has: page.locator('option', { hasText: 'Choose class' })
  }).first();
  await classSelect.selectOption({ label: 'Fighter' });

  await editor.locator('label', { hasText: 'Longsword' }).locator('input[type="checkbox"]').check();
  await editor.locator('label:has-text("Primary Weapon") select').first().selectOption({ label: 'Longsword' });

  const cloakRow = editor.locator('label', { hasText: 'Cloak of Protection' })
    .first()
    .locator('xpath=ancestor::div[contains(@class, "rounded-lg")][1]');
  await cloakRow.locator('input[type="checkbox"]').first().check();
  await cloakRow.locator('input[type="checkbox"]').nth(1).check();

  const weaponRow = editor.locator('label', { hasText: 'Weapon, +1' })
    .first()
    .locator('xpath=ancestor::div[contains(@class, "rounded-lg")][1]');
  await weaponRow.locator('input[type="checkbox"]').first().check();
  await weaponRow.locator('input[type="checkbox"]').nth(1).check();

  await page.getByRole('button', { name: 'Character Sheet', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Rook Halden' })).toBeVisible();

  const armorClassBadge = page.locator('.sheet-badges span', { hasText: 'AC' }).first();
  await expect(armorClassBadge).toContainText('11');
  await expect(armorClassBadge).toHaveAttribute('title', /Magic item AC bonus:\s*Cloak of Protection:\s*\+1 AC\./);

  const longswordEntry = page.locator('li', { hasText: 'Longsword' }).first();
  await expect(longswordEntry).toContainText('+3 to hit');
  await expect(longswordEntry).toContainText('1d8+1 slashing');
  await expect(longswordEntry).toContainText('Weapon, +1: +1');
});
