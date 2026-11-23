/** Führerscheinklassen (Feld 9 des EU-Kartenführerscheins) mit Kurzbeschreibung. */
export const LICENSE_CLASSES: Record<string, string> = {
  AM: 'Kleinkrafträder und Roller bis 45 km/h sowie leichte vierrädrige Kfz bis 45 km/h',
  A1: 'Leichtkrafträder bis 125 cm³ und 11 kW',
  A2: 'Krafträder bis 35 kW',
  A: 'Krafträder ohne Leistungsbeschränkung',
  B: 'Kfz bis 3.500 kg mit höchstens 8 Sitzplätzen außer dem Fahrersitz; Anhänger bis 750 kg oder Kombination bis 3.500 kg',
  BE: 'Klasse-B-Fahrzeug mit Anhänger bis 3.500 kg',
  C1: 'Kfz über 3.500 kg bis 7.500 kg',
  C1E: 'Klasse C1 mit Anhänger über 750 kg (Kombination bis 12.000 kg)',
  C: 'Kfz über 3.500 kg',
  CE: 'Klasse C mit Anhänger über 750 kg',
  D1: 'Kfz mit bis zu 16 Sitzplätzen außer dem Fahrersitz und höchstens 8 m Länge',
  D1E: 'Klasse D1 mit Anhänger über 750 kg',
  D: 'Kraftomnibusse mit mehr als 8 Sitzplätzen außer dem Fahrersitz',
  DE: 'Klasse D mit Anhänger über 750 kg',
  L: 'Land- oder forstwirtschaftliche Zugmaschinen bis 40 km/h',
  T: 'Land- oder forstwirtschaftliche Zugmaschinen bis 60 km/h',
};

/** Reihenfolge wie auf der Rückseite des Führerscheins. */
export const LICENSE_CLASS_ORDER = ['AM', 'A1', 'A2', 'A', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE', 'L', 'T'];
