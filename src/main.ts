import './style.css';
import { AllClasses } from './classes';
import { Feats } from './feats';
import { Races } from './races';
import { Spells, GetSpellByName } from './spells';
import { SrdWeapons } from './weapons';

type Screen = 'Collections' | 'CharacterBuilder' | 'Compendium' | 'CharacterSheet';
type CatalogKey = 'classes' | 'feats' | 'weapons' | 'spells' | 'races';

type ClassFeatureRecord = {
    name: string;
    level: number;
    description: string;
};

type ClassSubclass = {
    name: string;
    description: string;
    features: ClassFeatureRecord[];
};

type ClassFeatureSummary = {
    className: string;
    classLevel: number;
    subclassName: string;
    classFeatures: string[];
    subclassFeatures: string[];
};

type CatalogItem = {
    id: string;
    name: string;
    description: string;
    classFeatures?: ClassFeatureRecord[];
    classSubclasses?: ClassSubclass[];
    effect?: string;
    damage?: string;
    scaling?: string;
    level?: number;
    classes?: string[];
    weaponDamage?: string;
    weaponDamageType?: string;
    weaponProperties?: string[];
};

type ClassLevel = {
    classId: string;
    level: number;
    subclassName?: string;
};

type CharacterWeapon = {
    weaponId: string;
    magicalBonus: number;
};

type CharacterRecord = {
    id: string;
    name: string;
    raceId: string;
    classLevels: ClassLevel[];
    experience: number;
    maxHitPoints: number;
    armorClass: number;
    speed: number;
    abilityScores: {
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
    };
    proficiencies: string;
    languages: string;
    traits: string;
    equipment: string;
    featIds: string[];
    weaponIds: string[];
    characterWeapons?: CharacterWeapon[];
    weaponMagicBonuses?: Record<string, number>;
    spellIds: string[];
    alignment: string;
    background: string;
    personality: string;
    ideals: string;
    bonds: string;
    flaws: string;
};

type Collection = {
    id: string;
    name: string;
    characters: CharacterRecord[];
};

type AppState = {
    screen: Screen;
    collections: Collection[];
    selectedCollectionId: string;
    selectedCharacterId: string;
    catalogs: {
        classes: CatalogItem[];
        feats: CatalogItem[];
        weapons: CatalogItem[];
        spells: CatalogItem[];
        races: CatalogItem[];
    };
};

const STORAGE_KEY = 'NpcEasy.AppState.v1';

const SpellSlotsByCasterLevel: number[][] = [
    [],
    [2],
    [3],
    [4, 2],
    [4, 3],
    [4, 3, 2],
    [4, 3, 3],
    [4, 3, 3, 1],
    [4, 3, 3, 2],
    [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 2],
    [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

const WarlockPactSlotsByLevel: Array<{ slots: number; slotLevel: number }> = [
    { slots: 0, slotLevel: 0 },
    { slots: 1, slotLevel: 1 },
    { slots: 2, slotLevel: 1 },
    { slots: 2, slotLevel: 2 },
    { slots: 2, slotLevel: 2 },
    { slots: 2, slotLevel: 3 },
    { slots: 2, slotLevel: 3 },
    { slots: 2, slotLevel: 4 },
    { slots: 2, slotLevel: 4 },
    { slots: 2, slotLevel: 5 },
    { slots: 2, slotLevel: 5 },
    { slots: 3, slotLevel: 5 },
    { slots: 3, slotLevel: 5 },
    { slots: 3, slotLevel: 5 },
    { slots: 3, slotLevel: 5 },
    { slots: 3, slotLevel: 5 },
    { slots: 3, slotLevel: 5 },
    { slots: 4, slotLevel: 5 },
    { slots: 4, slotLevel: 5 },
    { slots: 4, slotLevel: 5 },
    { slots: 4, slotLevel: 5 }
];

const DEFAULT_WEAPONS: CatalogItem[] = SrdWeapons.map((item) => ({
    id: `weapon-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: item.name,
    description: `${item.group}: ${item.description}`,
    weaponDamage: item.damage,
    weaponDamageType: item.damageType,
    weaponProperties: item.properties
}));

const DEFAULT_SPELLS: CatalogItem[] = Spells.map((item) => ({
    id: `spell-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: item.name,
    description: item.description,
    effect: item.effect,
    damage: item.damage,
    scaling: item.scaling,
    level: item.level,
    classes: item.classes
}));

function SummarizeSpellEffect(description: string): string {
    const text = (description ?? '').replace(/\r/g, '').trim();
    if (!text) {
        return 'See full spell description.';
    }

    const firstParagraph = text.split(/\n\s*\n/)[0]?.replace(/\s+/g, ' ').trim() ?? text;
    const firstSentence = firstParagraph.split(/(?<=[.!?])\s+/)[0] ?? firstParagraph;
    const compact = firstSentence.replace(/\s+/g, ' ').trim();

    if (compact.length <= 96) {
        return compact;
    }

    const clipped = compact.slice(0, 93);
    const lastSpace = clipped.lastIndexOf(' ');
    const safe = lastSpace > 40 ? clipped.slice(0, lastSpace) : clipped;
    return `${safe}...`;
}

function SummarizeSpellDamage(description: string): string | undefined {
    const text = (description ?? '').replace(/\r/g, ' ');
    if (!/\bdamage\b/i.test(text)) {
        return undefined;
    }

    const damageTypes = 'acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder';
    const parts: string[] = [];

    const diceMatches = Array.from(text.matchAll(new RegExp(`\\b(\\d+d\\d+(?:\\s*[+\\-]\\s*\\d+)?)\\s+(${damageTypes})\\s+damage\\b`, 'gi')));
    for (const match of diceMatches) {
        const dice = match[1].replace(/\s+/g, '');
        const damageType = match[2].toLowerCase();
        const value = `${dice} ${damageType}`;
        if (!parts.includes(value)) {
            parts.push(value);
        }
    }

    const flatMatches = Array.from(text.matchAll(new RegExp(`\\b(\\d+)\\s+(${damageTypes})\\s+damage\\b`, 'gi')));
    for (const match of flatMatches) {
        const value = `${match[1]} ${match[2].toLowerCase()}`;
        if (!parts.includes(value)) {
            parts.push(value);
        }
    }

    if (parts.length > 0) {
        const notes: string[] = [];

        const cantripScalingMatch = text.match(/damage\s+increases\s+by\s+([^.;\n]+?)\s+when\s+you\s+reach\s+5th\s+level\s*\(([^)]+)\),\s*11th\s+level\s*\(([^)]+)\),\s*and\s*17th\s+level\s*\(([^)]+)\)/i);
        if (cantripScalingMatch) {
            const step = cantripScalingMatch[1].trim();
            const lvl5 = cantripScalingMatch[2].trim();
            const lvl11 = cantripScalingMatch[3].trim();
            const lvl17 = cantripScalingMatch[4].trim();
            notes.push(`cantrip scaling: +${step} (5th: ${lvl5}, 11th: ${lvl11}, 17th: ${lvl17})`);
        }

        const wordToNumber: Record<string, number> = {
            one: 1,
            two: 2,
            three: 3,
            four: 4
        };

        const slotScalingMatch = text.match(/At\s+Higher\s+Levels:[\s\S]*?damage\s+increases\s+by\s+([^.;\n]+?)\s+for\s+(?:each|every)\s+(?:(one|two|three|four|\d+)\s+)?slot\s+level(?:s)?\s+above\s+(\d+)(?:st|nd|rd|th)/i);
        if (slotScalingMatch) {
            const increment = slotScalingMatch[1].trim();
            const stepRaw = (slotScalingMatch[2] ?? '1').toLowerCase();
            const step = Number.isFinite(Number(stepRaw)) ? Number(stepRaw) : (wordToNumber[stepRaw] ?? 1);
            const baseSlot = Number(slotScalingMatch[3]);
            const perText = step <= 1 ? 'slot level' : `${step} slot levels`;
            notes.push(`higher slots: +${increment} per ${perText} above ${baseSlot}`);
        }

        return notes.length > 0
            ? `${parts.join(', ')} (${notes.join('; ')})`
            : parts.join(', ');
    }

    return 'See description';
}

function NormalizeSpellCatalog(items: CatalogItem[]): CatalogItem[] {
    return items.map((item) => {
        const canonical = Spells.find((spell) => spell.name.toLowerCase() === item.name.toLowerCase());

        const inferredLevelFromDescription = (() => {
            const cantripMatch = item.description.match(/\bcantrip\b/i);
            if (cantripMatch) {
                return 0;
            }

            const levelMatch = item.description.match(/\blevel\s+(\d+)\b/i);
            if (levelMatch) {
                return Number(levelMatch[1]);
            }

            return undefined;
        })();

        const inferredClassesFromDescription = (() => {
            const classesMatch = item.description.match(/\bclasses:\s*([^.]*)/i);
            if (!classesMatch) {
                return undefined;
            }

            return classesMatch[1]
                .split(',')
                .map((value) => value.trim())
                .filter((value) => value.length > 0);
        })();

        return {
            ...item,
            effect: item.effect ?? canonical?.effect ?? SummarizeSpellEffect(item.description),
            damage: item.damage ?? canonical?.damage,
            scaling: item.scaling ?? canonical?.scaling,
            level: item.level ?? canonical?.level ?? inferredLevelFromDescription ?? 0,
            classes: item.classes ?? canonical?.classes ?? inferredClassesFromDescription ?? []
        };
    });
}

