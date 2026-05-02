export interface RaceAbilityScores {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
}

export interface RaceTraits {
    name: string;
    description: string;
}

export class Race {
    name: string;
    description: string;
    abilityScoreIncreases: RaceAbilityScores;
    age: string;
    alignment: string;
    size: string;
    speed: number;
    languages: string[];
    traits: RaceTraits[];
    subraces?: Race[];

    constructor(
        name: string,
        description: string,
        abilityScoreIncreases: RaceAbilityScores,
        age: string,
        alignment: string,
        size: string,
        speed: number,
        languages: string[],
        traits: RaceTraits[],
        subraces?: Race[]
    ) {
        this.name = name;
        this.description = description;
        this.abilityScoreIncreases = abilityScoreIncreases;
        this.age = age;
        this.alignment = alignment;
        this.size = size;
        this.speed = speed;
        this.languages = languages;
        this.traits = traits;
        this.subraces = subraces;
    }
}

export const Races: Race[] = [
    new Race(
        'Dwarf',
        'Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal.',
        { constitution: 2, strength: 0 },
        'Dwarves mature at around 50 years and live about 350 years.',
        'Most dwarves are lawful and good.',
        'Medium',
        25,
        ['Common', 'Dwarvish'],
        [
            { name: 'Darkvision', description: 'Dwarves can see in dim light within 60 feet as if it were bright light.' },
            { name: 'Dwarven Resilience', description: 'Dwarves have advantage on saving throws against poison, and resistance to poison damage.' },
            { name: 'Stonecunning', description: 'Whenever you make an Intelligence (History) check related to stonework, you are considered proficient.' }
        ]
    ),
    new Race(
        'Elf',
        'Elves are a magical people of otherworldly grace, living in the world but not entirely part of it.',
        { dexterity: 2 },
        'Elves mature around 100 years and can live over 700 years.',
        'Elves love freedom, variety, and self-expression.',
        'Medium',
        30,
        ['Common', 'Elvish'],
        [
            { name: 'Darkvision', description: 'Elves can see in dim light within 60 feet as if it were bright light.' },
            { name: 'Keen Senses', description: 'Elves have proficiency in the Perception skill.' },
            { name: 'Fey Ancestry', description: 'Elves have advantage on saving throws against being charmed and magic cannot put them to sleep.' },
            { name: 'Trance', description: 'Elves don\'t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day.' }
        ]
    ),
    new Race(
        'Halfling',
        'The diminutive halflings have proven their mettle on many occasions and often demonstrate a courage that rivals that of races many times their size.',
        { dexterity: 2 },
        'A halfling reaches adulthood at the age of 20 and generally lives into their mid-150s.',
        'Most halflings are lawful good.',
        'Small',
        25,
        ['Common', 'Halfling'],
        [
            { name: 'Lucky', description: 'When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die.' },
            { name: 'Brave', description: 'Halflings have advantage on saving throws against being frightened.' },
            { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is of a size larger than yours.' }
        ]
    ),
    new Race(
        'Human',
        'Humans are the most adaptable and ambitious people among the common races. Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds.',
        { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
        'Humans reach adulthood in their late teens and live less than a century.',
        'Humans tend toward chaos and are inclined toward good.',
        'Medium',
        30,
        ['Common'],
        [
            { name: 'Extra Language', description: 'Humans speak an additional language of their choice.' },
            { name: 'Versatility', description: 'Humans gain an additional feat at 1st level.' }
        ]
    ),
    new Race(
        'Dragonborn',
        'Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension.',
        { strength: 2, charisma: 1 },
        'Young dragonborn grow quickly. They walk hours after hatching, attain the size and development of a 10-year-old human child by the age of 3, and reach adulthood by 15.',
        'Dragonborn tend to extremes, making a conscious choice for one side or the other.',
        'Medium',
        30,
        ['Common', 'Draconic'],
        [
            { name: 'Draconic Ancestry', description: 'You have draconic heritage. Choose one type of dragon as your ancestry.' },
            { name: 'Breath Weapon', description: 'You can use an action to exhale destructive energy according to your draconic ancestry.' },
            { name: 'Damage Resistance', description: 'You have resistance to the damage type associated with your draconic ancestry.' }
        ]
    ),
    new Race(
        'Gnome',
        'A gnome\'s energy and enthusiasm for living shines through every inch of his or her body. Gnomes average slightly over 3 feet tall and weigh 40 to 45 pounds.',
        { intelligence: 2 },
        'Gnomes mature at around 40 years old and live about 350 to 500 years.',
        'Gnomes are generally good.',
        'Small',
        25,
        ['Common', 'Gnomish'],
        [
            { name: 'Darkvision', description: 'Gnomes can see in dim light within 60 feet as if it were bright light.' },
            { name: 'Gnome Cunning', description: 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.' }
        ]
    ),
    new Race(
        'Half-Elf',
        'Walking in two worlds but truly belonging to neither, half-elves combine what some say are the best qualities of their elf and human parents.',
        { charisma: 2, dexterity: 1, constitution: 1 },
        'Half-elves mature at the same rate humans do and reach adulthood around the age of 20. They live much longer than humans, however, often exceeding 180 years.',
        'Half-elves share the chaotic inclinations of their elven heritage.',
        'Medium',
        30,
        ['Common', 'Elvish'],
        [
            { name: 'Darkvision', description: 'Half-elves can see in dim light within 60 feet as if it were bright light.' },
            { name: 'Fey Ancestry', description: 'Half-elves have advantage on saving throws against being charmed, and magic cannot put them to sleep.' },
            { name: 'Skill Versatility', description: 'Half-elves gain proficiency in two skills of their choice.' }
        ]
    ),
    new Race(
        'Half-Orc',
        'Half-orcs\' grayish pigmentation, sloping foreheads, jutting jaws, prominent teeth, and towering builds make their orcish heritage plain for all to see.',
        { strength: 2, constitution: 1, intelligence: -2 },
        'Half-orcs mature a little faster than humans, reaching adulthood around age 14. They age noticeably faster and rarely live longer than 75 years.',
        'Half-orcs inherit a tendency toward chaos from their orc parents and are not strongly inclined toward good.',
        'Medium',
        30,
        ['Common', 'Orc'],
        [
            { name: 'Darkvision', description: 'Half-orcs can see in dim light within 60 feet as if it were bright light.' },
            { name: 'Menacing', description: 'Half-orcs gain proficiency in the Intimidation skill.' },
            { name: 'Relentless Endurance', description: 'When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead.' }
        ]
    ),
    new Race(
        'Tiefling',
        'To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling.',
        { charisma: 2, intelligence: 1 },
        'Tieflings mature at the same rate as humans but live a few years longer.',
        'Tieflings might not have an innate tendency toward evil, but many of them end up there.',
        'Medium',
        30,
        ['Common', 'Infernal'],
        [
            { name: 'Darkvision', description: 'Tieflings can see in dim light within 60 feet as if it were bright light.' },
            { name: 'Hellish Resistance', description: 'Tieflings have resistance to fire damage.' },
            { name: 'Infernal Legacy', description: 'Tieflings know the Thaumaturgy cantrip and can cast Hellish Rebuke and Darkness spells.' }
        ]
    ),
    new Race(
        'Genasi',
        'The elemental planes touch the world at many points, and sometimes their influence produces a genasi: humans infused with the power of the elements.',
        { constitution: 2 },
        'Genasi mature at the same rate as humans.',
        'Genasi vary in alignment.',
        'Medium',
        30,
        ['Common', 'Primordial'],
        [
            { name: 'Elemental Resistance', description: 'Genasi have resistance to a damage type based on their elemental affinity.' },
            { name: 'Elemental Affinity', description: 'Genasi gain specific abilities based on their elemental type (air, earth, fire, or water).' }
        ]
    ),
    new Race(
        'Kenku',
        'Kenku are feathered humanoids, standing slightly shorter than humans but built more compactly. They possess intelligence but struggle to find their place in civilized society.',
        { dexterity: 2, wisdom: 1 },
        'Kenku have lifespans comparable to humans.',
        'Most kenku are chaotic.',
        'Medium',
        25,
        ['Common'],
        [
            { name: 'Expert Forgery', description: 'Kenku are proficient with artisan\'s tools and forgery kits.' },
            { name: 'Mimicry', description: 'Kenku can mimic any sounds they have heard, but cannot speak intelligibly.' },
            { name: 'Kenku Training', description: 'Kenku gain proficiency in two skills of their choice.' }
        ]
    ),
    new Race(
        'Tabaxi',
        'Tabaxi are feline humanoids standing around 6 feet tall on average, moving with a predator\'s grace and power.',
        { dexterity: 2, charisma: 1 },
        'Tabaxi have lifespans comparable to humans, reaching adulthood by their early teens.',
        'Most tabaxi are chaotic.',
        'Medium',
        30,
        ['Common'],
        [
            { name: 'Feline Agility', description: 'Tabaxi can move at twice their speed as a reaction when they haven\'t moved yet on their turn.' },
            { name: 'Claws', description: 'Tabaxi have claws that deal 1d4 slashing damage.' }
        ]
    )
];
