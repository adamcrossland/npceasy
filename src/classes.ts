// D&D 5e Class System

export enum ClassType {
    Barbarian = 'Barbarian',
    Bard = 'Bard',
    Cleric = 'Cleric',
    Druid = 'Druid',
    Fighter = 'Fighter',
    Monk = 'Monk',
    Paladin = 'Paladin',
    Ranger = 'Ranger',
    Rogue = 'Rogue',
    Sorcerer = 'Sorcerer',
    Warlock = 'Warlock',
    Wizard = 'Wizard'
}

export interface ClassFeature {
    name: string;
    level: number;
    description: string;
}

export interface Subclass {
    name: string;
    source: string;
    features: ClassFeature[];
    description: string;
}

export class CharClass {
    classType: ClassType;
    hitDice: number;
    proficiencies: {
        armor: string[];
        weapons: string[];
        tools: string[];
        savingThrows: string[];
        skills: string[];
    };
    features: ClassFeature[];
    subclasses: Subclass[];

    constructor(
        classType: ClassType,
        hitDice: number,
        proficiencies: {
            armor: string[];
            weapons: string[];
            tools: string[];
            savingThrows: string[];
            skills: string[];
        }
    ) {
        this.classType = classType;
        this.hitDice = hitDice;
        this.proficiencies = proficiencies;
        this.features = [];
        this.subclasses = [];
    }

    addFeature(feature: ClassFeature): void {
        this.features.push(feature);
    }

    addSubclass(subclass: Subclass): void {
        this.subclasses.push(subclass);
    }

    getFeaturesByLevel(level: number): ClassFeature[] {
        return this.features.filter(f => f.level <= level);
    }
}

// Barbarian
export const Barbarian = new CharClass(ClassType.Barbarian, 12, {
    armor: ['Light armor', 'Medium armor', 'Shields'],
    weapons: ['Simple weapons', 'Martial weapons'],
    tools: [],
    savingThrows: ['Strength', 'Constitution'],
    skills: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival']
});

Barbarian.addFeature({ name: 'Rage', level: 1, description: 'Enter a rage for bonus damage and resistance' });
Barbarian.addFeature({ name: 'Unarmored Defense', level: 1, description: 'AC equals 10 + DEX + CON' });
Barbarian.addFeature({ name: 'Reckless Attack', level: 2, description: 'Attack with advantage; attackers have advantage against you' });
Barbarian.addFeature({ name: 'Danger Sense', level: 2, description: 'Use reaction to halve damage from seen effect' });
Barbarian.addFeature({ name: 'Extra Attack', level: 5, description: 'Attack twice when taking Attack action' });
Barbarian.addFeature({ name: 'Primal Champion', level: 20, description: 'Rage damage increases by 4' });

Barbarian.addSubclass({
    name: 'Path of the Berserker',
    source: 'PHB',
    description: 'Channel primal fury for devastating melee attacks',
    features: [
        { name: 'Frenzy', level: 3, description: 'Make bonus melee attack on each attack turn during rage' },
        { name: 'Mindless Rage', level: 6, description: 'Immunity to charm and fear while raging' }
    ]
});

Barbarian.addSubclass({
    name: 'Path of the Totem Warrior',
    source: 'PHB',
    description: 'Bond with spirit animals for various abilities',
    features: [
        { name: 'Totem Spirit', level: 3, description: 'Choose a totem animal for bonuses' },
        { name: 'Aspect of the Beast', level: 6, description: 'Gain physical feature of totem' }
    ]
});

Barbarian.addSubclass({
    name: 'Path of the Ancestral Guardian',
    source: 'XanatharGuide',
    description: 'Call upon ancestral spirits for protection',
    features: [
        { name: 'Ancestral Protectors', level: 3, description: 'When raging, attacking creature is restrained' },
        { name: 'Spirit Shield', level: 6, description: 'Use reaction to reduce damage taken' }
    ]
});

// Bard
export const Bard = new CharClass(ClassType.Bard, 8, {
    armor: ['Light armor'],
    weapons: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    tools: ['Musical instruments'],
    savingThrows: ['Charisma', 'Dexterity'],
    skills: ['Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth']
});

