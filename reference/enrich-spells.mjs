import { readFileSync, writeFileSync } from 'fs';

const refData = JSON.parse(readFileSync('reference/spells.json', 'utf8'));

// Normalize apostrophes (curly vs straight) for matching
function normalize(s) {
    return s.toLowerCase().replace(/[\u2018\u2019\u201a\u201b\u2032\u2035]/g, "'");
}

// Build lookup map by normalized name
const refMap = new Map();
for (const spell of refData) {
    refMap.set(normalize(spell.name), spell);
}

// Some name variants to try
function lookup(name) {
    const key = normalize(name);
    if (refMap.has(key)) return refMap.get(key);
    // Try stripping apostrophe variants, e.g. "Arcanist's Magic Aura" vs "Nystul's Magic Aura"
    // Try common alternate names
    const alternates = {
        "floating disk": "tenser's floating disk",
        "faithful hound": "mordenkainen's faithful hound",
        "magnificent mansion": "mordenkainen's magnificent mansion",
        "private sanctum": "mordenkainen's private sanctum",
        "arcane hand": "bigby's hand",
        "instant summons": "drawmij's instant summons",
        "irresistible dance": "otto's irresistible dance",
        "secret chest": "leomund's secret chest",
        "tiny hut": "leomund's tiny hut",
        "magic aura": "nystul's magic aura",
        "telepathic bond": "rary's telepathic bond",
    };
    const alt = alternates[key];
    if (alt && refMap.has(alt)) return refMap.get(alt);
    return null;
}

let content = readFileSync('src/spells.ts', 'utf8');

// Update the interface
const newInterface = `export interface Spell {
    name: string;
    description: string;
    level: number;
    classes: string[];
    castingTime?: string;
    range?: string;
    duration?: string;
    components?: string;
    school?: string;
    ritual?: boolean;
    concentration?: boolean;
}`;

content = content.replace(/export interface Spell \{[\s\S]*?\n\}/, newInterface);

// Process each line
const lines = content.split('\n');
let matched = 0;
let unmatched = [];

const newLines = lines.map(line => {
    const nameMatch = line.match(/\{ name: "([^"]+)"/);
    if (!nameMatch) return line;

    const spellName = nameMatch[1];
    const ref = lookup(spellName);

    if (!ref) {
        unmatched.push(spellName);
        return line;
    }

    matched++;
    const castingTime = ref.casting_time ?? '';
    const range = ref.range ?? '';
    const duration = ref.duration ?? '';
    const components = ref.components?.raw ?? '';
    const school = ref.school ?? '';
    const ritual = ref.ritual ?? false;
    const concentration = typeof duration === 'string' && duration.toLowerCase().startsWith('concentration');

    // Replace the closing of the spell object: classes: [...] },
    // Pattern accounts for possible trailing whitespace
    return line.replace(
        /(classes: \[[^\]]*\])\s*\},(\s*)$/,
        (_, classesStr, trailing) => {
            const parts = [
                classesStr,
                `castingTime: ${JSON.stringify(castingTime)}`,
                `range: ${JSON.stringify(range)}`,
                `duration: ${JSON.stringify(duration)}`,
                `components: ${JSON.stringify(components)}`,
                `school: ${JSON.stringify(school)}`,
                `ritual: ${ritual}`,
                `concentration: ${concentration}`,
            ];
            return parts.join(', ') + ' },' + trailing;
        }
    );
});

writeFileSync('src/spells.ts', newLines.join('\n'));

console.log(`Enriched: ${matched} spells`);
if (unmatched.length > 0) {
    console.warn(`Unmatched (${unmatched.length}):`, unmatched.join(', '));
}
