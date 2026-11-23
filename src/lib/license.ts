/**
 * Liest die Felder eines EU-Kartenführerscheins aus erkanntem Text (OCR).
 * Feldnummern laut Richtlinie 2006/126/EG: 1 Name, 2 Vorname, 3 Geburtsdatum/-ort,
 * 4a Ausstellungsdatum, 4b Ablaufdatum, 4c Behörde, 5 Führerscheinnummer, 9 Klassen.
 */
import { LICENSE_CLASS_ORDER } from '@/data/license-classes';

import { parseGermanDate } from './dates';

export interface LicenseScan {
  surname?: string;
  givenNames?: string;
  birth?: string;
  issued?: string;
  expires?: string; // YYYY-MM-DD
  authority?: string;
  number?: string;
  classes: string[];
}

const FIELD_RE = /(?:^|[\s|])(4[abcd]|[1-9])\s?[.,:]\s+/g;
const DATE_RE = /(\d{2})[.,](\d{2})[.,](\d{4})/;

function firstDate(value: string | undefined): string | undefined {
  const m = value?.match(DATE_RE);
  return m ? (parseGermanDate(`${m[1]}.${m[2]}.${m[3]}`) ?? undefined) : undefined;
}

function clean(value: string | undefined): string | undefined {
  const v = value?.replace(/\s+/g, ' ').trim();
  return v ? v : undefined;
}

/** Klassen aus Feld 9 (z. B. „AM/B/L“) – nur bekannte Klassen, in amtlicher Reihenfolge. */
export function parseClasses(value: string): string[] {
  const tokens = value
    .toUpperCase()
    .replace(/[^A-Z0-9/ ,]/g, ' ')
    .split(/[\s/,]+/)
    .filter(Boolean);
  const found = new Set(tokens.filter((t) => LICENSE_CLASS_ORDER.includes(t)));
  return LICENSE_CLASS_ORDER.filter((c) => found.has(c));
}

export function parseLicenseText(text: string): LicenseScan {
  const fields: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const matches = [...line.matchAll(FIELD_RE)];
    matches.forEach((m, i) => {
      const start = (m.index ?? 0) + m[0].length;
      const end = i + 1 < matches.length ? (matches[i + 1].index ?? line.length) : line.length;
      const key = m[1].toLowerCase();
      if (!fields[key]) fields[key] = line.slice(start, end).trim();
    });
  }

  let classes = fields['9'] ? parseClasses(fields['9']) : [];
  if (!classes.length) {
    // Fallback: eine Zeile wie „AM/B/L“ irgendwo im Text
    const m = text.match(/\b(?:AM|A1|A2|A|B|BE|C1E?|CE?|D1E?|DE?|L|T)(?:\s*\/\s*(?:AM|A1|A2|A|B|BE|C1E?|CE?|D1E?|DE?|L|T))+\b/);
    if (m) classes = parseClasses(m[0]);
  }

  return {
    surname: clean(fields['1']),
    givenNames: clean(fields['2']),
    birth: clean(fields['3']),
    issued: firstDate(fields['4a']),
    expires: firstDate(fields['4b']),
    authority: clean(fields['4c']),
    number: clean(fields['5'])?.split(' ')[0],
    classes,
  };
}

/** Zeigt nur die ersten und letzten Zeichen der Führerscheinnummer. */
export function maskNumber(value: string): string {
  if (value.length <= 4) return '••••';
  return `${value.slice(0, 2)}${'•'.repeat(value.length - 4)}${value.slice(-2)}`;
}
