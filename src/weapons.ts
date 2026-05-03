export enum DamageType {
    Slashing = 'slashing',
    Piercing = 'piercing',
    Bludgeoning = 'bludgeoning',
    Fire = 'fire',
    Cold = 'cold',
    Lightning = 'lightning',
    Acid = 'acid',
    Poison = 'poison',
    Psychic = 'psychic',
    Necrotic = 'necrotic',
    Radiant = 'radiant',
    Force = 'force',
    Thunder = 'thunder',
}

export enum WeaponCategory {
    Melee = 'melee',
    Ranged = 'ranged',
    Spell = 'spell',
    Unarmed = 'unarmed',
}

export interface AttackRoll {
    bonus: number;
    bonus_stat?: string;
    proficiency?: boolean;
}

export interface Damage {
    dice: string; // e.g., "1d6", "2d8"
    type: DamageType;
    bonus?: number;
}

export abstract class Weapon {
    name: string;
    category: WeaponCategory;
    attack: AttackRoll;
    damage: Damage;

    constructor(name: string, category: WeaponCategory, attack: AttackRoll, damage: Damage) {
        this.name = name;
        this.category = category;
        this.attack = attack;
        this.damage = damage;
    }

    getDescription(): string {
        return `${this.name} (${this.category})`;
    }
}

export class MeleeWeapon extends Weapon {
    range: number; // in feet

    constructor(name: string, attack: AttackRoll, damage: Damage, range: number = 5) {
        super(name, WeaponCategory.Melee, attack, damage);
        this.range = range;
    }

    getDescription(): string {
        return `${super.getDescription()} - Range: ${this.range}ft`;
    }
}

export class RangedWeapon extends Weapon {
    normalRange: number; // in feet
    longRange: number; // in feet
    ammunition?: string;

    constructor(name: string, attack: AttackRoll, damage: Damage, normalRange: number, longRange: number, ammunition?: string) {
        super(name, WeaponCategory.Ranged, attack, damage);
        this.normalRange = normalRange;
        this.longRange = longRange;
        this.ammunition = ammunition;
    }

    getDescription(): string {
        return `${super.getDescription()} - Range: ${this.normalRange}/${this.longRange}ft${this.ammunition ? ` (${this.ammunition})` : ''}`;
    }
}

export class SpellAttack extends Weapon {
    spellLevel: number;
    savingThrow?: string; // e.g., "DEX", "WIS"
    isSpell: boolean = true;

    constructor(name: string, attack: AttackRoll, damage: Damage, spellLevel: number, savingThrow?: string) {
        super(name, WeaponCategory.Spell, attack, damage);
        this.spellLevel = spellLevel;
        this.savingThrow = savingThrow;
    }

    getDescription(): string {
        const savingThrowInfo = this.savingThrow ? ` (${this.savingThrow} save)` : '';
        return `${super.getDescription()} - Level ${this.spellLevel}${savingThrowInfo}`;
    }
}

export class UnarmedAttack extends Weapon {
    constructor(name: string = 'Unarmed Strike', attack: AttackRoll, damage: Damage = { dice: '1d4', type: DamageType.Bludgeoning }) {
        super(name, WeaponCategory.Unarmed, attack, damage);
    }

    getDescription(): string {
        return `${super.getDescription()}`;
    }
}

export interface WeaponCatalogEntry {
    name: string;
    description: string;
    group: 'Simple Melee' | 'Simple Ranged' | 'Martial Melee' | 'Martial Ranged';
    damage: string;
    damageType: string;
    properties: string[];
}

