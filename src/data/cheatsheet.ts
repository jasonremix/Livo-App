/** Spickzettel für den Express-Modus: die wichtigsten Fakten kurz vor der Prüfung. */
export interface CheatSection {
  title: string;
  icon: string; // Ionicons name
  facts: string[];
}

export const CHEAT_SHEET: CheatSection[] = [
  {
    title: 'Zahlen, die sitzen müssen',
    icon: 'speedometer-outline',
    facts: [
      'Innerorts 50 km/h, außerorts 100 km/h (Pkw), Autobahn: Richtgeschwindigkeit 130 km/h',
      'Mit Anhänger außerorts 80 km/h, mit Schneeketten höchstens 50 km/h',
      'Sicht unter 50 m (Nebel, Regen, Schnee): höchstens 50 km/h',
      'Reaktionsweg (v ÷ 10) × 3 · Bremsweg (v ÷ 10)² · Gefahrbremsung: Bremsweg halbieren',
      'Doppelte Geschwindigkeit = vierfacher Bremsweg',
      'Abstand außerorts: halber Tacho in Metern oder zwei Sekunden',
      'Seitenabstand zu Radfahrern: innerorts 1,5 m, außerorts 2 m',
    ],
  },
  {
    title: 'Vorfahrt',
    icon: 'git-merge-outline',
    facts: [
      'Rangfolge: Polizei > Ampel > Verkehrszeichen > rechts vor links',
      'Linksabbieger lassen Gegenverkehr und Straßenbahnen durch',
      'Rechtsabbieger: Schulterblick, Radfahrer geradeaus haben Vorrang',
      'Kreisverkehr: rein ohne Blinker, raus mit Blinker rechts',
      'Stoppschild: immer an der Haltlinie anhalten',
    ],
  },
  {
    title: 'Halten & Parken',
    icon: 'car-outline',
    facts: [
      'Parken = Fahrzeug verlassen oder länger als 3 Minuten halten',
      'Kein Halten auf dem Zebrastreifen und bis 5 m davor',
      'Parkverbot: 5 m vor/hinter Kreuzungen, 15 m vor/hinter Haltestellenschildern',
      'Rotes Kreuz auf Blau: absolutes Haltverbot · ein Schrägbalken: bis 3 Minuten erlaubt',
    ],
  },
  {
    title: 'Gefahren & Rücksicht',
    icon: 'warning-outline',
    facts: [
      'Kinder, Ältere, Hilfsbedürftige: langsam, bremsbereit, mit Fehlern rechnen',
      'Bus mit Warnblinklicht an der Haltestelle: nur Schrittgeschwindigkeit – auch im Gegenverkehr',
      'Bus mit Warnblinklicht nähert sich der Haltestelle: nicht überholen',
      'Nebelschlussleuchte nur bei Nebel und Sicht unter 50 m',
      'Wild: abblenden, hupen, bremsen – nicht riskant ausweichen',
      'Aquaplaning: auskuppeln, Lenkrad gerade halten, nicht bremsen',
    ],
  },
  {
    title: 'Fahrer & Recht',
    icon: 'person-outline',
    facts: [
      'Probezeit und unter 21: 0,0 Promille',
      'Danach: ab 0,5 Promille Ordnungswidrigkeit, ab 1,1 Promille immer Straftat',
      'Probezeit 2 Jahre, bei A-Verstoß oder zwei B-Verstößen Verlängerung auf 4 Jahre',
      'Ab 8 Punkten im Fahreignungsregister: Führerschein weg',
      'Handy nicht in die Hand nehmen – auch nicht an der Ampel',
      'Rettungsgasse: ganz links nach links, alle anderen nach rechts',
    ],
  },
];

/** Hinweise für den Prüfungstag. */
export const EXAM_DAY_TIPS = [
  'Gültigen Personalausweis oder Reisepass einpacken.',
  'Rechtzeitig da sein – Hektik kostet Konzentration.',
  'Jede Antwort einzeln lesen: Oft sind mehrere richtig.',
  'Bei Zahlenfragen die Einheit prüfen.',
  'Unsicher? Frage markieren und am Ende nochmal ansehen.',
];
