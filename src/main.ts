import './style.css';
import { AllClasses } from './classes';
import { Feats } from './feats';
import { Races } from './races';
import { Spells } from './spells';
import { SrdWeapons } from './weapons';

type Screen = 'Collections' | 'CharacterBuilder' | 'Compendium' | 'CharacterSheet';
type CatalogKey = 'classes' | 'feats' | 'weapons' | 'spells' | 'races';

type CatalogItem = {
    id: string;
    name: string;
    description: string;
  level?: number;
  classes?: string[];
};

type ClassLevel = {
    classId: string;
    level: number;
};

type CharacterRecord = {
    id: string;
    name: string;
    raceId: string;
    classLevels: ClassLevel[];
    level: number;
    experience: number;
    hitPoints: number;
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

const DEFAULT_WEAPONS: CatalogItem[] = SrdWeapons.map((item) => ({
  id: `weapon-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  name: item.name,
  description: `${item.group}: ${item.description}`
}));

const DEFAULT_SPELLS: CatalogItem[] = Spells.map((item) => ({
  id: `spell-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  name: item.name,
  description: item.description,
  level: item.level,
  classes: item.classes
}));

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
      level: item.level ?? canonical?.level ?? inferredLevelFromDescription ?? 0,
      classes: item.classes ?? canonical?.classes ?? inferredClassesFromDescription ?? []
    };
  });
}

function NewId(prefix: string): string {
    return `${prefix}-${crypto.randomUUID()}`;
}