Bard.addFeature({ name: 'Bardic Inspiration', level: 1, description: 'Grant allies inspiration dice for bonus rolls' });
Bard.addFeature({ name: 'Spellcasting', level: 1, description: 'Cast bard spells using Charisma' });
Bard.addFeature({ name: 'Jack of All Trades', level: 2, description: 'Add half proficiency bonus to ability checks' });
Bard.addFeature({ name: 'Song of Rest', level: 2, description: 'Allies regain extra HP during short rests' });
Bard.addFeature({ name: 'Extra Attack', level: 6, description: 'Attack twice when taking Attack action' });
Bard.addFeature({ name: 'Magical Secrets', level: 20, description: 'Learn any spell and gain ability slots' });

Bard.addSubclass({
    name: 'College of Glamour',
    source: 'XanatharGuide',
    description: 'Master charm and illusions through performance',
    features: [
        { name: 'Mantle of Inspiration', level: 3, description: 'Bardic inspiration grants temp HP' },
        { name: 'Enthralling Performance', level: 3, description: 'Enemies have disadvantage attacking you' }
    ]
});

Bard.addSubclass({
    name: 'College of Swords',
    source: 'XanatharGuide',
    description: 'Blend combat skills with magical performance',
    features: [
        { name: 'Bonus Proficiencies', level: 3, description: 'Gain proficiency with medium armor and scimitars' },
        { name: 'Fighting Style', level: 3, description: 'Choose a fighting style' }
    ]
});

// Cleric
export const Cleric = new CharClass(ClassType.Cleric, 8, {
    armor: ['Light armor', 'Medium armor', 'Heavy armor', 'Shields'],
    weapons: ['Simple weapons'],
    tools: [],
    savingThrows: ['Wisdom', 'Charisma'],
    skills: ['Insight', 'Medicine', 'Persuasion', 'Religion']
});

Cleric.addFeature({ name: 'Spellcasting', level: 1, description: 'Cast cleric spells using Wisdom' });
Cleric.addFeature({ name: 'Channel Divinity', level: 1, description: 'Use divine power for special abilities' });
Cleric.addFeature({ name: 'Destroy Undead', level: 5, description: 'Turn undead based on CR' });
Cleric.addFeature({ name: 'Divine Intervention', level: 10, description: 'Divine power intervenes on your behalf' });

Cleric.addSubclass({
    name: 'Life Domain',
    source: 'PHB',
    description: 'Harness magic of healing and life',
    features: [
        { name: 'Bonus Proficiencies', level: 1, description: 'Proficiency with heavy armor' },
        { name: 'Preserve Life', level: 2, description: 'Heal multiple creatures at once' }
    ]
});

Cleric.addSubclass({
    name: 'War Domain',
    source: 'PHB',
    description: 'Master combat through divine blessing',
    features: [
        { name: 'Bonus Proficiencies', level: 1, description: 'Proficiency with martial weapons' },
        { name: 'Guided Strike', level: 2, description: 'Add d8 to attack roll' }
    ]
});

