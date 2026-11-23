# Livo – die App zu mylivo.app

Mobile App (iOS, Android und Web) für die Vorbereitung auf die deutsche Führerschein-Theorieprüfung Klasse B – im Design von [mylivo.app](https://mylivo.app). Gebaut mit Expo SDK 58, React Native und TypeScript.

## Funktionen

| Bereich | Was die App kann |
| --- | --- |
| **Start** | Prüfungsreife in Prozent, Tagesziel, Lernserie, Countdown bis zum Prüfungstermin, Schnellstart, Livias Tipp des Tages |
| **Lernen** | Smartes Training (15 Fragen nach dem Karteikasten-Prinzip: Fehler zuerst, dann fällige Wiederholungen, dann neue Fragen), Fehler wiederholen, markierte Fragen, 7 Themenbereiche mit Fortschritt |
| **Kurse** | Die vier Kurse von mylivo.app/kurse mit je drei Lernmodulen, Verkehrszeichen-Grafiken und Abschlussquiz. Das erste Modul jedes Kurses ist gratis, alle weiteren gehören zu Livo Plus |
| **Prüfung** | Simulation wie im Original: 30 Fragen (20 Grundstoff + 10 Klasse B), 45 Minuten, 2–5 Fehlerpunkte pro Frage, nicht bestanden bei mehr als 10 Fehlerpunkten oder zwei falschen 5-Punkte-Fragen. Fragenübersicht, Markieren, Auswertung mit Erklärungen, Verlauf |
| **Livia** | Chat mit Livia. Offline beantwortet sie Fragen aus der eingebauten Wissensbasis; mit dem optionalen [Livia-Server](server/README.md) antwortet sie per Claude. „Frag Livia“ im Quiz erklärt die gerade beantwortete Frage |
| **Konto** | Profil, Prüfungstermin, Tagesziel, Credits (2 pro richtiger Antwort, einmal pro Frage) mit Prämienübersicht, Livo Plus, helles/dunkles Design, Statistik, Links zu mylivo.app |

Inhalt: 100 eigenständig formulierte Übungsfragen (Multiple Choice mit mehreren richtigen Antworten und Zahlenfragen), jede mit einer Erklärung von Livia, 21 als SVG gezeichnete Verkehrszeichen, 12 Lernmodule.

Der Lernfortschritt wird lokal auf dem Gerät gespeichert (AsyncStorage).

## Schnellstart

```bash
npm install
npm start          # QR-Code mit Expo Go scannen (iOS/Android)
npm run web        # im Browser öffnen
```

## Skripte

| Befehl | Zweck |
| --- | --- |
| `npm start` | Entwicklungsserver (Expo) |
| `npm run web` | Web-Version im Browser |
| `npm run build:web` | Statischer Web-Build nach `dist/` (z. B. für app.mylivo.app) |
| `npm test` | Tests (Jest): Inhalte, Prüfungsbewertung, Karteikasten, Livia, Store |
| `npm run typecheck` | TypeScript prüfen |
| `npm run lint` | ESLint |
| `npm run livia-server` | Livia-Server starten (vorher `npm install --prefix server`) |

## Projektstruktur

```
src/
  app/                 Screens (Expo Router, dateibasiert)
    (tabs)/            Start, Lernen, Prüfung, Livia, Konto
    quiz.tsx           Übungsrunde (Training, Thema, Fehler, Markierte, Modul)
    exam.tsx           Prüfungssimulation
    exam-result.tsx    Auswertung
    kurs/ modul/       Kursübersicht und Lernmodul
    credits.tsx plus.tsx onboarding.tsx
  components/          UI-Bausteine, Fragenansicht, Verkehrszeichen (SVG)
  data/                Fragen, Themen, Kurse, Prämien, Livia-Wissensbasis
  lib/                 Prüfungslogik, Karteikasten, Statistik, Livia (offline + Client)
  store/               Zustand-Store mit Persistenz
  theme/               Farben und Schriften von mylivo.app (Unbounded, Manrope)
server/                Optionaler Livia-Server (Claude API)
__tests__/             Tests
```

## Livia mit KI

Ohne Konfiguration antwortet Livia offline. Für echte KI-Antworten:

1. Livia-Server starten oder deployen – siehe [server/README.md](server/README.md).
2. App mit der Server-URL bauen bzw. starten:
   ```bash
   EXPO_PUBLIC_LIVIA_API_URL=https://api.mylivo.app npx expo start
   ```

Ohne Livo Plus sind dann 10 KI-Nachrichten pro Tag frei. Ist der Server nicht erreichbar, fällt die App automatisch auf die Offline-Antwort zurück.

## Builds für App Store und Google Play

Die App nutzt Continuous Native Generation – die Ordner `ios/` und `android/` werden erzeugt, nicht eingecheckt. Gebaut wird mit EAS in der Expo-Cloud. Das Projekt ist mit Expo verknüpft: [expo.dev/accounts/jasonburger/projects/livo](https://expo.dev/accounts/jasonburger/projects/livo) (Projekt-ID in `app.json`, Profile in `eas.json`).

```bash
npx eas-cli@latest login

# Installierbare Android-App (APK) zum Testen – Download-Link/QR-Code auf expo.dev
npx eas-cli@latest build --platform android --profile preview

# Store-Builds (Android App Bundle / iOS) und Einreichung
npx eas-cli@latest build --platform all --profile production
npx eas-cli@latest submit
```

| Profil | Ergebnis |
| --- | --- |
| `preview` | APK zum direkten Installieren auf Android-Geräten (interne Verteilung) |
| `production` | Store-Builds, Versionsnummer zählt automatisch hoch |

Der Android-Signaturschlüssel liegt verwaltet bei Expo. Für iOS braucht es zusätzlich ein Apple-Developer-Konto.

Bundle-ID / Package: `app.mylivo.livo` (in `app.json` anpassbar).

## Inhalte pflegen

- **Fragen:** `src/data/questions.ts`. Jede Frage hat eine Kategorie, Grundstoff (`G`) oder Klasse B (`B`), Fehlerpunkte (2–5), Antworten und eine Erklärung. `npm test` prüft u. a. eindeutige IDs, gültige Lösungen und ob genug Fragen für eine Prüfung da sind.
- **Kurse:** `src/data/courses.ts`. Quizfragen eines Moduls verweisen auf Fragen-IDs.
- **Livia offline:** `src/data/livia-faq.ts` (Stichwörter + Antwort). Zusätzlich durchsucht Livia alle Kursabschnitte und Fragenerklärungen.

Die Fragen sind eigenständig formuliert und kein Abdruck des amtlichen Fragenkatalogs. Der amtliche Katalog ist lizenzpflichtig (TÜV | DEKRA arge tp 21). Wer ihn einbinden möchte, braucht eine Lizenz.

## Was noch an mylivo.app angebunden werden muss

Diese Punkte brauchen Schnittstellen bzw. Entscheidungen auf Seiten von mylivo.app:

- **Konto-Login und Synchronisierung:** Fortschritt, Credits und Plus-Status liegen derzeit nur auf dem Gerät. Für den Abgleich mit dem mylivo.app-Konto wird eine API benötigt.
- **Livo Plus kaufen:** Der Button öffnet `mylivo.app/checkout?plan=plus`. Damit ein Kauf die App freischaltet, muss der Plus-Status vom Konto gelesen werden (`isPlus` im Store). Achtung: Apple und Google verlangen für digitale Inhalte in vielen Ländern In-App-Käufe (z. B. über RevenueCat). Das sollte vor der Store-Einreichung geklärt werden. In Entwicklungs-Builds lässt sich Plus unter Konto → „Entwicklung: Plus simulieren“ testen.
- **Credits einlösen:** Prämien werden angezeigt und verlinken auf mylivo.app/credits. Eingelöst werden kann erst, wenn die Credits mit dem Konto synchronisiert werden.
- **Scanner** (mylivo.app/scannen) und die englische Sprachversion sind noch nicht umgesetzt.
