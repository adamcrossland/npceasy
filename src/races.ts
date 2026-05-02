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
    // ── Dwarf ────────────────────────────────────────────────────────────────
    new Race(
        'Dwarf',
        'Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal.',
        { constitution: 2 },
        'Dwarves mature at the same rate as humans, but they\'re considered young until they reach the age of 50. On average, they live about 350 years.',
        'Most dwarves are lawful, believing firmly in the benefits of a well-ordered society.',
        'Medium',
        25,
        ['Common', 'Dwarvish'],
        [
            { name: 'Darkvision', description: 'Accustomed to life underground, you can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
            { name: 'Dwarven Resilience', description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.' },
            { name: 'Dwarven Combat Training', description: 'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.' },
            { name: 'Tool Proficiency', description: 'You gain proficiency with the artisan\'s tools of your choice: smith\'s tools, brewer\'s supplies, or mason\'s tools.' },
            { name: 'Stonecunning', description: 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check.' },
        ],
        [
            new Race(
                'Hill Dwarf',
                'As a hill dwarf, you have keen senses, deep intuition, and remarkable resilience.',
                { wisdom: 1 },
                'Hill dwarves have the same lifespan as other dwarves.',
                'Most hill dwarves are lawful good.',
                'Medium', 25, ['Common', 'Dwarvish'],
                [{ name: 'Dwarven Toughness', description: 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.' }]
            ),
            new Race(
                'Mountain Dwarf',
                'As a mountain dwarf, you\'re strong and hardy, accustomed to a difficult life in rugged terrain.',
                { strength: 2 },
                'Mountain dwarves have the same lifespan as other dwarves.',
                'Most mountain dwarves are lawful good.',
                'Medium', 25, ['Common', 'Dwarvish'],
                [{ name: 'Dwarven Armor Training', description: 'You have proficiency with light and medium armor.' }]
            ),
        ]
    ),

    // ── Elf ──────────────────────────────────────────────────────────────────
    new Race(
        'Elf',
        'Elves are a magical people of otherworldly grace, living in the world but not entirely part of it.',
        { dexterity: 2 },
        'Although elves reach physical maturity at about the same age as humans, the elven understanding of adulthood goes beyond physical growth to encompass worldly experience. An elf typically claims adulthood around the age of 100 and can live to be 750 years old.',
        'Elves love freedom, variety, and self-expression, so they lean strongly toward the gentler aspects of chaos.',
        'Medium',
        30,
        ['Common', 'Elvish'],
        [
            { name: 'Darkvision', description: 'Accustomed to twilit forests and the night sky, you can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
            { name: 'Keen Senses', description: 'You have proficiency in the Perception skill.' },
            { name: 'Fey Ancestry', description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.' },
            { name: 'Trance', description: 'Elves don\'t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.' },
        ],
        [
            new Race(
                'High Elf',
                'As a high elf, you have a keen mind and a mastery of at least the basics of magic.',
                { intelligence: 1 },
                'High elves have the same lifespan as other elves.',
                'High elves tend toward chaotic good.',
                'Medium', 30, ['Common', 'Elvish'],
                [
                    { name: 'Elf Weapon Training', description: 'You have proficiency with the longsword, shortsword, shortbow, and longbow.' },
                    { name: 'Cantrip', description: 'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.' },
                    { name: 'Extra Language', description: 'You can speak, read, and write one extra language of your choice.' },
                ]
            ),
            new Race(
                'Wood Elf',
                'As a wood elf, you have keen senses and intuition, and your fleet feet carry you quickly and stealthily through your native forests.',
                { wisdom: 1 },
                'Wood elves have the same lifespan as other elves.',
                'Wood elves tend toward chaotic good.',
                'Medium', 35, ['Common', 'Elvish'],
                [
                    { name: 'Elf Weapon Training', description: 'You have proficiency with the longsword, shortsword, shortbow, and longbow.' },
                    { name: 'Fleet of Foot', description: 'Your base walking speed increases to 35 feet.' },
                    { name: 'Mask of the Wild', description: 'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.' },
                ]
            ),
            new Race(
                'Dark Elf (Drow)',
                'Descended from an earlier subrace of dark-skinned elves, the drow were banished from the surface world for following the goddess Lolth down the path to evil and corruption.',
                { charisma: 1 },
                'Drow have the same lifespan as other elves.',
                'Drow are usually chaotic evil.',
                'Medium', 30, ['Common', 'Elvish', 'Undercommon'],
                [
                    { name: 'Superior Darkvision', description: 'Your darkvision has a radius of 120 feet.' },
                    { name: 'Sunlight Sensitivity', description: 'You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.' },
                    { name: 'Drow Magic', description: 'You know the dancing lights cantrip. At 3rd level, you can cast faerie fire once per day. At 5th level, you can also cast darkness once per day. Charisma is your spellcasting ability for these spells.' },
                    { name: 'Drow Weapon Training', description: 'You have proficiency with rapiers, shortswords, and hand crossbows.' },
                ]
            ),
        ]
    ),

    // ── Halfling ─────────────────────────────────────────────────────────────
    new Race(
        'Halfling',
        'The comforts of home are the goals of most halflings\' lives: a place to settle in peace and quiet, far from marauding monsters and clashing armies.',
        { dexterity: 2 },
        'A halfling reaches adulthood at the age of 20 and generally lives into the middle of his or her second century, often seeing 150 or more years.',
        'Most halflings are lawful good. As a rule, they are good-hearted and kind, hate to see others in pain, and have no tolerance for oppression.',
        'Small',
        25,
        ['Common', 'Halfling'],
        [
            { name: 'Lucky', description: 'When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.' },
            { name: 'Brave', description: 'You have advantage on saving throws against being frightened.' },
            { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is of a size larger than yours.' },
        ],
        [
            new Race(
                'Lightfoot Halfling',
                'As a lightfoot halfling, you can easily hide from notice, even using other people as cover. You\'re inclined to be affable and get along well with others.',
                { charisma: 1 },
                'Lightfoot halflings have the same lifespan as other halflings.',
                'Lightfoot halflings tend toward lawful good.',
                'Small', 25, ['Common', 'Halfling'],
                [{ name: 'Naturally Stealthy', description: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.' }]
            ),
            new Race(
                'Stout Halfling',
                'As a stout halfling, you\'re hardier than average and have some resistance to poison. Some say that stouts have dwarven blood.',
                { constitution: 1 },
                'Stout halflings have the same lifespan as other halflings.',
                'Stout halflings tend toward lawful good.',
                'Small', 25, ['Common', 'Halfling'],
                [{ name: 'Stout Resilience', description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.' }]
            ),
        ]
    ),

    // ── Human ────────────────────────────────────────────────────────────────
    new Race(
        'Human',
        'Humans are the most adaptable and ambitious people among the common races. Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds.',
        { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
        'Humans reach adulthood in their late teens and live less than a century.',
        'Humans tend toward no particular alignment. The best and the worst are found among them.',
        'Medium',
        30,
        ['Common'],
        [
            { name: 'Extra Language', description: 'You can speak, read, and write one extra language of your choice.' },
        ]
    ),

    // ── Dragonborn ───────────────────────────────────────────────────────────
    new Race(
        'Dragonborn',
        'Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension.',
        { strength: 2, charisma: 1 },
        'Young dragonborn grow quickly. They walk hours after hatching, attain the size and development of a 10-year-old human child by the age of 3, and reach adulthood by 15. They live to be around 80.',
        'Dragonborn tend to extremes, making a conscious choice for one side or the other in the cosmic war between good and evil.',
        'Medium',
        30,
        ['Common', 'Draconic'],
        [
            { name: 'Draconic Ancestry', description: 'You have draconic heritage. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type, as shown in the table (Black/Acid, Blue/Lightning, Brass/Fire, Bronze/Lightning, Copper/Acid, Gold/Fire, Green/Poison, Red/Fire, Silver/Cold, White/Cold).' },
            { name: 'Breath Weapon', description: 'You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation. When you use your breath weapon, each creature in the area of the exhalation must make a saving throw, the type of which is determined by your draconic ancestry. The DC for this saving throw equals 8 + your Constitution modifier + your proficiency bonus. A creature takes 2d6 damage on a failed save, and half as much damage on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level. After you use your breath weapon, you can\'t use it again until you complete a short or long rest.' },
            { name: 'Damage Resistance', description: 'You have resistance to the damage type associated with your draconic ancestry.' },
        ]
    ),

    // ── Gnome ────────────────────────────────────────────────────────────────
    new Race(
        'Gnome',
        'A gnome\'s energy and enthusiasm for living shines through every inch of his or her tiny body.',
        { intelligence: 2 },
        'Gnomes mature at the same rate humans do, and most are expected to settle down into an adult life by around age 40. They can live 350 to over 500 years.',
        'Gnomes are most often good. Those who tend toward law are sages, engineers, researchers, scholars, investigators, or inventors. Those who tend toward chaos are minstrels, tricksters, wanderers, or fanciful jewelers.',
        'Small',
        25,
        ['Common', 'Gnomish'],
        [
            { name: 'Darkvision', description: 'Accustomed to life underground, you can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
            { name: 'Gnome Cunning', description: 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.' },
        ],
        [
            new Race(
                'Forest Gnome',
                'As a forest gnome, you have a natural knack for illusion and inherent quickness and stealth.',
                { dexterity: 1 },
                'Forest gnomes have the same lifespan as other gnomes.',
                'Forest gnomes tend toward good.',
                'Small', 25, ['Common', 'Gnomish'],
                [
                    { name: 'Natural Illusionist', description: 'You know the minor illusion cantrip. Intelligence is your spellcasting ability for it.' },
                    { name: 'Speak with Small Beasts', description: 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts. Forest gnomes love animals and often keep squirrels, badgers, rabbits, moles, woodpeckers, and other creatures as beloved pets.' },
                ]
            ),
            new Race(
                'Rock Gnome',
                'As a rock gnome, you have a natural inventiveness and hardiness beyond that of other gnomes.',
                { constitution: 1 },
                'Rock gnomes have the same lifespan as other gnomes.',
                'Rock gnomes tend toward good.',
                'Small', 25, ['Common', 'Gnomish'],
                [
                    { name: 'Artificer\'s Lore', description: 'Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus, instead of any proficiency bonus you normally apply.' },
                    { name: 'Tinker', description: 'You have proficiency with artisan\'s tools (tinker\'s tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device (AC 5, 1 hp). The device ceases to function after 24 hours or when you dismantle it as an action.' },
                ]
            ),
        ]
    ),

    // ── Half-Elf ─────────────────────────────────────────────────────────────
    new Race(
        'Half-Elf',
        'Walking in two worlds but truly belonging to neither, half-elves combine what some say are the best qualities of their elf and human parents.',
        { charisma: 2 },
        'Half-elves mature at the same rate humans do and reach adulthood around the age of 20. They live much longer than humans, however, often exceeding 180 years.',
        'Half-elves share the chaotic bent of their elven heritage. They value both personal freedom and creative expression, demonstrating neither love of leaders nor desire for followers.',
        'Medium',
        30,
        ['Common', 'Elvish'],
        [
            { name: 'Ability Score Increase (Two)', description: 'Two different ability scores of your choice increase by 1.' },
            { name: 'Darkvision', description: 'Thanks to your elf blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
            { name: 'Fey Ancestry', description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.' },
            { name: 'Skill Versatility', description: 'You gain proficiency in two skills of your choice.' },
            { name: 'Extra Language', description: 'You can speak, read, and write one extra language of your choice.' },
        ]
    ),

    // ── Half-Orc ─────────────────────────────────────────────────────────────
    new Race(
        'Half-Orc',
        'Half-orcs\' grayish pigmentation, sloping foreheads, jutting jaws, prominent teeth, and towering builds make their orcish heritage plain for all to see.',
        { strength: 2, constitution: 1 },
        'Half-orcs mature a little faster than humans, reaching adulthood around age 14. They age noticeably faster and rarely live longer than 75 years.',
        'Half-orcs inherit a tendency toward chaos from their orc parents and are not strongly inclined toward good.',
        'Medium',
        30,
        ['Common', 'Orc'],
        [
            { name: 'Darkvision', description: 'Thanks to your orc blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
            { name: 'Menacing', description: 'You gain proficiency in the Intimidation skill.' },
            { name: 'Relentless Endurance', description: 'When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can\'t use this feature again until you finish a long rest.' },
            { name: 'Savage Attacks', description: 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time and add it to the extra damage of the critical hit.' },
        ]
    ),

    // ── Tiefling ─────────────────────────────────────────────────────────────
    new Race(
        'Tiefling',
        'To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling.',
        { intelligence: 1, charisma: 2 },
        'Tieflings mature at the same rate as humans but live a few years longer.',
        'Tieflings might not have an innate tendency toward evil, but many of them end up there. Evil or not, an independent nature inclines many tieflings toward a chaotic alignment.',
        'Medium',
        30,
        ['Common', 'Infernal'],
        [
            { name: 'Darkvision', description: 'Thanks to your infernal heritage, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
            { name: 'Hellish Resistance', description: 'You have resistance to fire damage.' },
            { name: 'Infernal Legacy', description: 'You know the thaumaturgy cantrip. When you reach 3rd level, you can cast the hellish rebuke spell as a 2nd-level spell once with this trait and regain the ability to do so when you finish a long rest. When you reach 5th level, you can also cast the darkness spell once with this trait and regain the ability to do so when you finish a long rest. Charisma is your spellcasting ability for these spells.' },
        ]
    ),
];