// Druid
export const Druid = new CharClass(ClassType.Druid, 8, {
    armor: ['Light armor', 'Medium armor', 'Shields'],
    weapons: ['Clubs', 'Daggers', 'Darts', 'Javelins', 'Maces', 'Quarterstaffs', 'Scimitars', 'Sickles', 'Slings', 'Spears'],
    tools: ['Herbalism kit'],
    savingThrows: ['Intelligence', 'Wisdom'],
    skills: ['Animal Handling', 'Arcana', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival']
});

Druid.addFeature({ name: 'Spellcasting', level: 1, description: 'Cast druid spells using Wisdom' });
Druid.addFeature({ name: 'Wild Shape', level: 2, description: 'Transform into animal form' });
Druid.addFeature({ name: 'Timeless Body', level: 18, description: 'Aging slows dramatically' });
Druid.addFeature({ name: 'Beast Spells', level: 18, description: 'Cast spells while in Wild Shape form' });

Druid.addSubclass({
    name: 'Circle of the Moon',
    source: 'PHB',
    description: 'Focus on Wild Shape combat abilities',
    features: [
        { name: 'Combat Wild Shape', level: 2, description: 'Use bonus action to enter Wild Shape' },
        { name: 'Primal Strike', level: 6, description: 'Wild Shape attacks count as magical' }
    ]
});

Druid.addSubclass({
    name: 'Circle of the Land',
    source: 'PHB',
    description: 'Draw power from natural landscapes',
    features: [
        { name: 'Bonus Cantrips', level: 2, description: 'Learn additional cantrips' },
        { name: 'Natural Recovery', level: 2, description: 'Recover spell slots through meditation' }
    ]
});

// Fighter
export const Fighter = new CharClass(ClassType.Fighter, 10, {
    armor: ['All armor', 'Shields'],
    weapons: ['Simple weapons', 'Martial weapons'],
    tools: [],
    savingThrows: ['Strength', 'Constitution'],
    skills: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival']
});

Fighter.addFeature({ name: 'Fighting Style', level: 1, description: 'Choose a specialized fighting style' });
Fighter.addFeature({ name: 'Second Wind', level: 1, description: 'Bonus action to heal yourself' });
Fighter.addFeature({ name: 'Action Surge', level: 1, description: 'Take additional action on your turn' });
Fighter.addFeature({ name: 'Extra Attack', level: 5, description: 'Attack twice when taking Attack action' });
Fighter.addFeature({ name: 'Indomitable', level: 7, description: 'Reroll a failed saving throw' });

Fighter.addSubclass({
    name: 'Champion',
    source: 'PHB',
    description: 'Master of martial technique and precision',
    features: [
        { name: 'Improved Critical', level: 3, description: 'Critical hits on 19-20' },
        { name: 'Remarkable Athlete', level: 7, description: 'Add proficiency bonus to strength checks' }
    ]
});

Fighter.addSubclass({
    name: 'Battle Master',
    source: 'PHB',
    description: 'Master tactical combat maneuvers',
    features: [
        { name: 'Combat Superiority', level: 3, description: 'Learn superior combat maneuvers' },
        { name: 'Maneuver Dice', level: 3, description: 'Use dice to fuel maneuvers' }
    ]
});

Fighter.addSubclass({
    name: 'Eldritch Knight',
    source: 'PHB',
    description: 'Blend martial prowess with arcane magic',
    features: [
        { name: 'Spellcasting', level: 3, description: 'Cast wizard spells using Intelligence' },
        { name: 'Weapon Bond', level: 3, description: 'Bond with a weapon to summon it' }
    ]
});

// Monk
export const Monk = new CharClass(ClassType.Monk, 8, {
    armor: [],
    weapons: ['Simple weapons', 'Shortswords'],
    tools: ['Artisans tools or musical instrument'],
    savingThrows: ['Strength', 'Dexterity'],
    skills: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth']
});

Monk.addFeature({ name: 'Martial Arts', level: 1, description: 'Unarmed strike scales with level' });
Monk.addFeature({ name: 'Ki', level: 1, description: 'Spend ki points for special abilities' });
Monk.addFeature({ name: 'Unarmored Defense', level: 1, description: 'AC equals 10 + DEX + WIS' });
Monk.addFeature({ name: 'Evasion', level: 7, description: 'Take no damage from half-damage save spells' });
Monk.addFeature({ name: 'Timeless Body', level: 15, description: 'Aging slows dramatically' });

Monk.addSubclass({
    name: 'Way of the Four Elements',
    source: 'PHB',
    description: 'Master bending of elemental forces',
    features: [
        { name: 'Discipline of the Elements', level: 3, description: 'Learn elemental spells' },
        { name: 'Elemental Attunement', level: 6, description: 'Manipulate elements around you' }
    ]
});

Monk.addSubclass({
    name: 'Way of Shadow',
    source: 'PHB',
    description: 'Master stealth and assassination',
    features: [
        { name: 'Shadow Arts', level: 3, description: 'Bonus action to cast shadow spells' },
        { name: 'Shadow Step', level: 6, description: 'Teleport between shadows' }
    ]
});

// Paladin
export const Paladin = new CharClass(ClassType.Paladin, 10, {
    armor: ['All armor', 'Shields'],
    weapons: ['Simple weapons', 'Martial weapons'],
    tools: [],
    savingThrows: ['Wisdom', 'Charisma'],
    skills: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion']
});

Paladin.addFeature({ name: 'Divine Sense', level: 1, description: 'Sense celestials, fiends, and undead nearby' });
Paladin.addFeature({ name: 'Lay On Hands', level: 1, description: 'Heal allies or harm undead' });
Paladin.addFeature({ name: 'Spellcasting', level: 1, description: 'Cast paladin spells using Charisma' });
Paladin.addFeature({ name: 'Divine Smite', level: 1, description: 'Channel spell slots into melee damage' });
Paladin.addFeature({ name: 'Extra Attack', level: 5, description: 'Attack twice when taking Attack action' });

Paladin.addSubclass({
    name: 'Devotion',
    source: 'PHB',
    description: 'Holy warrior devoted to righteousness',
    features: [
        { name: 'Sacred Weapon', level: 3, description: 'Add CHA to attack roll' },
        { name: 'Channel Divinity', level: 3, description: 'Sacred Weapon or turn undead' }
    ]
});

Paladin.addSubclass({
    name: 'Vengeance',
    source: 'PHB',
    description: 'Avenger against those who threaten innocence',
    features: [
        { name: 'Avenging Angel', level: 6, description: 'Gain wings when using Divine Wrath' },
        { name: 'Vow of Enmity', level: 3, description: 'Advantage on attacks against chosen foe' }
    ]
});

// Ranger
export const Ranger = new CharClass(ClassType.Ranger, 10, {
    armor: ['Light armor', 'Medium armor', 'Shields'],
    weapons: ['Simple weapons', 'Martial weapons'],
    tools: [],
    savingThrows: ['Strength', 'Dexterity'],
    skills: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival']
});

Ranger.addFeature({ name: 'Favored Enemy', level: 1, description: 'Choose enemy type for bonus damage' });
Ranger.addFeature({ name: 'Natural Explorer', level: 1, description: 'Gain bonuses in chosen terrain' });
Ranger.addFeature({ name: 'Spellcasting', level: 1, description: 'Cast ranger spells using Wisdom' });
Ranger.addFeature({ name: 'Extra Attack', level: 5, description: 'Attack twice when taking Attack action' });
Ranger.addFeature({ name: 'Feral Senses', level: 18, description: 'Sense creatures even if invisible' });

Ranger.addSubclass({
    name: 'Hunter',
    source: 'PHB',
    description: 'Master of single and multiple enemy combat',
    features: [
        { name: 'Hunters Prey', level: 3, description: 'Bonus action to mark and track prey' },
        { name: 'Multiattack Defense', level: 11, description: 'AC bonus when attacked by multiple foes' }
    ]
});

Ranger.addSubclass({
    name: 'Beast Master',
    source: 'PHB',
    description: 'Bond with animal companion in combat',
    features: [
        { name: 'Ranger\'s Companion', level: 3, description: 'Summon animal companion' },
        { name: 'Coordinated Attack', level: 5, description: 'Attack bonus when companion attacks' }
    ]
});

// Rogue
export const Rogue = new CharClass(ClassType.Rogue, 8, {
    armor: ['Light armor'],
    weapons: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    tools: ['Thieves tools'],
    savingThrows: ['Dexterity', 'Intelligence'],
    skills: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth']
});

Rogue.addFeature({ name: 'Expertise', level: 1, description: 'Double proficiency bonus on chosen skills' });
Rogue.addFeature({ name: 'Sneak Attack', level: 1, description: 'Deal extra damage when conditions are met' });
Rogue.addFeature({ name: 'Cunning Action', level: 2, description: 'Bonus action to disengage, dash, or hide' });
Rogue.addFeature({ name: 'Evasion', level: 5, description: 'Take no damage from half-damage save spells' });
Rogue.addFeature({ name: 'Stroke of Luck', level: 20, description: 'Turn a miss into a hit once per day' });

Rogue.addSubclass({
    name: 'Thief',
    source: 'PHB',
    description: 'Master of theft and stealth',
    features: [
        { name: 'Fast Hands', level: 3, description: 'Use Cunning Action for object interaction' },
        { name: 'Second-Story Work', level: 3, description: 'Climb without provoking opportunity attacks' }
    ]
});

Rogue.addSubclass({
    name: 'Assassin',
    source: 'PHB',
    description: 'Perfect art of assassination and espionage',
    features: [
        { name: 'Assassinate', level: 3, description: 'Advantage on attacks against surprised creatures' },
        { name: 'Infiltration Expertise', level: 9, description: 'Forge documents and create false identity' }
    ]
});

Rogue.addSubclass({
    name: 'Arcane Trickster',
    source: 'PHB',
    description: 'Enhance roguish abilities with arcane magic',
    features: [
        { name: 'Spellcasting', level: 3, description: 'Cast wizard spells using Intelligence' },
        { name: 'Mage Hand Legerdemain', level: 3, description: 'Enhanced mage hand for trickery' }
    ]
});

// Sorcerer
export const Sorcerer = new CharClass(ClassType.Sorcerer, 6, {
    armor: [],
    weapons: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    tools: [],
    savingThrows: ['Charisma', 'Constitution'],
    skills: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion']
});

Sorcerer.addFeature({ name: 'Spellcasting', level: 1, description: 'Cast sorcerer spells using Charisma' });
Sorcerer.addFeature({ name: 'Sorcerous Origin', level: 1, description: 'Choose magical origin for powers' });
Sorcerer.addFeature({ name: 'Sorcery Points', level: 1, description: 'Use points to fuel magical abilities' });
Sorcerer.addFeature({ name: 'Metamagic', level: 3, description: 'Modify spells with sorcery points' });
Sorcerer.addFeature({ name: 'Sorcerous Resilience', level: 20, description: 'Regain sorcery points through metamagic' });

Sorcerer.addSubclass({
    name: 'Draconic Bloodline',
    source: 'PHB',
    description: 'Channel power of ancient dragons',
    features: [
        { name: 'Dragon Ancestor', level: 1, description: 'Choose dragon type for bonuses' },
        { name: 'Draconic Resilience', level: 1, description: 'AC equals 13 + DEX when not wearing armor' }
    ]
});

Sorcerer.addSubclass({
    name: 'Wild Magic',
    source: 'PHB',
    description: 'Unpredictable and chaotic magical power',
    features: [
        { name: 'Wild Magic Surge', level: 1, description: 'Random effect when casting spell' },
        { name: 'Tidal Wave of Chaos', level: 6, description: 'Trigger wild magic surge' }
    ]
});

// Warlock
export const Warlock = new CharClass(ClassType.Warlock, 8, {
    armor: ['Light armor'],
    weapons: ['Simple weapons'],
    tools: [],
    savingThrows: ['Charisma', 'Wisdom'],
    skills: ['Arcana', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Religion']
});

Warlock.addFeature({ name: 'Otherworldly Patron', level: 1, description: 'Enter pact with powerful entity' });
Warlock.addFeature({ name: 'Pact Magic', level: 1, description: 'Cast warlock spells using Charisma' });
Warlock.addFeature({ name: 'Eldritch Invocations', level: 1, description: 'Learn powerful mystic abilities' });
Warlock.addFeature({ name: 'Pact Boon', level: 3, description: 'Choose gift from patron' });
Warlock.addFeature({ name: 'Mystic Arcanum', level: 11, description: 'Cast higher-level spells once daily' });

Warlock.addSubclass({
    name: 'The Fiend',
    source: 'PHB',
    description: 'Pact with archdevil or demon lord',
    features: [
        { name: 'Expanded Spell List', level: 1, description: 'Learn additional spells' },
        { name: 'Dark One\'s Blessing', level: 1, description: 'Gain temp HP when killing creatures' }
    ]
});

Warlock.addSubclass({
    name: 'The Great Old One',
    source: 'PHB',
    description: 'Pact with cosmic entity beyond mortal understanding',
    features: [
        { name: 'Expanded Spell List', level: 1, description: 'Learn additional spells' },
        { name: 'Awakened Mind', level: 1, description: 'Communicate telepathically with creatures' }
    ]
});

// Wizard
export const Wizard = new CharClass(ClassType.Wizard, 6, {
    armor: [],
    weapons: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    tools: [],
    savingThrows: ['Intelligence', 'Wisdom'],
    skills: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion']
});

Wizard.addFeature({ name: 'Spellcasting', level: 1, description: 'Cast wizard spells using Intelligence' });
Wizard.addFeature({ name: 'Spellbook', level: 1, description: 'Record spells in personal spellbook' });
Wizard.addFeature({ name: 'Ritual Casting', level: 1, description: 'Cast spells as rituals if known' });
Wizard.addFeature({ name: 'Arcane Tradition', level: 2, description: 'Choose specialist tradition' });
Wizard.addFeature({ name: 'Spell Mastery', level: 18, description: 'Cast known spell without using spell slot' });

Wizard.addSubclass({
    name: 'Abjuration',
    source: 'PHB',
    description: 'Master of protective magical wards and defenses',
    features: [
        { name: 'Abjuration Savant', level: 2, description: 'Gold and time to copy abjuration spells into your spellbook are halved.' },
        { name: 'Arcane Ward', level: 2, description: 'Casting an abjuration spell creates a magical ward that can absorb damage.' },
        { name: 'Projected Ward', level: 6, description: 'Use your reaction to make your Arcane Ward absorb damage for a nearby ally.' },
        { name: 'Improved Abjuration', level: 10, description: 'Add your proficiency bonus to ability checks made as part of casting abjuration spells.' },
        { name: 'Spell Resistance', level: 14, description: 'You have advantage on saving throws against spells and resistance to spell damage.' }
    ]
});

Wizard.addSubclass({
    name: 'Conjuration',
    source: 'PHB',
    description: 'Master of summoning creatures and objects through space',
    features: [
        { name: 'Conjuration Savant', level: 2, description: 'Gold and time to copy conjuration spells into your spellbook are halved.' },
        { name: 'Minor Conjuration', level: 2, description: 'Conjure a small nonmagical object in your hand or on the ground nearby.' },
        { name: 'Benign Transposition', level: 6, description: 'Teleport up to 30 feet or swap places with a willing creature you can see.' },
        { name: 'Focused Conjuration', level: 10, description: 'Your concentration on conjuration spells cannot be broken by taking damage.' },
        { name: 'Durable Summons', level: 14, description: 'Any creature you summon or create with a conjuration spell gains 30 temporary hit points.' }
    ]
});

Wizard.addSubclass({
    name: 'Divination',
    source: 'PHB',
    description: 'Master of foresight, omens, and hidden knowledge',
    features: [
        { name: 'Divination Savant', level: 2, description: 'Gold and time to copy divination spells into your spellbook are halved.' },
        { name: 'Portent', level: 2, description: 'After a long rest, roll d20s and replace attack rolls, saves, or checks with these foretelling rolls.' },
        { name: 'Expert Divination', level: 6, description: 'Casting divination spells of 2nd level or higher restores a lower-level spell slot.' },
        { name: 'The Third Eye', level: 10, description: 'Use an action to gain darkvision, ethereal sight, greater reading, or see invisibility until rest.' },
        { name: 'Greater Portent', level: 14, description: 'You roll three Portent dice instead of two after finishing a long rest.' }
    ]
});

Wizard.addSubclass({
    name: 'Enchantment',
    source: 'PHB',
    description: 'Master of influencing minds and bending wills',
    features: [
        { name: 'Enchantment Savant', level: 2, description: 'Gold and time to copy enchantment spells into your spellbook are halved.' },
        { name: 'Hypnotic Gaze', level: 2, description: 'Charm and incapacitate a creature near you with a mesmerising gaze.' },
        { name: 'Instinctive Charm', level: 6, description: 'Redirect an attack toward another target as a reaction.' },
        { name: 'Split Enchantment', level: 10, description: 'Single-target enchantment spells can target a second creature.' },
        { name: 'Alter Memories', level: 14, description: 'A charmed creature can lose memory of your influence or remember your casting as harmless.' }
    ]
});

Wizard.addSubclass({
    name: 'Evocation',
    source: 'PHB',
    description: 'Master of elemental and destructive magical force',
    features: [
        { name: 'Evocation Savant', level: 2, description: 'Gold and time to copy evocation spells into your spellbook are halved.' },
        { name: 'Sculpt Spells', level: 2, description: 'Protect allies from your area evocation spells by granting automatic save success and no damage.' },
        { name: 'Potent Cantrip', level: 6, description: 'Creatures take half damage from your cantrips even on a successful saving throw.' },
        { name: 'Empowered Evocation', level: 10, description: 'Add your Intelligence modifier to one damage roll of any wizard evocation spell.' },
        { name: 'Overchannel', level: 14, description: 'Deal maximum damage with lower-level wizard spells, at increasing personal cost when repeated.' }
    ]
});

Wizard.addSubclass({
    name: 'Illusion',
    source: 'PHB',
    description: 'Master of deception, phantasms, and altered perception',
    features: [
        { name: 'Illusion Savant', level: 2, description: 'Gold and time to copy illusion spells into your spellbook are halved.' },
        { name: 'Improved Minor Illusion', level: 2, description: 'Learn minor illusion if needed, and create both image and sound with one casting.' },
        { name: 'Malleable Illusions', level: 6, description: 'Change ongoing illusion spells with a duration of 1 minute or longer.' },
        { name: 'Illusory Self', level: 10, description: 'Use a reaction to make an illusory duplicate take an attack that would hit you.' },
        { name: 'Illusory Reality', level: 14, description: 'Make one nonmagical inanimate part of an illusion temporarily real.' }
    ]
});

Wizard.addSubclass({
    name: 'Necromancy',
    source: 'PHB',
    description: 'Master of life, death, and undeath',
    features: [
        { name: 'Necromancy Savant', level: 2, description: 'Gold and time to copy necromancy spells into your spellbook are halved.' },
        { name: 'Grim Harvest', level: 2, description: 'When you kill with a spell, regain hit points based on spell level.' },
        { name: 'Undead Thralls', level: 6, description: 'Animate dead adds an extra corpse/boned pile and your undead become tougher and hit harder.' },
        { name: 'Inured to Undeath', level: 10, description: 'Gain resistance to necrotic damage and your hit point maximum cannot be reduced.' },
        { name: 'Command Undead', level: 14, description: 'Use magic to seize control of an undead creature.' }
    ]
});

Wizard.addSubclass({
    name: 'Transmutation',
    source: 'PHB',
    description: 'Master of transformation and mutable matter',
    features: [
        { name: 'Transmutation Savant', level: 2, description: 'Gold and time to copy transmutation spells into your spellbook are halved.' },
        { name: 'Minor Alchemy', level: 2, description: 'Temporarily transform one nonmagical substance into another.' },
        { name: 'Transmuter\'s Stone', level: 6, description: 'Create a stone that grants a useful benefit while carried.' },
        { name: 'Shapechanger', level: 10, description: 'Cast polymorph on yourself without expending a spell slot once per rest.' },
        { name: 'Master Transmuter', level: 14, description: 'Consume your transmuter\'s stone to produce a powerful transmutation effect.' }
    ]
});

// Export all classes
export const AllClasses: CharClass[] = [
    Barbarian,
    Bard,
    Cleric,
    Druid,
    Fighter,
    Monk,
    Paladin,
    Ranger,
    Rogue,
    Sorcerer,
    Warlock,
    Wizard
];

export function GetClassByType(classType: ClassType): CharClass | undefined {
    return AllClasses.find(c => c.classType === classType);
}