function NormalizeWeaponCatalog(items: CatalogItem[]): CatalogItem[] {
    return items.map((item) => {
        if (item.weaponDamage) {
            return item;
        }

        const canonical = SrdWeapons.find((weapon) => weapon.name.toLowerCase() === item.name.toLowerCase());
        if (canonical) {
            return {
                ...item,
                weaponDamage: canonical.damage,
                weaponDamageType: canonical.damageType,
                weaponProperties: canonical.properties
            };
        }

        return item;
    });
}

function NormalizeCharacterWeaponData(character: CharacterRecord): CharacterRecord {
    const existingBonuses = character.weaponMagicBonuses ?? {};
    const normalizedCharacterWeapons = (character.characterWeapons ?? []).map((entry) => ({
        weaponId: entry.weaponId,
        magicalBonus: Number.isFinite(entry.magicalBonus) ? entry.magicalBonus : 0
    }));

    const weaponIdsFromCharacterWeapons = normalizedCharacterWeapons.map((entry) => entry.weaponId);
    const mergedWeaponIds = [...new Set([...character.weaponIds, ...weaponIdsFromCharacterWeapons])];

    const normalizedBonuses: Record<string, number> = { ...existingBonuses };
    for (const entry of normalizedCharacterWeapons) {
        normalizedBonuses[entry.weaponId] = entry.magicalBonus;
    }
    for (const weaponId of mergedWeaponIds) {
        if (!Number.isFinite(normalizedBonuses[weaponId])) {
            normalizedBonuses[weaponId] = 0;
        }
    }

    return {
        ...character,
        weaponIds: mergedWeaponIds,
        weaponMagicBonuses: normalizedBonuses,
        characterWeapons: mergedWeaponIds.map((weaponId) => ({
            weaponId,
            magicalBonus: normalizedBonuses[weaponId] ?? 0
        }))
    };
}

function NormalizeCollections(collections: Collection[]): Collection[] {
    return collections.map((collection) => ({
        ...collection,
        characters: collection.characters.map((character) => NormalizeCharacterWeaponData(character))
    }));
}

function NormalizeFeatureRecord(f: ClassFeatureRecord | string | unknown): ClassFeatureRecord | null {
    if (typeof f === 'string') {
        const trimmed = f.trim();
        if (!trimmed) return null;
        // Parse legacy formatted strings like "Lv 3: Name - Description"
        const match = trimmed.match(/^Lv\s*(\d+):\s*([^-]+?)\s*-\s*(.+)$/);
        if (match) {
            return { level: Number(match[1]), name: match[2].trim(), description: match[3].trim() };
        }
        return { level: 0, name: trimmed, description: '' };
    }
    if (f && typeof f === 'object') {
        const rec = f as Partial<ClassFeatureRecord>;
        const name = (rec.name ?? '').toString().trim();
        if (!name) return null;
        return {
            name,
            level: Number.isFinite(Number(rec.level)) ? Number(rec.level) : 0,
            description: (rec.description ?? '').toString().trim()
        };
    }
    return null;
}

function NormalizeFeatureRecords(features: unknown): ClassFeatureRecord[] {
    if (!features) return [];
    // Legacy: was a newline-separated string
    if (typeof features === 'string') {
        return (features as string)
            .split(/\r?\n/)
            .map(NormalizeFeatureRecord)
            .filter((f): f is ClassFeatureRecord => f !== null);
    }
    if (Array.isArray(features)) {
        return (features as unknown[])
            .map(NormalizeFeatureRecord)
            .filter((f): f is ClassFeatureRecord => f !== null);
    }
    return [];
}