export const SrdWeapons: WeaponCatalogEntry[] = [
    { name: 'Club',          damage: '1d4',  damageType: 'bludgeoning', properties: ['light'],                                group: 'Simple Melee',   description: '1d4 bludgeoning; light.' },
    { name: 'Dagger',        damage: '1d4',  damageType: 'piercing',    properties: ['finesse', 'light', 'thrown'],           group: 'Simple Melee',   description: '1d4 piercing; finesse, light, thrown (range 20/60).' },
    { name: 'Greatclub',     damage: '1d8',  damageType: 'bludgeoning', properties: ['two-handed'],                           group: 'Simple Melee',   description: '1d8 bludgeoning; two-handed.' },
    { name: 'Handaxe',       damage: '1d6',  damageType: 'slashing',    properties: ['light', 'thrown'],                      group: 'Simple Melee',   description: '1d6 slashing; light, thrown (range 20/60).' },
    { name: 'Javelin',       damage: '1d6',  damageType: 'piercing',    properties: ['thrown'],                               group: 'Simple Melee',   description: '1d6 piercing; thrown (range 30/120).' },
    { name: 'Light Hammer',  damage: '1d4',  damageType: 'bludgeoning', properties: ['light', 'thrown'],                      group: 'Simple Melee',   description: '1d4 bludgeoning; light, thrown (range 20/60).' },
    { name: 'Mace',          damage: '1d6',  damageType: 'bludgeoning', properties: [],                                       group: 'Simple Melee',   description: '1d6 bludgeoning.' },
    { name: 'Quarterstaff',  damage: '1d6',  damageType: 'bludgeoning', properties: ['versatile'],                            group: 'Simple Melee',   description: '1d6 bludgeoning; versatile (1d8).' },
    { name: 'Sickle',        damage: '1d4',  damageType: 'slashing',    properties: ['light'],                                group: 'Simple Melee',   description: '1d4 slashing; light.' },
    { name: 'Spear',         damage: '1d6',  damageType: 'piercing',    properties: ['thrown', 'versatile'],                  group: 'Simple Melee',   description: '1d6 piercing; thrown (range 20/60), versatile (1d8).' },

    { name: 'Light Crossbow', damage: '1d8', damageType: 'piercing',    properties: ['ammunition', 'loading', 'two-handed'],  group: 'Simple Ranged',  description: '1d8 piercing; ammunition (range 80/320), loading, two-handed.' },
    { name: 'Dart',           damage: '1d4', damageType: 'piercing',    properties: ['finesse', 'thrown'],                    group: 'Simple Ranged',  description: '1d4 piercing; finesse, thrown (range 20/60).' },
    { name: 'Shortbow',       damage: '1d6', damageType: 'piercing',    properties: ['ammunition', 'two-handed'],             group: 'Simple Ranged',  description: '1d6 piercing; ammunition (range 80/320), two-handed.' },
    { name: 'Sling',          damage: '1d4', damageType: 'bludgeoning', properties: ['ammunition'],                           group: 'Simple Ranged',  description: '1d4 bludgeoning; ammunition (range 30/120).' },

    { name: 'Battleaxe',     damage: '1d8',  damageType: 'slashing',    properties: ['versatile'],                            group: 'Martial Melee',  description: '1d8 slashing; versatile (1d10).' },
    { name: 'Flail',         damage: '1d8',  damageType: 'bludgeoning', properties: [],                                       group: 'Martial Melee',  description: '1d8 bludgeoning.' },
    { name: 'Glaive',        damage: '1d10', damageType: 'slashing',    properties: ['heavy', 'reach', 'two-handed'],         group: 'Martial Melee',  description: '1d10 slashing; heavy, reach, two-handed.' },
    { name: 'Greataxe',      damage: '1d12', damageType: 'slashing',    properties: ['heavy', 'two-handed'],                  group: 'Martial Melee',  description: '1d12 slashing; heavy, two-handed.' },
    { name: 'Greatsword',    damage: '2d6',  damageType: 'slashing',    properties: ['heavy', 'two-handed'],                  group: 'Martial Melee',  description: '2d6 slashing; heavy, two-handed.' },
    { name: 'Halberd',       damage: '1d10', damageType: 'slashing',    properties: ['heavy', 'reach', 'two-handed'],         group: 'Martial Melee',  description: '1d10 slashing; heavy, reach, two-handed.' },
    { name: 'Lance',         damage: '1d12', damageType: 'piercing',    properties: ['reach', 'special'],                     group: 'Martial Melee',  description: '1d12 piercing; reach, special.' },
    { name: 'Longsword',     damage: '1d8',  damageType: 'slashing',    properties: ['versatile'],                            group: 'Martial Melee',  description: '1d8 slashing; versatile (1d10).' },
    { name: 'Maul',          damage: '2d6',  damageType: 'bludgeoning', properties: ['heavy', 'two-handed'],                  group: 'Martial Melee',  description: '2d6 bludgeoning; heavy, two-handed.' },
    { name: 'Morningstar',   damage: '1d8',  damageType: 'piercing',    properties: [],                                       group: 'Martial Melee',  description: '1d8 piercing.' },
    { name: 'Pike',          damage: '1d10', damageType: 'piercing',    properties: ['heavy', 'reach', 'two-handed'],         group: 'Martial Melee',  description: '1d10 piercing; heavy, reach, two-handed.' },
    { name: 'Rapier',        damage: '1d8',  damageType: 'piercing',    properties: ['finesse'],                              group: 'Martial Melee',  description: '1d8 piercing; finesse.' },
    { name: 'Scimitar',      damage: '1d6',  damageType: 'slashing',    properties: ['finesse', 'light'],                     group: 'Martial Melee',  description: '1d6 slashing; finesse, light.' },
    { name: 'Shortsword',    damage: '1d6',  damageType: 'piercing',    properties: ['finesse', 'light'],                     group: 'Martial Melee',  description: '1d6 piercing; finesse, light.' },
    { name: 'Trident',       damage: '1d6',  damageType: 'piercing',    properties: ['thrown', 'versatile'],                  group: 'Martial Melee',  description: '1d6 piercing; thrown (range 20/60), versatile (1d8).' },
    { name: 'War Pick',      damage: '1d8',  damageType: 'piercing',    properties: [],                                       group: 'Martial Melee',  description: '1d8 piercing.' },
    { name: 'Warhammer',     damage: '1d8',  damageType: 'bludgeoning', properties: ['versatile'],                            group: 'Martial Melee',  description: '1d8 bludgeoning; versatile (1d10).' },
    { name: 'Whip',          damage: '1d4',  damageType: 'slashing',    properties: ['finesse', 'reach'],                     group: 'Martial Melee',  description: '1d4 slashing; finesse, reach.' },

    { name: 'Blowgun',       damage: '1',    damageType: 'piercing',    properties: ['ammunition', 'loading'],                group: 'Martial Ranged', description: '1 piercing; ammunition (range 25/100), loading.' },
    { name: 'Hand Crossbow', damage: '1d6',  damageType: 'piercing',    properties: ['ammunition', 'light', 'loading'],       group: 'Martial Ranged', description: '1d6 piercing; ammunition (range 30/120), light, loading.' },
    { name: 'Heavy Crossbow', damage: '1d10', damageType: 'piercing',   properties: ['ammunition', 'heavy', 'loading', 'two-handed'], group: 'Martial Ranged', description: '1d10 piercing; ammunition (range 100/400), heavy, loading, two-handed.' },
    { name: 'Longbow',       damage: '1d8',  damageType: 'piercing',    properties: ['ammunition', 'heavy', 'two-handed'],    group: 'Martial Ranged', description: '1d8 piercing; ammunition (range 150/600), heavy, two-handed.' },
    { name: 'Net',           damage: '—',    damageType: 'special',     properties: ['thrown', 'special'],                    group: 'Martial Ranged', description: 'Special; thrown (range 5/15), special.' },
];
