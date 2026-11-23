import type { SignId } from './types';

export type SignGroup = 'Gefahrzeichen' | 'Vorschriftzeichen' | 'Richtzeichen';

export interface SignInfo {
  /** Amtliche Bezeichnung mit Zeichennummer */
  name: string;
  /** Kurze Erklärung für den Schilder-Trainer */
  meaning: string;
  group: SignGroup;
}

export const SIGN_INFO: Record<SignId, SignInfo> = {
  '101': {
    name: 'Gefahrstelle (Zeichen 101)',
    meaning: 'Warnt allgemein vor einer Gefahr. Ein Zusatzzeichen kann sie näher beschreiben, z. B. „Unfallgefahr“.',
    group: 'Gefahrzeichen',
  },
  '201': {
    name: 'Andreaskreuz (Zeichen 201)',
    meaning: 'Bahnübergang: Schienenfahrzeuge haben Vorrang. Nur mit mäßiger Geschwindigkeit heranfahren.',
    group: 'Vorschriftzeichen',
  },
  '205': {
    name: 'Vorfahrt gewähren (Zeichen 205)',
    meaning: 'Du musst den Querverkehr durchlassen. Anhalten nur, wenn es nötig ist.',
    group: 'Vorschriftzeichen',
  },
  '206': {
    name: 'Halt. Vorfahrt gewähren (Zeichen 206)',
    meaning: 'Immer vollständig an der Haltlinie anhalten – auch bei freier Straße – und dann Vorfahrt gewähren.',
    group: 'Vorschriftzeichen',
  },
  '209': {
    name: 'Vorgeschriebene Fahrtrichtung rechts (Zeichen 209)',
    meaning: 'Du musst nach rechts abbiegen. Geradeaus oder links ist nicht erlaubt.',
    group: 'Vorschriftzeichen',
  },
  '250': {
    name: 'Verbot für Fahrzeuge aller Art (Zeichen 250)',
    meaning: 'Durchfahrt für alle Fahrzeuge verboten. Fahrräder und Krafträder dürfen geschoben werden.',
    group: 'Vorschriftzeichen',
  },
  '267': {
    name: 'Verbot der Einfahrt (Zeichen 267)',
    meaning: 'Hier darfst du nicht hineinfahren – typisch am Ende einer Einbahnstraße.',
    group: 'Vorschriftzeichen',
  },
  '274-30': {
    name: 'Zulässige Höchstgeschwindigkeit 30 km/h (Zeichen 274)',
    meaning: 'Du darfst höchstens 30 km/h fahren, bis die Beschränkung aufgehoben wird.',
    group: 'Vorschriftzeichen',
  },
  '274-50': {
    name: 'Zulässige Höchstgeschwindigkeit 50 km/h (Zeichen 274)',
    meaning: 'Du darfst höchstens 50 km/h fahren, bis die Beschränkung aufgehoben wird.',
    group: 'Vorschriftzeichen',
  },
  '274-70': {
    name: 'Zulässige Höchstgeschwindigkeit 70 km/h (Zeichen 274)',
    meaning: 'Du darfst höchstens 70 km/h fahren, bis die Beschränkung aufgehoben wird.',
    group: 'Vorschriftzeichen',
  },
  '276': {
    name: 'Überholverbot für Kraftfahrzeuge aller Art (Zeichen 276)',
    meaning: 'Mehrspurige Kraftfahrzeuge dürfen nicht überholt werden. Fahrräder und Motorräder ohne Beiwagen schon.',
    group: 'Vorschriftzeichen',
  },
  '282': {
    name: 'Ende sämtlicher Streckenverbote (Zeichen 282)',
    meaning: 'Hebt vorher angeordnete Tempolimits und Überholverbote auf.',
    group: 'Vorschriftzeichen',
  },
  '283': {
    name: 'Absolutes Haltverbot (Zeichen 283)',
    meaning: 'Hier darfst du überhaupt nicht halten – auch nicht kurz.',
    group: 'Vorschriftzeichen',
  },
  '286': {
    name: 'Eingeschränktes Haltverbot (Zeichen 286)',
    meaning: 'Halten bis drei Minuten erlaubt, zum Ein-/Aussteigen oder Be-/Entladen auch länger. Parken verboten.',
    group: 'Vorschriftzeichen',
  },
  '301': {
    name: 'Vorfahrt an der nächsten Kreuzung (Zeichen 301)',
    meaning: 'Du hast Vorfahrt – aber nur an der nächsten Kreuzung oder Einmündung.',
    group: 'Richtzeichen',
  },
  '306': {
    name: 'Vorfahrtstraße (Zeichen 306)',
    meaning: 'Du hast an allen folgenden Kreuzungen Vorfahrt. Außerorts Parkverbot auf der Fahrbahn.',
    group: 'Richtzeichen',
  },
  '307': {
    name: 'Ende der Vorfahrtstraße (Zeichen 307)',
    meaning: 'Die Vorfahrtstraße endet. An der nächsten Kreuzung gilt eine neue Regelung.',
    group: 'Richtzeichen',
  },
  '310': {
    name: 'Ortstafel – Beginn der geschlossenen Ortschaft (Zeichen 310)',
    meaning: 'Ab hier gelten die Innerorts-Regeln, z. B. 50 km/h Höchstgeschwindigkeit.',
    group: 'Richtzeichen',
  },
  '314': {
    name: 'Parken (Zeichen 314)',
    meaning: 'Kennzeichnet einen Parkplatz. Zusatzzeichen können das Parken einschränken.',
    group: 'Richtzeichen',
  },
  '357': {
    name: 'Sackgasse (Zeichen 357)',
    meaning: 'Die Straße endet. Mit Fußgänger- oder Radsymbol ist sie für diese durchlässig.',
    group: 'Richtzeichen',
  },
  '380': {
    name: 'Richtgeschwindigkeit (Zeichen 380)',
    meaning: 'Empfohlene Höchstgeschwindigkeit – kein Tempolimit.',
    group: 'Richtzeichen',
  },
};

export const SIGN_NAMES = Object.fromEntries(
  Object.entries(SIGN_INFO).map(([id, info]) => [id, info.name]),
) as Record<SignId, string>;

export const SIGN_IDS = Object.keys(SIGN_INFO) as SignId[];
