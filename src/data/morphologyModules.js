export const morphologyModules = [
  {
    id: 'trees',
    label: 'Morphology Trees',
    shortLabel: 'Trees',
    badge: 'Cases',
    accent: 'emerald',
    description:
      'Map how endings, agreement, and case patterns branch off a base word so the structure becomes visible.',
    focusAreas: ['Case branching', 'Ending changes', 'Agreement tracing'],
    prototype:
      'A visual tree surface where one base word can branch into noun and adjective patterns, then fan out by case.',
    example: 'dom -> doma -> domu',
    futureIdeas: [
      'Color-code the trigger behind each case shift.',
      'Show preposition pressure on each branch.',
      'Flag irregular forms so they stand out from the pattern.',
    ],
  },
  {
    id: 'rolodex',
    label: 'Linguistic Rolodex',
    shortLabel: 'Rolodex',
    badge: 'Build',
    accent: 'amber',
    description:
      'Roll prefixes, roots, and suffixes around a word like a digital clock so learners can feel how the parts mutate meaning.',
    focusAreas: ['Prefix rollers', 'Root swaps', 'Suffix experiments'],
    prototype:
      'A slot-machine style morpheme rig where one part can stay locked while the others spin around it.',
    example: 'po | lyub | ov',
    futureIdeas: [
      'Compare close variants side by side.',
      'Let one morpheme stay pinned while the rest rotate.',
      'Save weird but useful builds into a personal bank.',
    ],
  },
  {
    id: 'wildcard',
    label: 'Wildcard Bay',
    shortLabel: 'Wildcard',
    badge: 'Ideas',
    accent: 'blue',
    description:
      'A parking bay for the next wacky grammar contraption before it grows into its own full module.',
    focusAreas: ['Compound builders', 'Stress games', 'Word surgery'],
    prototype:
      'A flexible shell for experiments that do not fit the normal typing pipeline but still teach how Russian works.',
    example: 'future slot',
    futureIdeas: [
      'Compound root mashups.',
      'Interactive prefix ladders.',
      'Morphology mini-games that explain themselves while you play.',
    ],
  },
];

export const defaultMorphologyModuleId = morphologyModules[0]?.id || 'trees';

export function getMorphologyModule(moduleId) {
  return morphologyModules.find((module) => module.id === moduleId) || morphologyModules[0];
}
