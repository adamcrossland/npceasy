export interface Feat {
    name: string;
    description: string;
    prerequisites?: string;
}

export const Feats: Feat[] = [
    {
        name: 'Alert',
        description: 'Always on the lookout for danger, you gain +5 to initiative, cannot be surprised while conscious, and hidden creatures gain no advantage on attack rolls against you.',
    },
    {
        name: 'Athlete',
        description: 'You have undergone extensive physical training. Increase Strength or Dexterity by 1, and gain improved climbing and jumping abilities.',
    },
    {
        name: 'Actor',
        description: 'Skilled at mimicry and dramatics, you gain +1 Charisma and can mimic speech and sounds you have heard.',
    },
    {
        name: 'Charger',
        description: 'When you take the Dash action and then make a melee attack or shove as a bonus action, you gain a bonus to the attack or shove.',
    },
    {
        name: 'Crossbow Expert',
        description: 'You are expert with crossbows, ignoring the loading property, avoiding disadvantage in melee, and being able to attack with a hand crossbow as a bonus action.',
        prerequisites: 'Proficiency with crossbows',
    },
    {
        name: 'Defensive Duelist',
        description: 'When wielding a finesse weapon, you can use your reaction to add your proficiency bonus to AC against one melee attack.',
        prerequisites: 'Dexterity 13 or higher',
    },
    {
        name: 'Dual Wielder',
        description: 'You master fighting with two weapons, gaining +1 AC while wielding two melee weapons, allowing non-light weapons for two-weapon fighting, and drawing two weapons at once.',
    },
    {
        name: 'Dungeon Delver',
        description: 'Alert to the hidden traps and secret doors found in many dungeons, you gain advantage on Perception and Investigation checks related to doors and traps.',
    },
    {
        name: 'Durable',
        description: 'Hardy and resilient. Increase Constitution by 1, and when you roll hit dice to recover hit points, the minimum number you can recover equals twice your Constitution modifier.',
    },
    {
        name: 'Elemental Adept',
        description: 'Spells you cast of the chosen damage type ignore resistance, and a roll of 1 on a damage die counts as a 2.',
        prerequisites: 'Spellcasting or Pact Magic feature',
    },
    {
        name: 'Grappler',
        description: 'You have developed the skills necessary to hold your own in close-quarters grappling.',
        prerequisites: 'Strength 13 or higher',
    },
    {
        name: 'Great Weapon Master',
        description: 'On a critical hit or killing blow with a heavy weapon, you can make a bonus attack. You can also take a -5 to attack to add +10 to damage.',
    },
    {
        name: 'Healer',
        description: 'You are an able physician, allowing you to stabilize the dying and use a healer\'s kit to restore hit points.',
    },
    {
        name: 'Heavily Armored',
        description: 'You gain proficiency with heavy armor and increase your Strength by 1.',
        prerequisites: 'Proficiency with medium armor',
    },
    {
        name: 'Heavy Armor Master',
        description: 'You can use your armor to deflect strikes. Increase Strength by 1. While wearing heavy armor, reduce bludgeoning, piercing, and slashing damage by 3.',
        prerequisites: 'Proficiency with heavy armor',
    },
    {
        name: 'Inspiring Leader',
        description: 'You can spend 10 minutes inspiring your companions, giving up to 6 creatures temporary hit points equal to your level + Charisma modifier.',
        prerequisites: 'Charisma 13 or higher',
    },
    {
        name: 'Keen Mind',
        description: 'You have a mind that can track time, direction, and detail with uncanny precision. Gain +1 Intelligence.',
    },
    {
        name: 'Linguist',
        description: 'You have studied languages and codes. Gain +1 Intelligence, learn 3 additional languages, and can create ciphers.',
    },
    {
        name: 'Lucky',
        description: 'You have inexplicable luck. You have 3 luck points per long rest you can spend to reroll attack rolls, ability checks, or saving throws.',
    },
    {
        name: 'Mage Slayer',
        description: 'You have practiced techniques useful in melee combat against spellcasters.',
    },
    {
        name: 'Magic Initiate',
        description: 'Choose a class. Learn 2 cantrips and 1 1st-level spell from that class\'s list.',
    },
    {
        name: 'Martial Adept',
        description: 'You have martial training that allows you to perform special combat maneuvers. You gain 2 maneuvers and a superiority die.',
    },
    {
        name: 'Medium Armor Master',
        description: 'You have practiced moving in medium armor. Wearing medium armor doesn\'t impose disadvantage on Stealth checks, and your AC can include up to +3 Dexterity.',
        prerequisites: 'Proficiency with medium armor',
    },
    {
        name: 'Mobile',
        description: 'You are exceptionally speedy and agile. Your speed increases by 10 ft, Dash ignores difficult terrain, and you avoid opportunity attacks from creatures you attack.',
    },
    {
        name: 'Moderately Armored',
        description: 'You gain proficiency with medium armor and shields and increase Strength or Dexterity by 1.',
        prerequisites: 'Proficiency with light armor',
    },
    {
        name: 'Mounted Combatant',
        description: 'You are a dangerous foe to face while mounted. You gain advantages on attacks against unmounted creatures smaller than your mount.',
    },
    {
        name: 'Observant',
        description: 'Quick to notice details. Gain +1 Intelligence or Wisdom. You can read lips and gain +5 to passive Perception and Investigation scores.',
    },
    {
        name: 'Polearm Master',
        description: 'You can keep enemies at bay with polearms. Gain a bonus action attack with the butt of the weapon, and opportunity attacks when creatures enter your reach.',
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
        description: 'Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon\'s damage dice and use either total.',
    },
    {
        name: 'Sentinel',
        description: 'You have mastered techniques to take advantage of every drop in any enemy\'s guard. Opportunity attacks stop movement and can trigger on Disengage.',
    },
    {
        name: 'Sharpshooter',
        description: 'You have mastered ranged weapons. Ignore long range and three-quarters cover penalties. Take -5 to attack for +10 to damage.',
    },
    {
        name: 'Shield Master',
        description: 'You use shields not just for protection but also for offense. Gain a bonus action shove and add shield AC to Dex saves.',
    },
    {
        name: 'Skilled',
        description: 'You gain proficiency in any combination of three skills or tools of your choice.',
    },
    {
        name: 'Skulker',
        description: 'You are expert at slinking through shadows. You can try to hide when only lightly obscured, and missing a ranged attack while hidden doesn\'t reveal your position.',
        prerequisites: 'Dexterity 13 or higher',
    },
    {
        name: 'Spell Sniper',
        description: 'You have learned techniques to enhance your attacks with certain kinds of spells. Double the range of attack roll spells and ignore half and three-quarters cover.',
        prerequisites: 'Spellcasting or Pact Magic feature',
    },
    {
        name: 'Tavern Brawler',
        description: 'Accustomed to rough-and-tumble fighting. Gain +1 Strength or Constitution, proficiency with improvised weapons, and grapple as a bonus action.',
    },
    {
        name: 'Tough',
        description: 'Your hit point maximum increases by an amount equal to twice your level, and increases by 2 every time you gain a level.',
    },
    {
        name: 'War Caster',
        description: 'You have practiced casting spells in the midst of combat. Gain advantage on concentration saves, cast spells as opportunity attacks, and perform somatic components with weapons in hand.',
        prerequisites: 'Spellcasting or Pact Magic feature',
    },
    {
        name: 'Weapon Master',
        description: 'You have practiced extensively with a variety of weapons. Gain +1 Strength or Dexterity and proficiency with four weapons of your choice.',
    },
];

export function GetFeatByName(name: string): Feat | undefined {
    return Feats.find(feat => feat.name === name);
}
