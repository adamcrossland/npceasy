import { expect, Locator, Page } from '@playwright/test';

const StorageKey = 'NpcEasy.AppState.v1';
const HelpSeenKey = 'NpcEasy.HelpSeen.v1';

export async function OpenFreshApp(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(({ storageKey, helpSeenKey }) => {
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem(helpSeenKey);
    window.localStorage.setItem(helpSeenKey, '1');
  }, { storageKey: StorageKey, helpSeenKey: HelpSeenKey });

  await page.reload();

  await expect(page.getByRole('banner').getByText('NPC Easy', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Collections', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Character Collections' })).toBeVisible();
}

export async function CreateCollectionAndOpenBuilder(page: Page, collectionName: string): Promise<void> {
  await page.getByPlaceholder('Example: Storm Coast NPCs').fill(collectionName);
  await page.getByRole('button', { name: 'Create Collection' }).click();

  const collectionCard = page.locator('article', {
    has: page.getByRole('heading', { name: collectionName })
  }).first();

  await expect(collectionCard).toBeVisible();
  await collectionCard.getByRole('button', { name: 'Build Characters' }).click();

  await expect(page.getByRole('heading', { name: 'Character Builder' })).toBeVisible();
  await expect(page.getByRole('heading', { name: collectionName })).toBeVisible();
}

export function GetCharacterEditor(page: Page): Locator {
  return page.locator('div.panel', {
    has: page.getByRole('heading', { name: 'Edit Character' })
  }).first();
}

export async function CreateCharacter(page: Page, characterName: string): Promise<void> {
  await page.getByRole('button', { name: 'Add Character' }).click();

  const editor = GetCharacterEditor(page);
  await expect(editor).toBeVisible();
  await editor.locator('label:has-text("Name") input').first().fill(characterName);

  await expect(page.getByRole('button', { name: characterName })).toBeVisible();
}
