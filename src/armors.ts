export interface ArmorRecord {
    id: string;
    name: string;
    category: 'Light' | 'Medium' | 'Heavy';
    baseArmorClass: number;
    maxDexBonus?: number;
    minimumStrength?: number;
    stealthDisadvantage?: boolean;
    description: string;
}

export const Armors: ArmorRecord[] = [
    {
        id: 'armor-padded',
        name: 'Padded',
        category: 'Light',
        baseArmorClass: 11,
        stealthDisadvantage: true,
        description: 'Light armor. AC 11 + Dex modifier. Disadvantage on Stealth.'
    },
    {
        id: 'armor-leather',
        name: 'Leather',
        category: 'Light',
        baseArmorClass: 11,
        description: 'Light armor. AC 11 + Dex modifier.'
    },
    {
        id: 'armor-studded-leather',
        name: 'Studded Leather',
        category: 'Light',
        baseArmorClass: 12,
        description: 'Light armor. AC 12 + Dex modifier.'
    },
    {
        id: 'armor-hide',
        name: 'Hide',
        category: 'Medium',
        baseArmorClass: 12,
        maxDexBonus: 2,
        description: 'Medium armor. AC 12 + Dex modifier (max +2).'
    },
    {
        id: 'armor-chain-shirt',
        name: 'Chain Shirt',
        category: 'Medium',
        baseArmorClass: 13,
        maxDexBonus: 2,
        description: 'Medium armor. AC 13 + Dex modifier (max +2).'
    },
    {
        id: 'armor-scale-mail',
        name: 'Scale Mail',
        category: 'Medium',
        baseArmorClass: 14,
        maxDexBonus: 2,
        stealthDisadvantage: true,
        description: 'Medium armor. AC 14 + Dex modifier (max +2). Disadvantage on Stealth.'
    },
    {
        id: 'armor-breastplate',
        name: 'Breastplate',
        category: 'Medium',
        baseArmorClass: 14,
        maxDexBonus: 2,
        description: 'Medium armor. AC 14 + Dex modifier (max +2).'
    },
    {
        id: 'armor-half-plate',
        name: 'Half Plate',
        category: 'Medium',
        baseArmorClass: 15,
        maxDexBonus: 2,
        stealthDisadvantage: true,
        description: 'Medium armor. AC 15 + Dex modifier (max +2). Disadvantage on Stealth.'
    },
    {
        id: 'armor-ring-mail',
        name: 'Ring Mail',
        category: 'Heavy',
        baseArmorClass: 14,
        maxDexBonus: 0,
        stealthDisadvantage: true,
        description: 'Heavy armor. AC 14. Disadvantage on Stealth.'
    },
    {
        id: 'armor-chain-mail',
        name: 'Chain Mail',
        category: 'Heavy',
        baseArmorClass: 16,
        maxDexBonus: 0,
        minimumStrength: 13,
        stealthDisadvantage: true,
        description: 'Heavy armor. AC 16. Str 13. Disadvantage on Stealth.'
    },
    {
        id: 'armor-splint',
        name: 'Splint',
        category: 'Heavy',
        baseArmorClass: 17,
        maxDexBonus: 0,
        minimumStrength: 15,
        stealthDisadvantage: true,
        description: 'Heavy armor. AC 17. Str 15. Disadvantage on Stealth.'
    },
    {
        id: 'armor-plate',
        name: 'Plate',
        category: 'Heavy',
        baseArmorClass: 18,
        maxDexBonus: 0,
        minimumStrength: 15,
        stealthDisadvantage: true,
        description: 'Heavy armor. AC 18. Str 15. Disadvantage on Stealth.'
    }
];