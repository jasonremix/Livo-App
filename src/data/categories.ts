import type { Category, CategoryId } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'gefahren',
    title: 'Gefahrenlehre',
    short: 'Gefahren',
    description: 'Gefahren früh erkennen: Kinder, Wetter, Wild, Müdigkeit und Ablenkung.',
    icon: 'warning-outline',
  },
  {
    id: 'verhalten',
    title: 'Verhalten im Verkehr',
    short: 'Verhalten',
    description: 'Geschwindigkeit, Abstand, Überholen, Halten, Parken und Autobahn.',
    icon: 'car-outline',
  },
  {
    id: 'vorfahrt',
    title: 'Vorfahrt & Vorrang',
    short: 'Vorfahrt',
    description: 'Rechts vor links, Ampeln, Polizei, Abbiegen und Kreisverkehr.',
    icon: 'git-merge-outline',
  },
  {
    id: 'zeichen',
    title: 'Verkehrszeichen',
    short: 'Zeichen',
    description: 'Gefahr-, Vorschrift- und Richtzeichen sicher erkennen.',
    icon: 'triangle-outline',
  },
  {
    id: 'umwelt',
    title: 'Umweltschutz',
    short: 'Umwelt',
    description: 'Spritsparend und leise fahren – gut für Umwelt und Geldbeutel.',
    icon: 'leaf-outline',
  },
  {
    id: 'technik',
    title: 'Technik',
    short: 'Technik',
    description: 'Reifen, Licht, Bremsen, Ladung und Pflichtausrüstung.',
    icon: 'construct-outline',
  },
  {
    id: 'fahrer',
    title: 'Fahrer & Recht',
    short: 'Fahrer',
    description: 'Alkohol, Probezeit, Punkte, Handy am Steuer und Verhalten nach Unfällen.',
    icon: 'person-outline',
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  Category
>;
