export interface MagicItem {
    name: string;
    description: string;
    category?: string;
    requiresAttunement?: boolean;
    attackBonusScope?: 'all-attacks' | 'weapon-attacks' | 'melee-weapon-attacks' | 'ranged-weapon-attacks' | 'spell-attacks';
    damageBonusScope?: 'all-damage' | 'weapon-damage' | 'melee-weapon-damage' | 'ranged-weapon-damage' | 'spell-damage';
    abilityScoreBonuses?: Partial<Record<'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma', number>>;
    abilityScoreMinimums?: Partial<Record<'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma', number>>;
    savingThrowBonus?: number;
    armorClassBonus?: number;
    toHitBonus?: number;
    damageBonus?: number;
    resistances?: string[];
}

export const SrdMagicItems: MagicItem[] = [
    {
        name: 'Weapon, +1',
        description: 'You have a +1 bonus to attack and damage rolls made with this magic weapon.',
        category: 'Weapon',
        toHitBonus: 1,
        damageBonus: 1
    },
    {
        name: 'Weapon, +2',
        description: 'You have a +2 bonus to attack and damage rolls made with this magic weapon.',
        category: 'Weapon',
        toHitBonus: 2,
        damageBonus: 2
    },
    {
        name: 'Weapon, +3',
        description: 'You have a +3 bonus to attack and damage rolls made with this magic weapon.',
        category: 'Weapon',
        toHitBonus: 3,
        damageBonus: 3
    },
    {
        name: 'Amulet of Health',
        description: 'Your Constitution score is 19 while you wear this amulet.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreMinimums: { constitution: 19 }
    },
    {
        name: 'Belt of Giant Strength (Hill)',
        description: 'Your Strength score is 21 while you wear this belt.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreMinimums: { strength: 21 }
    },
    {
        name: 'Belt of Giant Strength (Stone/Frost)',
        description: 'Your Strength score is 23 while you wear this belt.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreMinimums: { strength: 23 }
    },
    {
        name: 'Belt of Giant Strength (Fire)',
        description: 'Your Strength score is 25 while you wear this belt.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreMinimums: { strength: 25 }
    },
    {
        name: 'Belt of Giant Strength (Cloud)',
        description: 'Your Strength score is 27 while you wear this belt.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreMinimums: { strength: 27 }
    },
    {
        name: 'Belt of Giant Strength (Storm)',
        description: 'Your Strength score is 29 while you wear this belt.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreMinimums: { strength: 29 }
    },
    {
        name: 'Gauntlets of Ogre Power',
        description: 'Your Strength score is 19 while you wear these gauntlets.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreMinimums: { strength: 19 }
    },
    {
        name: 'Headband of Intellect',
        description: 'Your Intelligence score is 19 while you wear this headband.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreMinimums: { intelligence: 19 }
    },
    {
        name: 'Ioun Stone (Agility)',
        description: 'Your Dexterity score increases by 2, to a maximum of 20, while this stone orbits your head.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreBonuses: { dexterity: 2 }
    },
    {
        name: 'Ioun Stone (Insight)',
        description: 'Your Wisdom score increases by 2, to a maximum of 20, while this stone orbits your head.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreBonuses: { wisdom: 2 }
    },
    {
        name: 'Ioun Stone (Intellect)',
        description: 'Your Intelligence score increases by 2, to a maximum of 20, while this stone orbits your head.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreBonuses: { intelligence: 2 }
    },
    {
        name: 'Ioun Stone (Leadership)',
        description: 'Your Charisma score increases by 2, to a maximum of 20, while this stone orbits your head.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreBonuses: { charisma: 2 }
    },
    {
        name: 'Ioun Stone (Strength)',
        description: 'Your Strength score increases by 2, to a maximum of 20, while this stone orbits your head.',
        category: 'Wondrous item',
        requiresAttunement: true,
        abilityScoreBonuses: { strength: 2 }
    },
    {
        name: 'Stone of Good Luck (Luckstone)',
        description: 'You gain a +1 bonus to ability checks and saving throws while this stone is on your person.',
        category: 'Wondrous item',
        requiresAttunement: true,
        savingThrowBonus: 1
    },
    {
        name: 'Cloak of Protection',
        description: 'You gain a +1 bonus to AC and saving throws while you wear this cloak.',
        category: 'Wondrous item',
        requiresAttunement: true,
        savingThrowBonus: 1,
        armorClassBonus: 1
    },
    {
        name: 'Ring of Protection',
        description: 'You gain a +1 bonus to AC and saving throws while wearing this ring.',
        category: 'Ring',
        requiresAttunement: true,
        savingThrowBonus: 1,
        armorClassBonus: 1
    },
    {
        name: 'Ring of Resistance (Acid)',
        description: 'You have resistance to acid damage while wearing this ring.',
        category: 'Ring',
        requiresAttunement: true,
        resistances: ['acid']
    },
    {
        name: 'Ring of Resistance (Cold)',
        description: 'You have resistance to cold damage while wearing this ring.',
        category: 'Ring',
        requiresAttunement: true,
        resistances: ['cold']
    },
    {
        name: 'Ring of Resistance (Fire)',
        description: 'You have resistance to fire damage while wearing this ring.',
        category: 'Ring',
        requiresAttunement: true,
        resistances: ['fire']
    },
    {
        name: 'Ring of Resistance (Lightning)',
        description: 'You have resistance to lightning damage while wearing this ring.',
        category: 'Ring',
        requiresAttunement: true,
        resistances: ['lightning']
    },
    {
        name: 'Ring of Resistance (Poison)',
        description: 'You have resistance to poison damage while wearing this ring.',
        category: 'Ring',
        requiresAttunement: true,
        resistances: ['poison']
    },
    {
        name: 'Ring of Resistance (Thunder)',
        description: 'You have resistance to thunder damage while wearing this ring.',
        category: 'Ring',
        requiresAttunement: true,
        resistances: ['thunder']
    },
    {
        name: 'All-Purpose Tool +1',
        description: 'This tool grants a +1 bonus to spell attack rolls and saving throw DCs.',
        category: 'Tool',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 1
    },
    {
        name: 'Bloodwell Vial +1',
        description: 'This vial grants a +1 bonus to spell attack rolls and saving throw DCs.',
        category: 'Wondrous item',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 1
    },
    {
        name: 'Bloodwell Vial +2',
        description: 'This vial grants a +2 bonus to spell attack rolls and saving throw DCs.',
        category: 'Wondrous item',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 2
    },
    {
        name: 'Bloodwell Vial +3',
        description: 'This vial grants a +3 bonus to spell attack rolls and saving throw DCs.',
        category: 'Wondrous item',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 3
    },
    {
        name: 'Moon Sickle +1',
        description: 'This sickle grants a +1 bonus to spell attack rolls and saving throw DCs.',
        category: 'Weapon',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 1
    },
    {
        name: 'Moon Sickle +2',
        description: 'This sickle grants a +2 bonus to spell attack rolls and saving throw DCs.',
        category: 'Weapon',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 2
    },
    {
        name: 'Moon Sickle +3',
        description: 'This sickle grants a +3 bonus to spell attack rolls and saving throw DCs.',
        category: 'Weapon',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 3
    },
    {
        name: 'Rod of the Pact Keeper +1',
        description: 'While holding this rod, you gain a +1 bonus to spell attack rolls and spell save DCs.',
        category: 'Rod',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 1
    },
    {
        name: 'Rod of the Pact Keeper +2',
        description: 'While holding this rod, you gain a +2 bonus to spell attack rolls and spell save DCs.',
        category: 'Rod',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 2
    },
    {
        name: 'Rod of the Pact Keeper +3',
        description: 'While holding this rod, you gain a +3 bonus to spell attack rolls and spell save DCs.',
        category: 'Rod',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 3
    },
    {
        name: 'Wand of the War Mage +1',
        description: 'While holding this wand, you gain a +1 bonus to spell attack rolls.',
        category: 'Wand',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 1
    },
    {
        name: 'Wand of the War Mage +2',
        description: 'While holding this wand, you gain a +2 bonus to spell attack rolls.',
        category: 'Wand',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 2
    },
    {
        name: 'Wand of the War Mage +3',
        description: 'While holding this wand, you gain a +3 bonus to spell attack rolls.',
        category: 'Wand',
        requiresAttunement: true,
        attackBonusScope: 'spell-attacks',
        toHitBonus: 3
    },
    {
        name: 'Dragon Slayer',
        description: 'You gain a +1 bonus to attack and damage rolls made with this weapon, and damage rolls against dragons deal an extra 3d6 damage.',
        category: 'Weapon',
        requiresAttunement: true,
        attackBonusScope: 'weapon-attacks',
        damageBonusScope: 'weapon-damage',
        toHitBonus: 1,
        damageBonus: 1
    },
    {
        name: 'Flame Tongue',
        description: 'You can use a bonus action to speak the command word, causing flames to erupt from the blade. The weapon deals an extra 2d6 fire damage on a hit.',
        category: 'Weapon',
        requiresAttunement: true,
        damageBonusScope: 'weapon-damage',
        damageBonus: 2
    },
    {
        name: 'Frost Brand',
        description: 'You gain resistance to fire damage while holding this weapon, and it deals extra cold damage on a hit.',
        category: 'Weapon',
        requiresAttunement: true,
        damageBonusScope: 'weapon-damage',
        damageBonus: 1,
        resistances: ['fire']
    },
    {
        name: 'Holy Avenger',
        description: 'This sword grants a +3 bonus to attack and damage rolls and extra radiant power against fiends and undead.',
        category: 'Weapon',
        requiresAttunement: true,
        attackBonusScope: 'weapon-attacks',
        damageBonusScope: 'weapon-damage',
        toHitBonus: 3,
        damageBonus: 3
    }
];