function BuildDefaultState(): AppState {
    return {
        screen: 'Collections',
        collections: [],
        selectedCollectionId: '',
        selectedCharacterId: '',
        catalogs: {
            classes: AllClasses.map(item => ({
                id: NewId('class'),
                name: item.classType,
                description: `Hit Die: d${item.hitDice}`
            })),
            feats: Feats.map(item => ({
                id: NewId('feat'),
                name: item.name,
                description: item.prerequisites ? `${item.description} Prereq: ${item.prerequisites}` : item.description
            })),
            weapons: DEFAULT_WEAPONS,
            spells: DEFAULT_SPELLS,
            races: Races.map(item => ({
                id: NewId('race'),
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
        level: 1,
        experience: 0,
        hitPoints: 8,
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
        spellIds: [],
        alignment: '',
        background: '',
        personality: '',
        ideals: '',
        bonds: '',
        flaws: ''
    };
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

        return {
            ...BuildDefaultState(),
            ...parsed,
            catalogs: {
                ...BuildDefaultState().catalogs,
                ...parsed.catalogs,
                weapons: isLegacyWeaponCatalog ? DEFAULT_WEAPONS : (parsed.catalogs?.weapons ?? BuildDefaultState().catalogs.weapons),
            spells: NormalizeSpellCatalog(isLegacySpellCatalog ? DEFAULT_SPELLS : (parsed.catalogs?.spells ?? BuildDefaultState().catalogs.spells))
            }
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
  <header class="sticky top-0 z-10 border-b border-amber-100/80 bg-sand/90 backdrop-blur">
    <div class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
      <div>
        <p class="font-display text-xl tracking-wide text-ink md:text-2xl">NPC Easy</p>
        <p class="text-xs uppercase tracking-[0.2em] text-ink-soft">Offline Campaign Workbench</p>
      </div>
      <nav class="grid grid-cols-2 gap-2 md:flex md:items-center">
        <button class="tab-btn" :class="{ 'tab-btn-active': screen === 'Collections' }" @click="screen = 'Collections'">Collections</button>
        <button class="tab-btn" :class="{ 'tab-btn-active': screen === 'CharacterBuilder' }" @click="screen = 'CharacterBuilder'">Character Builder</button>
        <button class="tab-btn" :class="{ 'tab-btn-active': screen === 'Compendium' }" @click="screen = 'Compendium'">Compendium</button>
        <button class="tab-btn" :class="{ 'tab-btn-active': screen === 'CharacterSheet' }" @click="screen = 'CharacterSheet'">Character Sheet</button>
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
                <select x-model="editingCharacter.raceId" class="input-base">
                  <option value="">Choose a race</option>
                  <template x-for="race in catalogs.races" :key="race.id">
                    <option :value="race.id" x-text="race.name"></option>
                  </template>
                </select>
              </label>
            </div>

            <div class="grid gap-3 md:grid-cols-4">
              <label class="field-label">Level
                <input x-model.number="editingCharacter.level" type="number" min="1" class="input-base" />
              </label>
              <label class="field-label">Experience
                <input x-model.number="editingCharacter.experience" type="number" min="0" class="input-base" />
              </label>
              <label class="field-label">HP / Max HP
                <div class="grid grid-cols-2 gap-2">
                  <input x-model.number="editingCharacter.hitPoints" type="number" min="0" class="input-base" />
                  <input x-model.number="editingCharacter.maxHitPoints" type="number" min="0" class="input-base" />
                </div>
              </label>
              <label class="field-label">AC / Speed
                <div class="grid grid-cols-2 gap-2">
                  <input x-model.number="editingCharacter.armorClass" type="number" min="1" class="input-base" />
                  <input x-model.number="editingCharacter.speed" type="number" min="0" class="input-base" />
                </div>
              </label>
            </div>

            <div>
              <p class="field-heading">Ability Scores</p>
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
                  <div class="grid grid-cols-[1fr_90px_auto] gap-2">
                    <select x-model="row.classId" class="input-base">
                      <option value="">Choose class</option>
                      <template x-for="entry in catalogs.classes" :key="entry.id">
                        <option :value="entry.id" x-text="entry.name"></option>
                      </template>
                    </select>
                    <input x-model.number="row.level" type="number" min="1" class="input-base" />
                    <button type="button" class="btn-danger" @click="RemoveClassLevel(index)">Remove</button>
                  </div>
                </template>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
              <label class="field-label">Feats
                <select x-model="editingCharacter.featIds" multiple size="7" class="input-base min-h-[180px]">
                  <template x-for="entry in catalogs.feats" :key="entry.id">
                    <option :value="entry.id" x-text="entry.name"></option>
                  </template>
                </select>
              </label>
              <label class="field-label">Weapons
                <select x-model="editingCharacter.weaponIds" multiple size="7" class="input-base min-h-[180px]">
                  <template x-for="entry in catalogs.weapons" :key="entry.id">
                    <option :value="entry.id" x-text="entry.name"></option>
                  </template>
                </select>
              </label>
              <label class="field-label">Spells
                <select x-model="editingCharacter.spellIds" multiple size="7" class="input-base min-h-[180px]">
                  <template x-for="entry in catalogs.spells" :key="entry.id">
                    <option :value="entry.id" x-text="entry.name"></option>
                  </template>
                </select>
              </label>
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
            </template>
          </div>
        </div>
      </template>
    </section>

    <section x-show="screen === 'CharacterSheet'" class="space-y-5" x-cloak>
      <div class="panel">
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
              <span> | Level </span><span x-text="editingCharacter?.level ?? 0"></span>
              <span> | </span><span x-text="editingCharacter?.alignment || 'Unaligned'"></span>
            </p>
          </div>
          <div class="sheet-badges">
            <span>HP <strong x-text="editingCharacter?.hitPoints ?? 0"></strong>/<span x-text="editingCharacter?.maxHitPoints ?? 0"></span></span>
            <span>AC <strong x-text="editingCharacter?.armorClass ?? 0"></strong></span>
            <span>Speed <strong x-text="editingCharacter?.speed ?? 0"></strong> ft</span>
          </div>
        </header>

        <section class="sheet-grid">
          <div class="sheet-card">
            <h4>Ability Scores</h4>
            <dl class="score-grid">
              <div><dt>STR</dt><dd x-text="editingCharacter?.abilityScores.strength"></dd></div>
              <div><dt>DEX</dt><dd x-text="editingCharacter?.abilityScores.dexterity"></dd></div>
              <div><dt>CON</dt><dd x-text="editingCharacter?.abilityScores.constitution"></dd></div>
              <div><dt>INT</dt><dd x-text="editingCharacter?.abilityScores.intelligence"></dd></div>
              <div><dt>WIS</dt><dd x-text="editingCharacter?.abilityScores.wisdom"></dd></div>
              <div><dt>CHA</dt><dd x-text="editingCharacter?.abilityScores.charisma"></dd></div>
            </dl>
          </div>

          <div class="sheet-card">
            <h4>Class Levels</h4>
            <ul class="list-base">
              <template x-for="entry in editingCharacter?.classLevels ?? []" :key="entry.classId + '-' + entry.level">
                <li>
                  <span x-text="GetCatalogName('classes', entry.classId)"></span>
                  <span class="opacity-75">(Lv <span x-text="entry.level"></span>)</span>
                </li>
              </template>
            </ul>
          </div>

          <div class="sheet-card">
            <h4>Feats</h4>
            <ul class="list-base">
              <template x-for="id in editingCharacter?.featIds ?? []" :key="id">
                <li x-text="GetCatalogName('feats', id)"></li>
              </template>
            </ul>
          </div>

          <div class="sheet-card">
            <h4>Weapons</h4>
            <ul class="list-base">
              <template x-for="id in editingCharacter?.weaponIds ?? []" :key="id">
                <li x-text="GetCatalogName('weapons', id)"></li>
              </template>
            </ul>
          </div>

          <div class="sheet-card">
            <h4>Spells</h4>
            <ul class="list-base">
              <template x-for="id in editingCharacter?.spellIds ?? []" :key="id">
                <li x-text="GetCatalogName('spells', id)"></li>
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

        AddClassLevel() {
            if (!this.editingCharacter) {
                return;
            }

            this.editingCharacter.classLevels.push({
                classId: this.catalogs.classes[0]?.id ?? '',
                level: 1
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

        AddCompendiumItem(key: CatalogKey) {
          const item: CatalogItem = {
                id: NewId(key.slice(0, -1)),
                name: `New ${key.slice(0, -1)}`,
                description: ''
          };

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
            this.catalogs[key] = this.catalogs[key].filter((item: CatalogItem) => item.id !== id);

            if (this.editingCharacter) {
                if (key === 'feats') {
                    this.editingCharacter.featIds = this.editingCharacter.featIds.filter((value: string) => value !== id);
                }
                if (key === 'weapons') {
                    this.editingCharacter.weaponIds = this.editingCharacter.weaponIds.filter((value: string) => value !== id);
                }
                if (key === 'spells') {
                    this.editingCharacter.spellIds = this.editingCharacter.spellIds.filter((value: string) => value !== id);
                }
                if (key === 'races' && this.editingCharacter.raceId === id) {
                    this.editingCharacter.raceId = '';
                }
                if (key === 'classes') {
                    this.editingCharacter.classLevels = this.editingCharacter.classLevels.filter((entry: ClassLevel) => entry.classId !== id);
                }
            }

            this.SaveAll();
        },

        GetCatalogName(key: CatalogKey, id: string): string {
            return this.catalogs[key].find((item: CatalogItem) => item.id === id)?.name ?? 'Unknown';
        }
    };
};

    window.NpcEasyApp = NpcEasyApp;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Non-fatal: the app still runs without offline mode.
        });
    });
}