function NormalizeClassSubclasses(subclasses?: Array<ClassSubclass | string>): ClassSubclass[] {
    const normalized = (subclasses ?? []).map((subclass): ClassSubclass | null => {
        if (typeof subclass === 'string') {
            const name = subclass.trim();
            return name ? { name, description: '', features: [] } : null;
        }
        const name = (subclass.name ?? '').trim();
        if (!name) return null;
        return {
            name,
            description: (subclass.description ?? '').trim(),
            features: NormalizeFeatureRecords((subclass as any).features)
        };
    }).filter((subclass): subclass is ClassSubclass => subclass !== null);

    const seen = new Set<string>();
    return normalized.filter((subclass) => {
        const key = subclass.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function NewId(prefix: string): string {
    return `${prefix}-${crypto.randomUUID()}`;
}

function MergeClassCatalog(savedClasses: CatalogItem[] | undefined, defaultClasses: CatalogItem[]): CatalogItem[] {
    const saved = savedClasses ?? [];

    const mergedDefaults = defaultClasses.map((defaultItem) => {
        const savedMatch = saved.find((item) => item.name === defaultItem.name);
        return {
            ...defaultItem,
            description: savedMatch?.description ?? defaultItem.description,
            classFeatures: savedMatch?.classFeatures
                ? NormalizeFeatureRecords(savedMatch.classFeatures)
                : (defaultItem.classFeatures ?? []),
            classSubclasses: NormalizeClassSubclasses(savedMatch?.classSubclasses ?? defaultItem.classSubclasses)
        };
    });

    const customClasses = saved
        .filter((item) => !defaultClasses.some((defaultItem) => defaultItem.name === item.name))
        .map((item) => ({
            ...item,
            id: item.id || NewId('class'),
            classFeatures: NormalizeFeatureRecords((item as any).classFeatures),
            classSubclasses: NormalizeClassSubclasses(item.classSubclasses)
        }));

    return [...mergedDefaults, ...customClasses];
}

function BuildDefaultState(): AppState {
    return {
        screen: 'Collections',
        collections: [],
        selectedCollectionId: '',
        selectedCharacterId: '',
        catalogs: {
            classes: AllClasses.map(item => ({
                id: `${item.classType.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                name: item.classType,
              description: `Hit Die: d${item.hitDice}`,
              classFeatures: item.features.map((f) => ({ name: f.name, level: f.level, description: f.description })),
              classSubclasses: item.subclasses.map((subclass) => ({
                name: subclass.name,
                description: subclass.description,
                features: subclass.features.map((f) => ({ name: f.name, level: f.level, description: f.description }))
              }))
            })),
            feats: Feats.map(item => ({
                id: `feat-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                name: item.name,
                description: item.prerequisites ? `${item.description} Prereq: ${item.prerequisites}` : item.description
            })),
            weapons: DEFAULT_WEAPONS,
            spells: DEFAULT_SPELLS,
            races: Races.map(item => ({
                id: `race-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                name: item.name,
                description: item.description
            }))
        }
    };
}

function BuildNewCharacter(raceId: string): CharacterRecord {
    return {
        id: NewId('char'),
        name: 'New Character',
        raceId,
        classLevels: [],
        experience: 0,
        maxHitPoints: 8,
        armorClass: 10,
        speed: 30,
        abilityScores: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        },
        proficiencies: '',
        languages: '',
        traits: '',
        equipment: '',
        featIds: [],
        weaponIds: [],
        characterWeapons: [],
        weaponMagicBonuses: {},
        spellIds: [],
        alignment: '',
        background: '',
        personality: '',
        ideals: '',
        bonds: '',
        flaws: ''
    };
}

function MigrateClassId(classId: string, classItems: CatalogItem[]): string {
  if (!classId) {
    return classId;
  }

  const directClassMatch = AllClasses.find(c => c.classType === classId);
  if (directClassMatch) {
    return directClassMatch.classType;
  }

  const slugMatch = AllClasses.find((c) => `class-${c.classType.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` === classId);
  if (slugMatch) {
    return slugMatch.classType;
  }

  const savedCatalogMatch = classItems.find((c) => c.id === classId || c.name === classId);
  return savedCatalogMatch?.name ?? classId;
}

function MigrateCatalogItemId(itemId: string, sourceItems: CatalogItem[], targetItems: CatalogItem[]): string {
  if (!itemId) {
    return itemId;
  }

  const directTargetMatch = targetItems.find((item) => item.id === itemId);
  if (directTargetMatch) {
    return itemId;
  }

  const targetByName = targetItems.find((item) => item.name === itemId);
  if (targetByName) {
    return targetByName.id;
  }

  const sourceItem = sourceItems.find((item) => item.id === itemId || item.name === itemId);
  if (!sourceItem) {
    return itemId;
  }

  const targetItem = targetItems.find((item) => item.name === sourceItem.name);
  return targetItem?.id ?? itemId;
}

function LoadState(): AppState {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return BuildDefaultState();
    }

    try {
        const parsed = JSON.parse(raw) as AppState;
        const isLegacyWeaponCatalog =
            Array.isArray(parsed.catalogs?.weapons)
            && parsed.catalogs.weapons.length === 5
            && parsed.catalogs.weapons.some((item) => item.id === 'weapon-longsword');
        const isLegacySpellCatalog =
            Array.isArray(parsed.catalogs?.spells)
            && parsed.catalogs.spells.length === 5
            && parsed.catalogs.spells.some((item) => item.id === 'spell-fireball');

        const freshCatalogs = BuildDefaultState().catalogs;
        const savedClassCatalog = parsed.catalogs?.classes ?? freshCatalogs.classes;
        const savedRaceCatalog = parsed.catalogs?.races ?? freshCatalogs.races;
        const mergedState = {
            ...BuildDefaultState(),
            ...parsed,
            catalogs: {
              classes: MergeClassCatalog(parsed.catalogs?.classes, freshCatalogs.classes),
                feats: freshCatalogs.feats,
                races: freshCatalogs.races,
                weapons: NormalizeWeaponCatalog(isLegacyWeaponCatalog ? DEFAULT_WEAPONS : (parsed.catalogs?.weapons ?? freshCatalogs.weapons)),
                spells: NormalizeSpellCatalog(isLegacySpellCatalog ? DEFAULT_SPELLS : (parsed.catalogs?.spells ?? freshCatalogs.spells))
            }
        };

        return {
            ...mergedState,
            collections: NormalizeCollections(mergedState.collections).map(col => ({
                ...col,
                characters: col.characters.map(char => ({
                    ...char,
                raceId: MigrateCatalogItemId(char.raceId, savedRaceCatalog, freshCatalogs.races),
                    classLevels: char.classLevels.map(entry => ({
                        ...entry,
                  classId: MigrateClassId(entry.classId, savedClassCatalog)
                    }))
                }))
            }))
        };
    } catch {
        return BuildDefaultState();
    }
}

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
    throw new Error('Missing #app root element.');
}

app.innerHTML = `
<div x-data="NpcEasyApp()" x-init="Init()" class="min-h-screen">
  <header class="sticky top-0 z-10 border-b border-amber-100/80 bg-sand/90 backdrop-blur no-print">
    <div class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
      <div>
        <p class="font-display text-xl tracking-wide text-ink md:text-2xl">NPC Easy</p>
        <p class="text-xs uppercase tracking-[0.2em] text-ink-soft">Offline Campaign Workbench</p>
      </div>
      <nav class="grid grid-cols-2 gap-2 md:flex md:items-center">
        <button class="tab-btn" :class="{ 'tab-btn-active': screen === 'Collections' }" @click="screen = 'Collections'">Collections</button>
        <button class="tab-btn" :class="{ 'tab-btn-active': screen === 'CharacterBuilder' }" @click="screen = 'CharacterBuilder'">Character Builder</button>
        <button class="tab-btn" :class="{ 'tab-btn-active': screen === 'CharacterSheet' }" @click="screen = 'CharacterSheet'">Character Sheet</button>
        <button class="tab-btn" :class="{ 'tab-btn-active': screen === 'Compendium' }" @click="screen = 'Compendium'">Compendium</button>
      </nav>
    </div>
  </header>

  <main class="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
    <section x-show="screen === 'Collections'" class="space-y-6" x-cloak>
      <div class="panel">
        <h2 class="panel-title">Character Collections</h2>
        <p class="panel-subtitle">Choose an existing group of characters, or start a new collection for a campaign, location, or faction.</p>
        <div class="mt-4 flex flex-col gap-3 md:flex-row">
          <input x-model="newCollectionName" type="text" placeholder="Example: Storm Coast NPCs" class="input-base" />
          <button class="btn-primary md:w-auto" @click="CreateCollection()">Create Collection</button>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <template x-for="collection in collections" :key="collection.id">
          <article class="panel ring-1 ring-transparent transition hover:ring-amber-300">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-display text-xl text-ink" x-text="collection.name"></h3>
                <p class="mt-1 text-sm text-ink-soft"><span x-text="collection.characters.length"></span> characters</p>
              </div>
              <button class="btn-danger px-3 py-2 text-xs" @click="DeleteCollection(collection.id)">Delete</button>
            </div>
            <div class="mt-4 flex gap-2">
              <button class="btn-secondary" @click="SelectCollection(collection.id)">Open</button>
              <button class="btn-primary" @click="SelectCollection(collection.id); screen = 'CharacterBuilder';">Build Characters</button>
            </div>
          </article>
        </template>
      </div>
    </section>

    <section x-show="screen === 'CharacterBuilder'" class="space-y-6" x-cloak>
      <div class="panel">
        <h2 class="panel-title">Character Builder</h2>
        <p class="panel-subtitle">Create a full character profile with stats, class progression, equipment, and roleplay details.</p>
      </div>

      <div x-show="!activeCollection" class="panel" x-cloak>
        <p class="text-ink">Select or create a collection first in the Collections screen.</p>
      </div>

      <div x-show="activeCollection" class="grid gap-4 lg:grid-cols-[280px_1fr]" x-cloak>
        <aside class="panel space-y-3">
          <div>
            <p class="text-sm uppercase tracking-[0.2em] text-ink-soft">Active Collection</p>
            <h3 class="font-display text-xl text-ink" x-text="activeCollection?.name"></h3>
          </div>

          <button class="btn-primary w-full" @click="CreateCharacter()">Add Character</button>

          <div class="space-y-2">
            <template x-for="character in activeCollection?.characters ?? []" :key="character.id">
              <button
                class="w-full rounded-xl border border-amber-200 px-3 py-2 text-left transition hover:border-amber-400"
                :class="{ 'bg-amber-100/70 border-amber-500': selectedCharacterId === character.id }"
                @click="SelectCharacter(character.id)"
              >
                <span class="block font-semibold text-ink" x-text="character.name"></span>
                <span class="text-xs text-ink-soft">Lvl <span x-text="character.level"></span></span>
              </button>
            </template>
          </div>
        </aside>

        <div class="panel" x-show="editingCharacter" x-cloak>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h3 class="panel-title">Edit Character</h3>
            <div class="flex gap-2">
              <button class="btn-secondary" @click="screen = 'CharacterSheet'">Preview Sheet</button>
              <button class="btn-danger" @click="DeleteCharacter()">Delete Character</button>
            </div>
          </div>

          <form class="mt-6 space-y-6" @input.debounce.300ms="SaveAll()" @change="SaveAll()">
            <div class="grid gap-3 md:grid-cols-2">
              <label class="field-label">Name
                <input x-model="editingCharacter.name" type="text" class="input-base" />
              </label>
              <label class="field-label">Race
                <select x-model="editingCharacter.raceId" x-effect="$el.value = editingCharacter?.raceId ?? ''" class="input-base">
                  <option value="" :selected="!editingCharacter?.raceId">Choose a race</option>
                  <template x-for="race in catalogs.races" :key="race.id">
                    <option :value="race.id" :selected="editingCharacter?.raceId === race.id" x-text="race.name"></option>
                  </template>
                </select>
              </label>
            </div>

            <div class="grid gap-3 md:grid-cols-4">
              <label class="field-label">Experience
                <input x-model.number="editingCharacter.experience" type="number" min="0" class="input-base" />
              </label>
              <label class="field-label">Max HP
                <input x-model.number="editingCharacter.maxHitPoints" type="number" min="0" class="input-base" />
              </label>
              <label class="field-label">AC / Speed
                <div class="grid grid-cols-2 gap-2">
                  <input x-model.number="editingCharacter.armorClass" type="number" min="1" class="input-base" />
                  <input x-model.number="editingCharacter.speed" type="number" min="0" class="input-base" />
                </div>
              </label>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between">
                <p class="field-heading">Ability Scores</p>
                <button type="button" class="btn-secondary" @click="RollAbilityScores()">Roll 4d6 (Drop Lowest)</button>
              </div>
              <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <label class="field-label">STR
                  <input x-model.number="editingCharacter.abilityScores.strength" type="number" class="input-base" />
                </label>
                <label class="field-label">DEX
                  <input x-model.number="editingCharacter.abilityScores.dexterity" type="number" class="input-base" />
                </label>
                <label class="field-label">CON
                  <input x-model.number="editingCharacter.abilityScores.constitution" type="number" class="input-base" />
                </label>
                <label class="field-label">INT
                  <input x-model.number="editingCharacter.abilityScores.intelligence" type="number" class="input-base" />
                </label>
                <label class="field-label">WIS
                  <input x-model.number="editingCharacter.abilityScores.wisdom" type="number" class="input-base" />
                </label>
                <label class="field-label">CHA
                  <input x-model.number="editingCharacter.abilityScores.charisma" type="number" class="input-base" />
                </label>
              </div>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between">
                <p class="field-heading">Class Levels</p>
                <button type="button" class="btn-secondary" @click="AddClassLevel()">Add Class</button>
              </div>
              <div class="space-y-2">
                <template x-for="(row, index) in editingCharacter.classLevels" :key="index">
                  <div class="grid gap-2" :class="GetSubclassOptionsForClass(row.classId).length > 0 ? 'md:grid-cols-[1fr_160px_90px_auto]' : 'md:grid-cols-[1fr_90px_auto]'">
                    <select x-model="row.classId" x-effect="$el.value = row.classId ?? ''" class="input-base" @change="NormalizeSubclassSelection(row)">
                      <option value="" :selected="!row.classId">Choose class</option>
                      <template x-for="entry in catalogs.classes" :key="entry.name">
                        <option :value="entry.name" :selected="row.classId === entry.name" x-text="entry.name"></option>
                      </template>
                    </select>
                    <template x-if="GetSubclassOptionsForClass(row.classId).length > 0">
                      <select x-model="row.subclassName" x-effect="$el.value = row.subclassName ?? ''" class="input-base">
                        <option value="" :selected="!row.subclassName">No subclass</option>
                        <template x-for="sc in GetSubclassOptionsForClass(row.classId)" :key="sc">
                          <option :value="sc" :selected="row.subclassName === sc" x-text="sc"></option>
                        </template>
                      </select>
                    </template>
                    <input x-model.number="row.level" type="number" min="1" class="input-base" />
                    <button type="button" class="btn-danger" @click="RemoveClassLevel(index)">Remove</button>
                  </div>
                </template>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
              <div>
                <p class="field-label">Feats</p>
                <div class="input-base min-h-[180px] max-h-[260px] space-y-2 overflow-y-auto">
                  <template x-for="entry in catalogs.feats" :key="entry.id">
                    <label class="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="checkbox"
                        class="h-4 w-4"
                        :checked="editingCharacter?.featIds?.includes(entry.id)"
                        @change="ToggleCharacterListSelection('featIds', entry.id, $event.target.checked)"
                      />
                      <span x-text="entry.name"></span>
                    </label>
                  </template>
                </div>
              </div>

              <div>
                <p class="field-label">Weapons</p>
                <div class="input-base min-h-[180px] max-h-[260px] space-y-2 overflow-y-auto">
                  <template x-for="entry in catalogs.weapons" :key="entry.id">
                    <label class="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="checkbox"
                        class="h-4 w-4"
                        :checked="editingCharacter?.weaponIds?.includes(entry.id)"
                        @change="ToggleWeaponSelection(entry.id, $event.target.checked)"
                      />
                      <span x-text="entry.name"></span>
                    </label>
                  </template>
                </div>
              </div>

              <div>
                <p class="field-label">Spells</p>
                <div class="input-base min-h-[180px] max-h-[260px] space-y-2 overflow-y-auto">
                  <template x-for="entry in catalogs.spells" :key="entry.id">
                    <label class="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="checkbox"
                        class="h-4 w-4"
                        :checked="editingCharacter?.spellIds?.includes(entry.id)"
                        @change="ToggleCharacterListSelection('spellIds', entry.id, $event.target.checked)"
                      />
                      <span x-text="entry.name"></span>
                    </label>
                  </template>
                </div>
              </div>
            </div>

            <div>
              <p class="field-heading">Weapon Magical Bonuses</p>
              <p class="text-sm text-ink-soft">Set enhancement bonuses (for example +1, +2, +3) for selected weapons.</p>
              <div class="mt-2 space-y-2" x-show="(editingCharacter?.weaponIds?.length ?? 0) > 0" x-cloak>
                <template x-for="weaponId in editingCharacter?.weaponIds ?? []" :key="'magic-' + weaponId">
                  <div class="grid grid-cols-[1fr_120px_auto] gap-2 rounded-xl border border-amber-200 p-2">
                    <p class="self-center text-sm font-semibold text-ink" x-text="GetCatalogName('weapons', weaponId)"></p>
                    <label class="field-label !mb-0">Magic Bonus
                      <input
                        class="input-base"
                        type="number"
                        min="0"
                        max="10"
                        :value="GetWeaponMagicBonus(editingCharacter, weaponId)"
                        @input="SetWeaponMagicBonus(editingCharacter, weaponId, $event.target.value)"
                      />
                    </label>
                    <button type="button" class="btn-danger self-end" @click="RemoveWeaponFromCharacter(weaponId)">Remove</button>
                  </div>
                </template>
              </div>
            </div>

            <div class="grid gap-3 md:grid-cols-2">
              <label class="field-label">Alignment
                <input x-model="editingCharacter.alignment" type="text" class="input-base" />
              </label>
              <label class="field-label">Background
                <input x-model="editingCharacter.background" type="text" class="input-base" />
              </label>
              <label class="field-label">Proficiencies (comma-separated)
                <textarea x-model="editingCharacter.proficiencies" class="input-base min-h-[90px]"></textarea>
              </label>
              <label class="field-label">Languages (comma-separated)
                <textarea x-model="editingCharacter.languages" class="input-base min-h-[90px]"></textarea>
              </label>
              <label class="field-label">Traits
                <textarea x-model="editingCharacter.traits" class="input-base min-h-[90px]"></textarea>
              </label>
              <label class="field-label">Equipment
                <textarea x-model="editingCharacter.equipment" class="input-base min-h-[90px]"></textarea>
              </label>
            </div>

            <div class="grid gap-3 md:grid-cols-2">
              <label class="field-label">Personality
                <textarea x-model="editingCharacter.personality" class="input-base min-h-[90px]"></textarea>
              </label>
              <label class="field-label">Ideals
                <textarea x-model="editingCharacter.ideals" class="input-base min-h-[90px]"></textarea>
              </label>
              <label class="field-label">Bonds
                <textarea x-model="editingCharacter.bonds" class="input-base min-h-[90px]"></textarea>
              </label>
              <label class="field-label">Flaws
                <textarea x-model="editingCharacter.flaws" class="input-base min-h-[90px]"></textarea>
              </label>
            </div>
          </form>
        </div>
      </div>
    </section>

    <section x-show="screen === 'Compendium'" class="space-y-5" x-cloak>
      <div class="panel">
        <h2 class="panel-title">Editable Compendium</h2>
        <p class="panel-subtitle">Add, remove, or update classes, feats, weapons, spells, and races. Changes are used everywhere in the app.</p>
      </div>

      <template x-for="group in compendiumSections" :key="group.key">
        <div class="panel">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 class="font-display text-2xl text-ink" x-text="group.label"></h3>
            <button class="btn-primary" @click="AddCompendiumItem(group.key)">Add Item</button>
          </div>

          <div class="space-y-2" @input.debounce.300ms="SaveAll()">
            <template x-for="item in catalogs[group.key]" :key="item.id">
              <div class="space-y-2">
                <div
                  class="grid gap-2 rounded-xl border border-amber-200 p-3"
                  :class="group.key === 'spells' ? 'md:grid-cols-[180px_1fr_90px_260px_auto]' : 'md:grid-cols-[220px_1fr_auto]'"
                >
                  <input x-model="item.name" type="text" class="input-base" placeholder="Name" />
                  <input x-model="item.description" type="text" class="input-base" placeholder="Description" />
                  <input
                    x-show="group.key === 'spells'"
                    x-model.number="item.level"
                    type="number"
                    min="0"
                    class="input-base"
                    placeholder="Level"
                  />
                  <input
                    x-show="group.key === 'spells'"
                    :value="(item.classes ?? []).join(', ')"
                    @input="SetSpellClasses(item, $event.target.value)"
                    type="text"
                    class="input-base"
                    placeholder="Classes (comma-separated)"
                  />
                  <button class="btn-danger" @click="RemoveCompendiumItem(group.key, item.id)">Remove</button>
                </div>

                <div x-show="group.key === 'classes'" class="space-y-3">

                  <div class="rounded-xl border border-amber-200/70 p-3">
                    <div class="mb-2 flex items-center justify-between">
                      <p class="field-label !mb-0">Class Features</p>
                      <button type="button" class="btn-secondary" @click="AddClassFeature(item)">Add Feature</button>
                    </div>
                    <div class="space-y-2" x-show="(item.classFeatures ?? []).length > 0" x-cloak>
                      <template x-for="(feature, featureIndex) in item.classFeatures ?? []" :key="item.id + '-feat-' + featureIndex">
                        <div class="grid gap-2 rounded-lg border border-amber-100 p-2 md:grid-cols-[60px_1fr_1fr_auto]">
                          <label class="field-label !mb-0">Level
                            <input x-model.number="feature.level" type="number" min="1" max="20" class="input-base" />
                          </label>
                          <input x-model="feature.name" type="text" class="input-base" placeholder="Feature name" />
                          <input x-model="feature.description" type="text" class="input-base" placeholder="Feature description" />
                          <button type="button" class="btn-danger self-end" @click="RemoveClassFeature(item, featureIndex)">Remove</button>
                        </div>
                      </template>
                    </div>
                    <p class="text-sm text-ink-soft" x-show="(item.classFeatures ?? []).length === 0" x-cloak>No features yet.</p>
                  </div>

                  <div class="rounded-xl border border-amber-200/70 p-3">
                    <div class="mb-2 flex items-center justify-between">
                      <p class="field-label !mb-0">Subclasses</p>
                      <button type="button" class="btn-secondary" @click="AddClassSubclass(item)">Add Subclass</button>
                    </div>
                    <div class="space-y-3" x-show="(item.classSubclasses ?? []).length > 0" x-cloak>
                      <template x-for="(subclass, subclassIndex) in item.classSubclasses ?? []" :key="item.id + '-subclass-' + subclassIndex">
                        <div class="rounded-lg border border-amber-100 p-2 space-y-2">
                          <div class="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                            <input x-model="subclass.name" type="text" class="input-base" placeholder="Subclass name" />
                            <input x-model="subclass.description" type="text" class="input-base" placeholder="Subclass description" />
                            <button type="button" class="btn-danger self-start" @click="RemoveClassSubclass(item, subclassIndex)">Remove</button>
                          </div>
                          <div class="pl-2 border-l-2 border-amber-200 space-y-2">
                            <div class="flex items-center justify-between">
                              <p class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Subclass Features</p>
                              <button type="button" class="btn-secondary text-xs py-1 px-2" @click="AddSubclassFeature(subclass)">Add Feature</button>
                            </div>
                            <template x-for="(feature, featureIndex) in subclass.features ?? []" :key="item.id + '-subclass-' + subclassIndex + '-feat-' + featureIndex">
                              <div class="grid gap-2 rounded-md border border-amber-100 p-2 md:grid-cols-[60px_1fr_1fr_auto]">
                                <label class="field-label !mb-0">Level
                                  <input x-model.number="feature.level" type="number" min="1" max="20" class="input-base" />
                                </label>
                                <input x-model="feature.name" type="text" class="input-base" placeholder="Feature name" />
                                <input x-model="feature.description" type="text" class="input-base" placeholder="Feature description" />
                                <button type="button" class="btn-danger self-end" @click="RemoveSubclassFeature(subclass, featureIndex)">Remove</button>
                              </div>
                            </template>
                            <p class="text-xs text-ink-soft" x-show="(subclass.features ?? []).length === 0" x-cloak>No subclass features yet.</p>
                          </div>
                        </div>
                      </template>
                    </div>
                    <p class="text-sm text-ink-soft" x-show="(item.classSubclasses ?? []).length === 0" x-cloak>No subclasses yet.</p>
                  </div>

                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </section>

    <section x-show="screen === 'CharacterSheet'" class="space-y-5" x-cloak>
      <div class="panel no-print">
        <h2 class="panel-title">Character Sheet</h2>
        <p class="panel-subtitle">A print-friendly summary for quick table reference.</p>
      </div>

      <div class="panel" x-show="!editingCharacter" x-cloak>
        <p class="text-ink">Open Character Builder and select a character to view the sheet.</p>
      </div>

      <article x-show="editingCharacter" class="sheet" x-cloak>
        <header class="sheet-header">
          <div>
            <p class="sheet-eyebrow">Character</p>
            <h3 class="sheet-name" x-text="editingCharacter?.name || 'Unnamed Character'"></h3>
            <p class="sheet-subline">
              <span x-text="GetCatalogName('races', editingCharacter?.raceId || '')"></span>
              <span> | Level </span><span x-text="GetTotalCharacterLevel(editingCharacter)"></span>
              <span> | </span><span x-text="editingCharacter?.alignment || 'Unaligned'"></span>
            </p>
            <p class="mt-1 text-sm text-ink-soft" x-show="(editingCharacter?.classLevels?.length ?? 0) > 0" x-cloak>
              <span class="font-semibold">Classes:</span>
              <span x-text="(editingCharacter?.classLevels ?? []).map(entry => entry.subclassName ? (entry.classId + ' (' + entry.subclassName + ') Lv ' + entry.level) : (entry.classId + ' Lv ' + entry.level)).join(', ')"></span>
            </p>
          </div>
          <div class="sheet-badges">
            <span>Max HP <strong x-text="editingCharacter?.maxHitPoints ?? 0"></strong></span>
            <span>AC <strong x-text="editingCharacter?.armorClass ?? 0"></strong></span>
            <span>Speed <strong x-text="editingCharacter?.speed ?? 0"></strong> ft</span>
            <span>Prof Bonus <strong x-text="'+' + GetProficiencyBonus(GetTotalCharacterLevel(editingCharacter))"></strong></span>
          </div>
        </header>

        <section class="sheet-grid">
          <div class="sheet-card">
            <h4>Ability Scores</h4>
            <dl class="score-grid">
              <div><dt>STR</dt><dd x-text="FormatAbilityScore(editingCharacter?.abilityScores.strength ?? 10)"></dd></div>
              <div><dt>DEX</dt><dd x-text="FormatAbilityScore(editingCharacter?.abilityScores.dexterity ?? 10)"></dd></div>
              <div><dt>CON</dt><dd x-text="FormatAbilityScore(editingCharacter?.abilityScores.constitution ?? 10)"></dd></div>
              <div><dt>INT</dt><dd x-text="FormatAbilityScore(editingCharacter?.abilityScores.intelligence ?? 10)"></dd></div>
              <div><dt>WIS</dt><dd x-text="FormatAbilityScore(editingCharacter?.abilityScores.wisdom ?? 10)"></dd></div>
              <div><dt>CHA</dt><dd x-text="FormatAbilityScore(editingCharacter?.abilityScores.charisma ?? 10)"></dd></div>
            </dl>
          </div>

          <div class="sheet-card">
            <h4>Saving Throws</h4>
            <dl class="score-grid">
              <template x-for="save in GetSavingThrows(editingCharacter)" :key="save.label">
                <div>
                  <dt x-text="save.label" :class="save.proficient ? 'font-bold' : ''"></dt>
                  <dd x-text="save.value" :class="save.proficient ? 'font-bold' : ''"></dd>
                </div>
              </template>
            </dl>
          </div>

          <div class="sheet-card" x-show="(editingCharacter?.featIds?.length ?? 0) > 0" x-cloak>
            <h4>Feats</h4>
            <ul class="list-base">
              <template x-for="id in editingCharacter?.featIds ?? []" :key="id">
                <li x-text="GetCatalogName('feats', id)"></li>
              </template>
            </ul>
          </div>

          <div class="sheet-card" x-show="(editingCharacter?.classLevels?.length ?? 0) > 0" x-cloak>
            <h4>Class Features</h4>
            <div class="space-y-2">
              <template x-for="entry in GetClassFeatureSummary(editingCharacter)" :key="entry.className + '-' + entry.classLevel + '-' + entry.subclassName">
                <div class="rounded-lg border border-amber-100 p-2">
                  <p class="font-semibold text-ink" x-text="entry.subclassName ? (entry.className + ' (' + entry.subclassName + ') Lv ' + entry.classLevel) : (entry.className + ' Lv ' + entry.classLevel)"></p>
                  <ul class="mt-1 list-base text-sm">
                    <template x-for="feature in entry.classFeatures" :key="entry.className + '-base-' + feature">
                      <li x-text="feature"></li>
                    </template>
                    <template x-for="feature in entry.subclassFeatures" :key="entry.className + '-subclass-' + feature">
                      <li class="text-ink-soft" x-text="feature"></li>
                    </template>
                  </ul>
                </div>
              </template>
            </div>
          </div>

          <div class="sheet-card">
            <h4>Weapons</h4>
            <ul class="list-base">
              <template x-for="id in editingCharacter?.weaponIds ?? []" :key="id">
                <li>
                  <span class="font-semibold" x-text="FormatWeaponName(editingCharacter, id)"></span>
                  <span class="block text-xs text-ink-soft" x-text="FormatWeaponAttack(editingCharacter, id)"></span>
                </li>
              </template>
              <template x-if="editingCharacter && ShouldShowSpellAttack(editingCharacter)">
                <li>
                  <span class="font-semibold">Attack Spell</span>
                  <span class="block text-xs text-ink-soft" x-text="FormatSpellAttack(editingCharacter)"></span>
                </li>
              </template>
            </ul>
          </div>

          <div class="sheet-card sheet-card-spells" x-show="(editingCharacter?.spellIds?.length ?? 0) > 0" x-cloak>
            <h4>Spells</h4>
            <div class="mb-2 space-y-1 text-xs text-ink-soft" x-show="editingCharacter && GetBestSpellcastingAbility(editingCharacter)" x-cloak>
              <p><span class="font-semibold">Spell Save DC:</span> <span x-text="'DC ' + GetSpellSaveDC(editingCharacter)"></span></p>
            </div>
            <div class="mb-2 space-y-1 text-xs text-ink-soft" x-show="GetSpellSlotSummary(editingCharacter).length > 0" x-cloak>
              <template x-for="line in GetSpellSlotSummary(editingCharacter)" :key="line">
                <p x-text="line"></p>
              </template>
            </div>
            <ul class="list-base spell-list-grid">
              <template x-for="id in editingCharacter?.spellIds ?? []" :key="id">
                <li class="spell-list-item">
                  <p class="font-semibold" x-text="GetCatalogName('spells', id)"></p>
                  <div class="mt-1 space-y-1 text-xs text-ink-soft">
                    <template x-for="line in GetSpellFacts(id)" :key="id + '-' + line">
                      <p x-text="line"></p>
                    </template>
                  </div>
                </li>
              </template>
            </ul>
          </div>

          <div class="sheet-card">
            <h4>Narrative</h4>
            <p><strong>Background:</strong> <span x-text="editingCharacter?.background"></span></p>
            <p><strong>Personality:</strong> <span x-text="editingCharacter?.personality"></span></p>
            <p><strong>Ideals:</strong> <span x-text="editingCharacter?.ideals"></span></p>
            <p><strong>Bonds:</strong> <span x-text="editingCharacter?.bonds"></span></p>
            <p><strong>Flaws:</strong> <span x-text="editingCharacter?.flaws"></span></p>
          </div>
        </section>
      </article>
    </section>
  </main>
</div>
`;

const defaultCatalogs = BuildDefaultState().catalogs;

declare global {
    interface Window {
        NpcEasyApp: () => any;
    }
}

const NpcEasyApp = (): any => {
    const state = LoadState();

    return {
        ...state,
        newCollectionName: '',
        editingCharacter: null as CharacterRecord | null,
        compendiumSections: [
            { key: 'classes', label: 'Classes' },
            { key: 'feats', label: 'Feats' },
            { key: 'weapons', label: 'Weapons' },
            { key: 'spells', label: 'Spells' },
            { key: 'races', label: 'Races' }
        ] as { key: CatalogKey; label: string }[],

        get activeCollection(): Collection | undefined {
            return this.collections.find((collection: Collection) => collection.id === this.selectedCollectionId);
        },

        Init() {
            if (!this.catalogs?.classes?.length) {
                this.catalogs = defaultCatalogs;
            }

            if (this.collections.length && !this.selectedCollectionId) {
                this.selectedCollectionId = this.collections[0].id;
            }

            const selected = this.GetSelectedCharacter();
            this.editingCharacter = selected ?? null;

            window.addEventListener('beforeunload', () => this.SaveAll());
        },

        SaveAll() {
            const snapshot: AppState = {
                screen: this.screen,
                collections: this.collections,
                selectedCollectionId: this.selectedCollectionId,
                selectedCharacterId: this.selectedCharacterId,
                catalogs: this.catalogs
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
        },

        SelectCollection(collectionId: string) {
            this.selectedCollectionId = collectionId;
            const collection = this.activeCollection;

            if (collection?.characters.length) {
                this.selectedCharacterId = collection.characters[0].id;
                this.editingCharacter = collection.characters[0];
            } else {
                this.selectedCharacterId = '';
                this.editingCharacter = null;
            }

            this.SaveAll();
        },

        CreateCollection() {
            const safeName = this.newCollectionName.trim();
            if (!safeName) {
                return;
            }

            const collection: Collection = {
                id: NewId('collection'),
                name: safeName,
                characters: []
            };

            this.collections.push(collection);
            this.newCollectionName = '';
            this.SelectCollection(collection.id);
        },

        DeleteCollection(collectionId: string) {
            this.collections = this.collections.filter((collection: Collection) => collection.id !== collectionId);

            if (this.selectedCollectionId === collectionId) {
                this.selectedCollectionId = this.collections[0]?.id ?? '';
                this.selectedCharacterId = '';
                this.editingCharacter = null;
            }

            this.SaveAll();
        },

        GetSelectedCharacter(): CharacterRecord | undefined {
            const collection = this.activeCollection;
            if (!collection) {
                return undefined;
            }

            return collection.characters.find((character: CharacterRecord) => character.id === this.selectedCharacterId);
        },

        SelectCharacter(characterId: string) {
            this.selectedCharacterId = characterId;
            this.editingCharacter = this.GetSelectedCharacter() ?? null;
            this.SaveAll();
        },

        CreateCharacter() {
            const collection = this.activeCollection;
            if (!collection) {
                return;
            }

            const defaultRaceId = this.catalogs.races[0]?.id ?? '';
            const character = BuildNewCharacter(defaultRaceId);
            collection.characters.push(character);
            this.SelectCharacter(character.id);
            this.SaveAll();
        },

        DeleteCharacter() {
            const collection = this.activeCollection;
            if (!collection || !this.selectedCharacterId) {
                return;
            }

            collection.characters = collection.characters.filter((character: CharacterRecord) => character.id !== this.selectedCharacterId);

            const first = collection.characters[0];
            this.selectedCharacterId = first?.id ?? '';
            this.editingCharacter = first ?? null;
            this.SaveAll();
        },

        GetSubclassOptionsForClass(classId: string): string[] {
          const classEntry = this.catalogs.classes.find((entry: CatalogItem) => entry.name === classId);
          return NormalizeClassSubclasses(classEntry?.classSubclasses).map((subclass) => subclass.name);
        },

        NormalizeSubclassSelection(entry: ClassLevel) {
          const subclassOptions = this.GetSubclassOptionsForClass(entry.classId);
          if (subclassOptions.length === 0) {
            entry.subclassName = '';
            return;
          }

          if (entry.subclassName && !subclassOptions.includes(entry.subclassName)) {
            entry.subclassName = '';
          }
        },

        AddClassSubclass(item: CatalogItem) {
          item.classSubclasses = NormalizeClassSubclasses(item.classSubclasses);
          item.classSubclasses.push({
            name: 'New Subclass',
            description: '',
            features: []
          });
          this.SaveAll();
        },

        RemoveClassSubclass(item: CatalogItem, index: number) {
          item.classSubclasses = NormalizeClassSubclasses(item.classSubclasses);
          item.classSubclasses.splice(index, 1);
          this.SaveAll();
        },

        AddClassFeature(item: CatalogItem) {
          if (!item.classFeatures) item.classFeatures = [];
          item.classFeatures.push({ name: 'New Feature', level: 1, description: '' });
          this.SaveAll();
        },

        RemoveClassFeature(item: CatalogItem, index: number) {
          if (!item.classFeatures) return;
          item.classFeatures.splice(index, 1);
          this.SaveAll();
        },

        AddSubclassFeature(subclass: ClassSubclass) {
          if (!subclass.features) subclass.features = [];
          subclass.features.push({ name: 'New Feature', level: 1, description: '' });
          this.SaveAll();
        },

        RemoveSubclassFeature(subclass: ClassSubclass, index: number) {
          if (!subclass.features) return;
          subclass.features.splice(index, 1);
          this.SaveAll();
        },

          RollAbilityScore(): number {
            const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
            rolls.sort((a, b) => b - a);
            return rolls[0] + rolls[1] + rolls[2];
          },

          RollAbilityScores() {
            if (!this.editingCharacter) {
              return;
            }

            this.editingCharacter.abilityScores.strength = this.RollAbilityScore();
            this.editingCharacter.abilityScores.dexterity = this.RollAbilityScore();
            this.editingCharacter.abilityScores.constitution = this.RollAbilityScore();
            this.editingCharacter.abilityScores.intelligence = this.RollAbilityScore();
            this.editingCharacter.abilityScores.wisdom = this.RollAbilityScore();
            this.editingCharacter.abilityScores.charisma = this.RollAbilityScore();
            this.SaveAll();
          },

        AddClassLevel() {
            if (!this.editingCharacter) {
                return;
            }

            this.editingCharacter.classLevels.push({
                classId: this.catalogs.classes[0]?.name ?? '',
                level: 1,
                subclassName: ''
            });
            this.SaveAll();
        },

        RemoveClassLevel(index: number) {
            if (!this.editingCharacter) {
                return;
            }

            this.editingCharacter.classLevels.splice(index, 1);
            this.SaveAll();
        },

        RemoveWeaponFromCharacter(weaponId: string) {
            if (!this.editingCharacter) {
                return;
            }

            this.editingCharacter.weaponIds = this.editingCharacter.weaponIds.filter((value: string) => value !== weaponId);

            if (this.editingCharacter.weaponMagicBonuses) {
                delete this.editingCharacter.weaponMagicBonuses[weaponId];
            }

            if (this.editingCharacter.characterWeapons) {
                this.editingCharacter.characterWeapons = this.editingCharacter.characterWeapons.filter((entry: CharacterWeapon) => entry.weaponId !== weaponId);
            }

            this.SaveAll();
        },

        ToggleCharacterListSelection(listKey: 'featIds' | 'spellIds', id: string, isChecked: boolean) {
            if (!this.editingCharacter) {
                return;
            }

            const existing = this.editingCharacter[listKey] ?? [];

            if (isChecked) {
                if (!existing.includes(id)) {
                    existing.push(id);
                }
            } else {
                this.editingCharacter[listKey] = existing.filter((value: string) => value !== id);
            }

            this.SaveAll();
        },

        ToggleWeaponSelection(weaponId: string, isChecked: boolean) {
            if (!this.editingCharacter) {
                return;
            }

            if (isChecked) {
                if (!this.editingCharacter.weaponIds.includes(weaponId)) {
                    this.editingCharacter.weaponIds.push(weaponId);
                }
                this.SaveAll();
                return;
            }

            this.RemoveWeaponFromCharacter(weaponId);
        },

        AddCompendiumItem(key: CatalogKey) {
            const item: CatalogItem = {
                id: NewId(key.slice(0, -1)),
                name: `New ${key.slice(0, -1)}`,
                description: ''
            };

            if (key === 'classes') {
                item.classSubclasses = [];
            }

            if (key === 'spells') {
                item.level = 0;
                item.classes = [];
            }

            this.catalogs[key].unshift(item);

            this.SaveAll();
        },

        SetSpellClasses(item: CatalogItem, value: string) {
            item.classes = value
                .split(',')
                .map((className: string) => className.trim())
                .filter((className: string) => className.length > 0);

            this.SaveAll();
        },

        RemoveCompendiumItem(key: CatalogKey, id: string) {
          const removedItem = this.catalogs[key].find((item: CatalogItem) => item.id === id);
            this.catalogs[key] = this.catalogs[key].filter((item: CatalogItem) => item.id !== id);

            if (this.editingCharacter) {
                if (key === 'feats') {
                    this.editingCharacter.featIds = this.editingCharacter.featIds.filter((value: string) => value !== id);
                }
                if (key === 'weapons') {
                    this.RemoveWeaponFromCharacter(id);
                }
                if (key === 'spells') {
                    this.editingCharacter.spellIds = this.editingCharacter.spellIds.filter((value: string) => value !== id);
                }
                if (key === 'races' && this.editingCharacter.raceId === id) {
                    this.editingCharacter.raceId = '';
                }
                if (key === 'classes') {
                  const removedClassName = removedItem?.name;
                  this.editingCharacter.classLevels = this.editingCharacter.classLevels.filter((entry: ClassLevel) => entry.classId !== removedClassName);
                }
            }

            this.SaveAll();
        },

        GetAbilityModifier(score: number): number {
            return Math.floor((score - 10) / 2);
        },

        GetWeaponMagicBonus(character: CharacterRecord, weaponId: string): number {
            if (!character.weaponMagicBonuses) {
                character.weaponMagicBonuses = {};
            }

            const current = Number(character.weaponMagicBonuses[weaponId] ?? 0);
            const bonus = Number.isFinite(current) ? current : 0;
            character.weaponMagicBonuses[weaponId] = bonus;

            if (!character.characterWeapons) {
                character.characterWeapons = [];
            }

            const existing = character.characterWeapons.find((entry: CharacterWeapon) => entry.weaponId === weaponId);
            if (existing) {
                existing.magicalBonus = bonus;
            } else {
                character.characterWeapons.push({ weaponId, magicalBonus: bonus });
            }

            return bonus;
        },

        SetWeaponMagicBonus(character: CharacterRecord, weaponId: string, value: string) {
            const parsed = Number.parseInt(value, 10);
            const safeBonus = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;

            if (!character.weaponMagicBonuses) {
                character.weaponMagicBonuses = {};
            }
            character.weaponMagicBonuses[weaponId] = safeBonus;

            if (!character.characterWeapons) {
                character.characterWeapons = [];
            }

            const existing = character.characterWeapons.find((entry: CharacterWeapon) => entry.weaponId === weaponId);
            if (existing) {
                existing.magicalBonus = safeBonus;
            } else {
                character.characterWeapons.push({ weaponId, magicalBonus: safeBonus });
            }

            this.SaveAll();
        },

        GetProficiencyBonus(level: number): number {
            return Math.ceil(level / 4) + 1;
        },

        GetSavingThrows(character: CharacterRecord): { label: string; value: string; proficient: boolean }[] {
            const proficientSaves = new Set<string>();
            for (const entry of character.classLevels) {
                const charClass = AllClasses.find(c => c.classType === entry.classId);
                if (!charClass) continue;
                for (const save of charClass.proficiencies.savingThrows) {
                    proficientSaves.add(save.toLowerCase());
                }
            }
            const profBonus = this.GetProficiencyBonus(this.GetTotalCharacterLevel(character));
            const entries: { key: keyof CharacterRecord['abilityScores']; label: string; abbr: string }[] = [
                { key: 'strength', label: 'Strength', abbr: 'STR' },
                { key: 'dexterity', label: 'Dexterity', abbr: 'DEX' },
                { key: 'constitution', label: 'Constitution', abbr: 'CON' },
                { key: 'intelligence', label: 'Intelligence', abbr: 'INT' },
                { key: 'wisdom', label: 'Wisdom', abbr: 'WIS' },
                { key: 'charisma', label: 'Charisma', abbr: 'CHA' },
            ];
            return entries.map(({ key, label, abbr }) => {
                const proficient = proficientSaves.has(label.toLowerCase());
                const mod = this.GetAbilityModifier(character.abilityScores[key]) + (proficient ? profBonus : 0);
                const value = mod >= 0 ? `+${mod}` : `${mod}`;
                return { label: abbr, value, proficient };
            });
        },

          GetClassFeatureSummary(character: CharacterRecord | null): ClassFeatureSummary[] {
            if (!character) {
              return [];
            }

            const groupedEntries = new Map<string, { className: string; subclassName: string; classLevel: number }>();
            for (const classLevelEntry of character.classLevels ?? []) {
              if (!classLevelEntry.classId || classLevelEntry.level <= 0) {
                continue;
              }

              const className = classLevelEntry.classId;
              const subclassName = classLevelEntry.subclassName ?? '';
              const key = `${className}::${subclassName}`;
              const existing = groupedEntries.get(key);
              if (existing) {
                existing.classLevel += classLevelEntry.level;
              } else {
                groupedEntries.set(key, {
                  className,
                  subclassName,
                  classLevel: classLevelEntry.level
                });
              }
            }

            return Array.from(groupedEntries.values())
              .sort((a, b) => {
                  const classCompare = a.className.localeCompare(b.className);
                  return classCompare !== 0 ? classCompare : a.subclassName.localeCompare(b.subclassName);
              })
              .map((entry) => {
                const className = entry.className;
                const classLevel = entry.classLevel;
                const subclassName = entry.subclassName;

                const sourceClass = AllClasses.find((item) => item.classType === className);
                const classCatalogItem = this.catalogs.classes.find((item: CatalogItem) => item.name === className);

                // Prefer catalog-stored features (user-edited); fall back to SRD data
                const catalogFeatures = NormalizeFeatureRecords(classCatalogItem?.classFeatures);
                const baseFeaturesToUse = catalogFeatures.length > 0
                  ? catalogFeatures
                  : (sourceClass?.features ?? []);
                const classFeatures = baseFeaturesToUse
                  .filter((feature) => feature.level <= classLevel)
                  .map((feature) => `Lv ${feature.level}: ${feature.name} - ${feature.description}`);

                let subclassFeatures: string[] = [];
                if (subclassName) {
                  const subclassCatalogItem = NormalizeClassSubclasses(classCatalogItem?.classSubclasses)
                    .find((subclass) => subclass.name === subclassName);

                  const catalogSubclassFeatures = NormalizeFeatureRecords(subclassCatalogItem?.features);
                  if (catalogSubclassFeatures.length > 0) {
                    subclassFeatures = catalogSubclassFeatures
                      .filter((feature) => feature.level <= classLevel)
                      .map((feature) => `Lv ${feature.level}: ${feature.name} - ${feature.description}`);
                  } else {
                    const sourceSubclass = sourceClass?.subclasses.find((subclass) => subclass.name === subclassName);
                    subclassFeatures = (sourceSubclass?.features ?? [])
                      .filter((feature) => feature.level <= classLevel)
                      .map((feature) => `Lv ${feature.level}: ${feature.name} - ${feature.description}`);
                  }
                }

                const uniqueClassFeatures = [...new Set(classFeatures)];
                const uniqueSubclassFeatures = [...new Set(subclassFeatures)];

                return {
                  className,
                  classLevel,
                  subclassName,
                  classFeatures: uniqueClassFeatures,
                  subclassFeatures: uniqueSubclassFeatures
                };
              })
              .filter((entry) => entry.classFeatures.length > 0 || entry.subclassFeatures.length > 0);
          },

        FormatWeaponName(character: CharacterRecord, weaponId: string): string {
            const weaponName = this.GetCatalogName('weapons', weaponId);
            const magicBonus = this.GetWeaponMagicBonus(character, weaponId);

            if (magicBonus <= 0) {
                return weaponName;
            }

            return `${weaponName} +${magicBonus}`;
        },

        FormatWeaponAttack(character: CharacterRecord, weaponId: string): string {
            const weapon = this.catalogs.weapons.find((item: CatalogItem) => item.id === weaponId);
            if (!weapon?.weaponDamage) {
                return '';
            }

            const props: string[] = weapon.weaponProperties ?? [];
            const isRanged = props.includes('ammunition') || ['Simple Ranged', 'Martial Ranged'].some((g) => weapon.description.startsWith(g));
            const isFinesse = props.includes('finesse');

            const strMod = this.GetAbilityModifier(character.abilityScores.strength);
            const dexMod = this.GetAbilityModifier(character.abilityScores.dexterity);

            let abilityMod: number;
            if (isFinesse) {
                abilityMod = Math.max(strMod, dexMod);
            } else if (isRanged) {
                abilityMod = dexMod;
            } else {
                abilityMod = strMod;
            }

            const profBonus = this.GetProficiencyBonus(this.GetTotalCharacterLevel(character));
            const magicBonus = this.GetWeaponMagicBonus(character, weaponId);
            const toHit = abilityMod + profBonus + magicBonus;
            const toHitText = toHit >= 0 ? `+${toHit}` : `${toHit}`;

            if (weapon.weaponDamage === '—') {
                return `${toHitText} to hit | special`;
            }

            const totalDamageBonus = abilityMod + magicBonus;
            const dmgBonus = totalDamageBonus !== 0 ? (totalDamageBonus > 0 ? `+${totalDamageBonus}` : `${totalDamageBonus}`) : '';
            return `${toHitText} to hit | ${weapon.weaponDamage}${dmgBonus} ${weapon.weaponDamageType}`;
        },

        GetSpellcastingAbilityForClassEntry(entry: ClassLevel): keyof CharacterRecord['abilityScores'] | undefined {
            const className = entry.classId.toLowerCase();
            const subclass = (entry.subclassName ?? '').toLowerCase();

            if (className.includes('bard') || className.includes('paladin') || className.includes('sorcerer') || className.includes('warlock')) {
                return 'charisma';
            }
            if (className.includes('cleric') || className.includes('druid') || className.includes('ranger')) {
                return 'wisdom';
            }
            if (className.includes('wizard')) {
                return 'intelligence';
            }
            if (className.includes('fighter') && subclass.includes('eldritch knight')) {
                return 'intelligence';
            }
            if (className.includes('rogue') && subclass.includes('arcane trickster')) {
                return 'intelligence';
            }

            return undefined;
        },

        GetBestSpellcastingAbility(character: CharacterRecord): keyof CharacterRecord['abilityScores'] | undefined {
            const abilities: Array<keyof CharacterRecord['abilityScores']> = [];

            for (const entry of character.classLevels) {
                const ability = this.GetSpellcastingAbilityForClassEntry(entry);
                if (ability) {
                    abilities.push(ability);
                }
            }

            if (abilities.length === 0) {
                return undefined;
            }

            return abilities.reduce((best, current) => {
                const bestMod = this.GetAbilityModifier(character.abilityScores[best]);
                const currentMod = this.GetAbilityModifier(character.abilityScores[current]);
                return currentMod > bestMod ? current : best;
            });
        },

        CharacterHasDamagingSpell(character: CharacterRecord): boolean {
            for (const spellId of character.spellIds) {
                const catalogSpell = this.catalogs.spells.find((item: CatalogItem) => item.id === spellId);
                if (!catalogSpell) {
                    continue;
                }

                const sourceSpell = GetSpellByName(catalogSpell.name);
                const damage = catalogSpell.damage ?? sourceSpell?.damage ?? SummarizeSpellDamage(catalogSpell.description ?? sourceSpell?.description ?? '');
                if (damage && damage !== 'See description') {
                    return true;
                }
            }

            return false;
        },

        GetSpellSaveDC(character: CharacterRecord): number {
            const ability = this.GetBestSpellcastingAbility(character);
            if (!ability) {
                return 8;
            }
            const abilityMod = this.GetAbilityModifier(character.abilityScores[ability as keyof CharacterRecord['abilityScores']]);
            const profBonus = this.GetProficiencyBonus(this.GetTotalCharacterLevel(character));
            return 8 + profBonus + abilityMod;
        },

        ShouldShowSpellAttack(character: CharacterRecord): boolean {
            return Boolean(this.GetBestSpellcastingAbility(character)) && this.CharacterHasDamagingSpell(character);
        },

        FormatSpellAttack(character: CharacterRecord): string {
            const ability = this.GetBestSpellcastingAbility(character);
            if (!ability) {
                return '';
            }

            const abilityKey = ability as keyof CharacterRecord['abilityScores'];
            const abilityMod = this.GetAbilityModifier(character.abilityScores[abilityKey]);
            const profBonus = this.GetProficiencyBonus(this.GetTotalCharacterLevel(character));
            const toHit = profBonus + abilityMod;
            const toHitText = toHit >= 0 ? `+${toHit}` : `${toHit}`;
            return `${toHitText} to hit | spell attack`;
        },

        FormatSpellLevel(level: number): string {
            if (level === 1) {
                return '1st';
            }
            if (level === 2) {
                return '2nd';
            }
            if (level === 3) {
                return '3rd';
            }

            return `${level}th`;
        },

        GetSpellSlotSummary(character: CharacterRecord | null): string[] {
            if (!character) {
                return [];
            }

            const classLevelsByName: Record<string, number> = {};
            for (const entry of character.classLevels) {
                const className = entry.classId.toLowerCase();
                if (!className) {
                    continue;
                }

                classLevelsByName[className] = (classLevelsByName[className] ?? 0) + Math.max(0, entry.level);
            }

            const fullCasterClasses = new Set(['bard', 'cleric', 'druid', 'sorcerer', 'wizard']);
            const halfCasterClasses = new Set(['paladin', 'ranger']);

            let multiclassCasterLevel = 0;
            for (const className in classLevelsByName) {
                const classLevel = classLevelsByName[className];
                if (fullCasterClasses.has(className)) {
                    multiclassCasterLevel += classLevel;
                } else if (halfCasterClasses.has(className)) {
                    multiclassCasterLevel += Math.floor(classLevel / 2);
                }
            }

            const spellSlotLines: string[] = [];
            const boundedCasterLevel = Math.min(20, Math.max(0, multiclassCasterLevel));
            const slots = SpellSlotsByCasterLevel[boundedCasterLevel] ?? [];
            if (slots.length > 0) {
                const slotText = slots
                    .map((count, index) => `${this.FormatSpellLevel(index + 1)}: ${count}`)
                    .join(', ');
                spellSlotLines.push(`Spell Slots - ${slotText}`);
            }

            const warlockLevel = classLevelsByName.warlock ?? 0;
            if (warlockLevel > 0) {
                const pactSlots = WarlockPactSlotsByLevel[Math.min(20, warlockLevel)] ?? { slots: 0, slotLevel: 0 };
                if (pactSlots.slots > 0 && pactSlots.slotLevel > 0) {
                    const slotLabel = pactSlots.slots === 1 ? 'slot' : 'slots';
                    spellSlotLines.push(`Pact Magic - ${pactSlots.slots} ${slotLabel} (${this.FormatSpellLevel(pactSlots.slotLevel)} level)`);
                }
            }

            return spellSlotLines;
        },

        GetSpellFacts(spellId: string): string[] {
            const spell = this.catalogs.spells.find((item: CatalogItem) => item.id === spellId);
            if (!spell) {
                return [];
            }

            // Use structured fields from the enriched spell catalog
            const srcSpell = GetSpellByName(spell.name);
            const descriptionText = (spell.description?.trim() || srcSpell?.description || '');
            const castingTime = srcSpell?.castingTime ?? 'Action';
            const range = srcSpell?.range ?? 'See description';
            const duration = srcSpell?.duration ?? 'See description';
            const components = srcSpell?.components ?? '';
            const school = srcSpell?.school ?? '';
            const ritual = srcSpell?.ritual ? ' (ritual)' : '';
            const concentration = srcSpell?.concentration ? ' ★ Concentration' : '';
            const effect = spell.effect ?? srcSpell?.effect ?? SummarizeSpellEffect(descriptionText);
            const damage = spell.damage ?? srcSpell?.damage ?? SummarizeSpellDamage(descriptionText);
            const scaling = spell.scaling ?? srcSpell?.scaling;

            const meta: string[] = [];
            if (school) meta.push(school.charAt(0).toUpperCase() + school.slice(1));
            if (components) meta.push(components);

            return [
                `Casting Time: ${castingTime}${ritual}${concentration}`,
                `Range: ${range}`,
                `Duration: ${duration}`,
                ...(damage ? [`Damage: ${damage}`] : []),
                ...(scaling ? [`Scaling: ${scaling}`] : []),
                ...(meta.length ? [`${meta.join(' · ')}`] : []),
                `Effects: ${effect || 'See full text'}`
            ];
        },

        FormatAbilityScore(score: number): string {
            const modifier = this.GetAbilityModifier(score);
            const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            return `${score} (${modifierText})`;
        },

        GetCatalogName(key: CatalogKey, id: string): string {
            return this.catalogs[key].find((item: CatalogItem) => item.id === id)?.name ?? 'Unknown';
        },

        GetTotalCharacterLevel(): number {
            let totalCharLvl: number = 0;
            this.editingCharacter.classLevels.forEach((classLevel: ClassLevel) => {
                if (classLevel.level < 0) {
                    console.warn(`Character ${this.editingCharacter.name} has a class level entry with negative level (${classLevel.classId} Lv ${classLevel.level}). Treating it as 0 for total level calculation.`);
                }
                totalCharLvl += classLevel.level > 0 ? classLevel.level : 0;
            

            });
            return totalCharLvl;
        }
    }
};

window.NpcEasyApp = NpcEasyApp;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Non-fatal: the app still runs without offline mode.
        });
    });
}
