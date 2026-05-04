import { ClassType, CharClass } from "./classes";
import type { ClassFeature } from "./classes";
import { Race } from "./races";
import { Weapon } from "./weapons";
import type { Feat } from "./feats";

export type AbilityScores = {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
};

export type CharacterClassLevel = {
    charClass: CharClass;
    level: number;
};

export type Character = {
    name: string;
    race: Race
    classLevels: CharacterClassLevel[];
    experience: number;
    hitPoints: number;
    maxHitPoints: number;
    armorClass: number;
    speed: number;
    abilityScores: AbilityScores;
    skills: Record<string, number>;
    savingThrows: Record<string, number>;
    proficiencies: string[];
    languages: string[];
    traits: string[];
    equipment: string[];
    weapons: Weapon[];
    feats: Feat[];
    alignment: string;
    background: string;
    personality: string;
    ideals: string;
    bonds: string;
    flaws: string;
};

function matchesClassType(classLevel: CharacterClassLevel, charClass: CharClass | ClassType): boolean {
    const classType = charClass instanceof CharClass ? charClass.classType : charClass;
    return classLevel.charClass.classType === classType;
}

export function GetCharacterClassLevel(character: Character, charClass: CharClass | ClassType): number {
    return character.classLevels
        .filter(classLevel => matchesClassType(classLevel, charClass))
        .reduce((totalLevel, classLevel) => totalLevel + classLevel.level, 0);
}

export function GetCharacterClassFeatures(character: Character, charClass: CharClass | ClassType): ClassFeature[] {
    return character.classLevels
        .filter(classLevel => matchesClassType(classLevel, charClass))
        .flatMap(classLevel => classLevel.charClass.getFeaturesByLevel(classLevel.level));
}

export function GetAllUnlockedClassFeatures(character: Character): ClassFeature[] {
    return character.classLevels.flatMap(classLevel =>
        classLevel.charClass.getFeaturesByLevel(classLevel.level)
    );
}
