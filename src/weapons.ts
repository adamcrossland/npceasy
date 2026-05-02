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
}

export const SrdWeapons: WeaponCatalogEntry[] = [
    { name: 'Club', description: '1d4 bludgeoning; light.', group: 'Simple Melee' },
    { name: 'Dagger', description: '1d4 piercing; finesse, light, thrown (range 20/60).', group: 'Simple Melee' },
    { name: 'Greatclub', description: '1d8 bludgeoning; two-handed.', group: 'Simple Melee' },
    { name: 'Handaxe', description: '1d6 slashing; light, thrown (range 20/60).', group: 'Simple Melee' },
    { name: 'Javelin', description: '1d6 piercing; thrown (range 30/120).', group: 'Simple Melee' },
    { name: 'Light Hammer', description: '1d4 bludgeoning; light, thrown (range 20/60).', group: 'Simple Melee' },
    { name: 'Mace', description: '1d6 bludgeoning.', group: 'Simple Melee' },
    { name: 'Quarterstaff', description: '1d6 bludgeoning; versatile (1d8).', group: 'Simple Melee' },
    { name: 'Sickle', description: '1d4 slashing; light.', group: 'Simple Melee' },
    { name: 'Spear', description: '1d6 piercing; thrown (range 20/60), versatile (1d8).', group: 'Simple Melee' },

    { name: 'Light Crossbow', description: '1d8 piercing; ammunition (range 80/320), loading, two-handed.', group: 'Simple Ranged' },
    { name: 'Dart', description: '1d4 piercing; finesse, thrown (range 20/60).', group: 'Simple Ranged' },
    { name: 'Shortbow', description: '1d6 piercing; ammunition (range 80/320), two-handed.', group: 'Simple Ranged' },
    { name: 'Sling', description: '1d4 bludgeoning; ammunition (range 30/120).', group: 'Simple Ranged' },

    { name: 'Battleaxe', description: '1d8 slashing; versatile (1d10).', group: 'Martial Melee' },
    { name: 'Flail', description: '1d8 bludgeoning.', group: 'Martial Melee' },
    { name: 'Glaive', description: '1d10 slashing; heavy, reach, two-handed.', group: 'Martial Melee' },
    { name: 'Greataxe', description: '1d12 slashing; heavy, two-handed.', group: 'Martial Melee' },
    { name: 'Greatsword', description: '2d6 slashing; heavy, two-handed.', group: 'Martial Melee' },
    { name: 'Halberd', description: '1d10 slashing; heavy, reach, two-handed.', group: 'Martial Melee' },
    { name: 'Lance', description: '1d12 piercing; reach, special.', group: 'Martial Melee' },
    { name: 'Longsword', description: '1d8 slashing; versatile (1d10).', group: 'Martial Melee' },
    { name: 'Maul', description: '2d6 bludgeoning; heavy, two-handed.', group: 'Martial Melee' },
    { name: 'Morningstar', description: '1d8 piercing.', group: 'Martial Melee' },
    { name: 'Pike', description: '1d10 piercing; heavy, reach, two-handed.', group: 'Martial Melee' },
    { name: 'Rapier', description: '1d8 piercing; finesse.', group: 'Martial Melee' },
    { name: 'Scimitar', description: '1d6 slashing; finesse, light.', group: 'Martial Melee' },
    { name: 'Shortsword', description: '1d6 piercing; finesse, light.', group: 'Martial Melee' },
    { name: 'Trident', description: '1d6 piercing; thrown (range 20/60), versatile (1d8).', group: 'Martial Melee' },
    { name: 'War Pick', description: '1d8 piercing.', group: 'Martial Melee' },
    { name: 'Warhammer', description: '1d8 bludgeoning; versatile (1d10).', group: 'Martial Melee' },
    { name: 'Whip', description: '1d4 slashing; finesse, reach.', group: 'Martial Melee' },

    { name: 'Blowgun', description: '1 piercing; ammunition (range 25/100), loading.', group: 'Martial Ranged' },
    { name: 'Hand Crossbow', description: '1d6 piercing; ammunition (range 30/120), light, loading.', group: 'Martial Ranged' },
    { name: 'Heavy Crossbow', description: '1d10 piercing; ammunition (range 100/400), heavy, loading, two-handed.', group: 'Martial Ranged' },
    { name: 'Longbow', description: '1d8 piercing; ammunition (range 150/600), heavy, two-handed.', group: 'Martial Ranged' },
    { name: 'Net', description: 'Special; thrown (range 5/15), special.', group: 'Martial Ranged' },
];
