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
