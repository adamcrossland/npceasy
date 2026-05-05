// D&D 5e Fighting Styles for Fighter, Paladin, and Ranger

export interface FightingStyle {
    name: string;
    description: string;
}

export const FightingStyles: FightingStyle[] = [
    {
        name: 'Archery',
        description: 'You gain a +2 bonus to attack rolls you make with a ranged weapon.'
    },
    {
        name: 'Defense',
        description: 'While wearing armor, you gain a +1 bonus to AC.'
    },
    {
        name: 'Dueling',
        description: 'While wielding a melee weapon in one hand and no other weapons, you gain +2 bonus on damage rolls.'
    },
    {
        name: 'Great Weapon Fighting',
        description: 'While attacking with a two-handed weapon, re-roll all 1s and 2s on damage rolls.'
    },
    {
        name: 'Protection',
        description: 'When using a shield, you can impose disadvantage on any attack against a creature within 5 feet of you.'
    },
    {
        name: 'Two-Weapon Fighting',
        description: 'When fighting with two weapons, add your ability modifier to the damage of the second attack.'
    }
];
