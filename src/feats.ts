export interface Feat {
    name: string;
    description: string;
    prerequisites?: string;
}

export const Feats: Feat[] = [
    {
        name: 'Alert',
        description: '+5 to initiative, cannot be surprised while conscious; hidden creatures get no advantage on attack rolls.',
    },
    {
        name: 'Athlete',
        description: '+1 STR or DEX; improved climbing and jumping.',
    },
    {
        name: 'Actor',
        description: '+1 CHA; mimic speech and sounds you have heard.',
    },
    {
        name: 'Charger',
        description: 'Dash followed by attack or shove gains a bonus to the attack or shove.',
    },
    {
        name: 'Crossbow Expert',
        description: 'Ignore loading property, no disadvantage in melee; can attack with a hand crossbow as bonus action.',
        prerequisites: 'Proficiency with crossbows',
    },
    {
        name: 'Defensive Duelist',
        description: 'With finesse weapon, use reaction to add your proficiency bonus to AC against one melee attack.',
        prerequisites: 'Dexterity 13 or higher',
    },
    {
        name: 'Dual Wielder',
        description: '+1 AC while wielding two melee weapons; non-light weapons for two-weapon fighting; draw two weapons at once.',
    },
    {
        name: 'Dungeon Delver',
        description: 'Gain advantage on Perception and Investigation checks related to doors and traps.',
    },
    {
        name: 'Durable',
        description: 'Increase CON by 1; when rolling hit dice to recover hit points, the minimum number is twice your CON modifier.',
    },
    {
        name: 'Elemental Adept',
        description: 'Spells of chosen damage type ignore resistance; roll of 1 on a damage die counts as a 2.',
        prerequisites: 'Spellcasting or Pact Magic feature',
    },
    {
        name: 'Grappler',
        description: 'Can hold your own in close-quarters grappling.',
        prerequisites: 'Strength 13 or higher',
    },
    {
        name: 'Great Weapon Master',
        description: 'On critical hit or killing blow with heavy weapon, make a bonus attack. Can also take a -5 to attack to add +10 to damage.',
    },
    {
        name: 'Healer',
        description: 'Stabilize the dying and use a healer\'s kit to restore hit points.',
    },
    {
        name: 'Heavily Armored',
        description: 'Proficiency with heavy armor and increase STR by 1.',
        prerequisites: 'Proficiency with medium armor',
    },
    {
        name: 'Heavy Armor Master',
        description: 'Increase STR by 1. While wearing heavy armor, reduce bludgeoning, piercing, and slashing damage by 3.',
        prerequisites: 'Proficiency with heavy armor',
    },
    {
        name: 'Inspiring Leader',
        description: 'Spend 10 minutes inspiring companions, giving up to 6 creatures temporary hit points equal to your level + CHA mod.',
        prerequisites: 'Charisma 13 or higher',
    },
    {
        name: 'Keen Mind',
        description: '+1 INT; track time, direction, and detail with uncanny precision.',
    },
    {
        name: 'Linguist',
        description: '+1 INT; learn 3 extra languages; can create ciphers.',
    },
    {
        name: 'Lucky',
        description: '3 luck points per long rest  to reroll attack rolls, ability checks, or saving throws.',
    },
    {
        name: 'Mage Slayer',
        description: 'You have practiced techniques useful in melee combat against spellcasters.',
    },
    {
        name: 'Magic Initiate',
        description: 'Learn 2 cantrips and 1 1st-level spell from any class\'s list.',
    },
    {
        name: 'Martial Adept',
        description: 'Gain 2 maneuvers and a superiority die.',
    },
    {
        name: 'Medium Armor Master',
        description: 'Medium armor doesn\'t impose disadvantage on Stealth checks; AC can include up to +3 Dexterity.',
        prerequisites: 'Proficiency with medium armor',
    },
    {
        name: 'Mobile',
        description: 'Speed increases by 10 ft; Dash ignores difficult terrain; avoid opportunity attacks from creatures you attack.',
    },
    {
        name: 'Moderately Armored',
        description: 'Gain proficiency with medium armor and shields. Increase STR or DEX by 1.',
        prerequisites: 'Proficiency with light armor',
    },
    {
        name: 'Mounted Combatant',
        description: 'Gain adv. on attacks against unmounted creatures smaller than your mount.',
    },
    {
        name: 'Observant',
        description: '+1 INT or WIS; read lips and gain +5 to passive Perception and Investigation scores.',
    },
    {
        name: 'Polearm Master',
        description: 'Gain bonus action attack with the butt of the weapon; opportunity attack when creatures enter your reach.',
    },
    {
        name: 'Resilient',
        description: 'Choose one ability score. Increase it by 1 and gain proficiency in saving throws using that ability.',
    },
    {
        name: 'Ritual Caster',
        description: 'You have learned a number of spells that you can cast as rituals.',
        prerequisites: 'Intelligence or Wisdom 13 or higher',
    },
    {
        name: 'Savage Attacker',
        description: 'Once per turn, a weapon\'s damage dice and use either total.',
    },
    {
        name: 'Sentinel',
        description: 'Opportunity attacks stop movement and can trigger on Disengage.',
    },
    {
        name: 'Sharpshooter',
        description: 'Ignore long range and three-quarters cover penalties. Take -5 to attack for +10 to damage.',
    },
    {
        name: 'Shield Master',
        description: 'Gain a bonus action shove and add shield AC to Dex saves.',
    },
    {
        name: 'Skilled',
        description: 'Gain proficiency in any combination of three skills or tools of your choice.',
    },
    {
        name: 'Skulker',
        description: 'Expert at slinking through shadows; can try to hide when only lightly obscured;missing a ranged attack while hidden doesn\'t reveal your position.',
        prerequisites: 'Dexterity 13 or higher',
    },
    {
        name: 'Spell Sniper',
        description: 'Double the range of attack roll spells; ignore half and three-quarters cover.',
        prerequisites: 'Spellcasting or Pact Magic feature',
    },
    {
        name: 'Tavern Brawler',
        description: 'Gain +1 STR or CON, proficiency with improvised weapons; grapple as a bonus action.',
    },
    {
        name: 'Tough',
        description: 'Hit point maximum increases by an amount equal to twice your level, and increases by 2 every time you gain a level.',
    },
    {
        name: 'War Caster',
        description: 'Gain advantage on concentration saves; cast spells as opportunity attacks; perform somatic components with weapons in hand.',
        prerequisites: 'Spellcasting or Pact Magic feature',
    },
    {
        name: 'Weapon Master',
        description: 'Gain +1 STR or DEX and proficiency with four weapons of your choice.',
    },
];

export function GetFeatByName(name: string): Feat | undefined {
    return Feats.find(feat => feat.name === name);
}
