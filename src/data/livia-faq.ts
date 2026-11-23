/**
 * Kuratierte Wissensbasis für Livia im Offline-Modus.
 * `keywords` enthalten auch umgangssprachliche Begriffe, nach denen Lernende suchen.
 */
export interface FaqEntry {
  id: string;
  title: string;
  keywords: string[];
  answer: string;
  related?: string[]; // Fragen-IDs
}

export const LIVIA_FAQ: FaqEntry[] = [
  {
    id: 'rechts-vor-links',
    title: 'Rechts vor links',
    keywords: ['rechts vor links', 'vorfahrt', 'kreuzung', 'einmündung', 'wer darf zuerst', 'ohne schild'],
    answer:
      'Wenn an einer Kreuzung oder Einmündung nichts geregelt ist – keine Polizei, keine Ampel, kein Schild – gilt „rechts vor links“. Wer von rechts kommt, fährt zuerst, egal ob er geradeaus fährt oder abbiegt. Achte besonders in Wohngebieten und Tempo-30-Zonen darauf.',
    related: ['vor-01', 'vor-02'],
  },
  {
    id: 'rangfolge',
    title: 'Rangfolge der Regelungen',
    keywords: ['rangfolge', 'reihenfolge', 'polizei', 'ampel', 'schild', 'was gilt zuerst', 'vorrang'],
    answer:
      'Die Rangfolge lautet: Polizei vor Ampel vor Verkehrszeichen vor allgemeinen Regeln. Ein Beispiel: Zeigt die Ampel Grün, ignorierst du das „Vorfahrt gewähren“-Schild darunter. Fällt die Ampel aus, gilt wieder das Schild.',
    related: ['vor-02', 'vor-03'],
  },
  {
    id: 'anhalteweg',
    title: 'Reaktionsweg, Bremsweg, Anhalteweg',
    keywords: ['bremsweg', 'reaktionsweg', 'anhalteweg', 'faustformel', 'formel', 'berechnen', 'rechnen', 'meter'],
    answer:
      'Die drei Faustformeln:\n• Reaktionsweg = (Tempo ÷ 10) × 3\n• Bremsweg = (Tempo ÷ 10)² – bei einer Gefahrbremsung die Hälfte\n• Anhalteweg = Reaktionsweg + Bremsweg\n\nBeispiel 50 km/h: 15 m + 25 m = 40 m. Beispiel 100 km/h: 30 m + 100 m = 130 m.',
    related: ['ver-05', 'ver-06', 'ver-07', 'ver-08'],
  },
  {
    id: 'tempolimits',
    title: 'Tempolimits',
    keywords: ['tempo', 'geschwindigkeit', 'höchstgeschwindigkeit', 'km/h', 'innerorts', 'außerorts', 'autobahn', 'wie schnell', 'limit'],
    answer:
      'Die wichtigsten Grenzen für Pkw:\n• Innerorts: 50 km/h\n• Außerorts: 100 km/h\n• Autobahn: kein Limit, Richtgeschwindigkeit 130 km/h\n• Mit Anhänger außerorts: 80 km/h\n• Schneeketten oder Sicht unter 50 m: höchstens 50 km/h',
    related: ['ver-01', 'ver-02', 'ver-03', 'ver-20'],
  },
  {
    id: 'abstand',
    title: 'Sicherheitsabstand',
    keywords: ['abstand', 'halber tacho', 'zwei sekunden', 'auffahren', 'dicht'],
    answer:
      'Außerorts gilt: halber Tacho in Metern – bei 100 km/h also 50 m. Leichter zu prüfen ist die Zwei-Sekunden-Regel: Zähl „einundzwanzig, zweiundzwanzig“, sobald dein Vordermann an einem Leitpfosten vorbeifährt. Bei Nässe oder Glätte vergrößerst du den Abstand.',
    related: ['ver-04'],
  },
  {
    id: 'ueberholen',
    title: 'Überholen',
    keywords: ['überholen', 'überholverbot', 'seitenabstand', 'radfahrer überholen', '1,5 m', '2 m'],
    answer:
      'Überholen darfst du nur, wenn du die Strecke überblickst und niemanden gefährdest. Verboten ist es bei unklarer Lage, wenn hinter dir schon jemand überholt, am Zebrastreifen und bei Überholverbot. Radfahrer überholst du innerorts mit mindestens 1,5 m, außerorts mit mindestens 2 m Seitenabstand.',
    related: ['ver-09', 'ver-10', 'ver-11', 'zei-06'],
  },
  {
    id: 'kreisverkehr',
    title: 'Kreisverkehr',
    keywords: ['kreisverkehr', 'kreisel', 'blinken', 'blinker', 'rondell'],
    answer:
      'Im Kreisverkehr mit „Vorfahrt gewähren“ hat der Verkehr im Kreis Vorfahrt. Beim Einfahren blinkst du nicht, beim Ausfahren immer rechts. Halten auf der Kreisfahrbahn ist verboten.',
    related: ['vor-08', 'vor-09'],
  },
  {
    id: 'abbiegen',
    title: 'Abbiegen',
    keywords: ['abbiegen', 'linksabbieger', 'rechtsabbieger', 'gegenverkehr', 'schulterblick', 'toter winkel', 'straßenbahn'],
    answer:
      'Beim Linksabbiegen lässt du den Gegenverkehr durch – auch Straßenbahnen, die neben dir in deine Richtung fahren. Beim Rechtsabbiegen haben Radfahrende auf dem Radweg geradeaus Vorrang: Schulterblick nicht vergessen! Fußgängern, die die Straße überqueren, in die du einbiegst, lässt du ebenfalls den Vortritt.',
    related: ['vor-06', 'vor-07', 'vor-14', 'vor-15'],
  },
  {
    id: 'ampel',
    title: 'Ampel und Grünpfeil',
    keywords: ['ampel', 'gelb', 'rot', 'grün', 'lichtzeichen', 'grünpfeil', 'grüner pfeil'],
    answer:
      'Gelb bedeutet: vor der Kreuzung warten, wenn du gefahrlos anhalten kannst. Rot-Gelb kündigt Grün an – losfahren darfst du erst bei Grün. Beim Grünpfeil-Schild darfst du bei Rot rechts abbiegen, aber erst nach vollständigem Halt und ohne Fußgänger oder Radfahrer zu behindern.',
    related: ['vor-04', 'vor-05'],
  },
  {
    id: 'zebrastreifen',
    title: 'Fußgängerüberweg',
    keywords: ['zebrastreifen', 'fußgängerüberweg', 'fußgänger', 'überweg'],
    answer:
      'Am Zebrastreifen musst du Fußgängern, die erkennbar hinüberwollen, das Überqueren ermöglichen. Fahr mit mäßiger Geschwindigkeit heran, überhol dort nicht und halte nicht auf dem Überweg oder bis 5 m davor.',
    related: ['gef-14', 'ver-18'],
  },
  {
    id: 'halten-parken',
    title: 'Halten und Parken',
    keywords: ['parken', 'halten', 'haltverbot', 'parkverbot', 'drei minuten', '3 minuten', 'bushaltestelle'],
    answer:
      'Du parkst, sobald du das Auto verlässt oder länger als drei Minuten hältst. Parkverbot gilt u. a. 5 m vor und hinter Kreuzungen, 15 m vor und hinter Haltestellenschildern und vor Bordsteinabsenkungen. Beim absoluten Haltverbot (rotes Kreuz) darfst du gar nicht halten, beim eingeschränkten (ein Schrägbalken) bis zu drei Minuten.',
    related: ['ver-16', 'ver-17', 'ver-19', 'zei-04', 'zei-05'],
  },
  {
    id: 'nebel',
    title: 'Nebel und Sicht',
    keywords: ['nebel', 'nebelschlussleuchte', 'sicht', 'sichtweite', 'nebelscheinwerfer', 'leitpfosten'],
    answer:
      'Bei Sicht unter 50 m durch Nebel, Regen oder Schnee darfst du höchstens 50 km/h fahren. Die Nebelschlussleuchte ist nur bei Nebel und Sicht unter 50 m erlaubt. Tipp: Leitpfosten stehen meist 50 m auseinander.',
    related: ['gef-09', 'gef-10'],
  },
  {
    id: 'aquaplaning',
    title: 'Aquaplaning',
    keywords: ['aquaplaning', 'regen', 'wasser', 'aufschwimmen', 'nass'],
    answer:
      'Beim Aquaplaning schwimmen die Reifen auf einem Wasserfilm auf. Geh vom Gas bzw. kuppel aus, halte das Lenkrad gerade und bremse nicht. Vorbeugen kannst du mit angepasster Geschwindigkeit und ausreichend Profil.',
    related: ['gef-05', 'gef-06'],
  },
  {
    id: 'alkohol',
    title: 'Alkohol',
    keywords: ['alkohol', 'promille', 'bier', 'trinken', 'betrunken', '0,5', 'probezeit alkohol'],
    answer:
      'In der Probezeit und bis 21 gilt 0,0 Promille. Danach ist Fahren ab 0,5 Promille eine Ordnungswidrigkeit, ab 0,3 Promille mit Ausfallerscheinungen oder Unfall eine Straftat, ab 1,1 Promille immer eine Straftat. Sicher ist nur: Wer fährt, trinkt nicht.',
    related: ['fah-01', 'fah-02'],
  },
  {
    id: 'probezeit',
    title: 'Probezeit und Punkte',
    keywords: ['probezeit', 'punkte', 'flensburg', 'fahreignungsregister', 'aufbauseminar', 'führerschein weg', 'entzug'],
    answer:
      'Die Probezeit dauert zwei Jahre. Ein A-Verstoß oder zwei B-Verstöße bedeuten Aufbauseminar und Verlängerung auf vier Jahre. Im Fahreignungsregister gilt: 4–5 Punkte Ermahnung, 6–7 Verwarnung, ab 8 Punkten Entzug der Fahrerlaubnis.',
    related: ['fah-03', 'fah-04'],
  },
  {
    id: 'handy',
    title: 'Handy am Steuer',
    keywords: ['handy', 'smartphone', 'telefonieren', 'mobiltelefon', 'navi', 'whatsapp'],
    answer:
      'Du darfst elektronische Geräte beim Fahren nicht in die Hand nehmen – auch nicht an der roten Ampel oder mit Start-Stopp-Automatik. Erlaubt sind Freisprecheinrichtung und Sprachsteuerung. In die Hand nehmen darfst du das Handy erst, wenn der Motor vollständig aus ist.',
    related: ['fah-05'],
  },
  {
    id: 'rettungsgasse',
    title: 'Rettungsgasse',
    keywords: ['rettungsgasse', 'stau', 'stockender verkehr', 'einsatzfahrzeug', 'blaulicht', 'martinshorn'],
    answer:
      'Die Rettungsgasse bildest du, sobald der Verkehr auf Autobahnen oder mehrspurigen Außerortsstraßen stockt. Wer ganz links fährt, weicht nach links aus, alle anderen nach rechts. Kommt ein Einsatzfahrzeug mit Blaulicht und Martinshorn, schaffst du sofort freie Bahn.',
    related: ['ver-12', 'ver-22'],
  },
  {
    id: 'reissverschluss',
    title: 'Reißverschlussverfahren',
    keywords: ['reißverschluss', 'einfädeln', 'verengung', 'baustelle', 'fahrstreifen endet'],
    answer:
      'Endet ein Fahrstreifen, fährst du bis unmittelbar vor die Engstelle und fädelst dort abwechselnd ein – je ein Fahrzeug von jeder Spur. Früh einscheren ist gut gemeint, verlängert aber den Stau.',
    related: ['ver-13'],
  },
  {
    id: 'reifen',
    title: 'Reifen',
    keywords: ['reifen', 'profil', 'profiltiefe', 'winterreifen', 'sommerreifen', 'reifendruck', 'alpine', 'm+s'],
    answer:
      'Gesetzlich vorgeschrieben sind 1,6 mm Profil, empfohlen werden 3 mm (Sommer) bzw. 4 mm (Winter). Bei Glatteis, Schnee, Schneematsch oder Reifglätte brauchst du Reifen mit Alpine-Symbol. Den Reifendruck prüfst du regelmäßig bei kalten Reifen.',
    related: ['tec-01', 'tec-02', 'tec-03'],
  },
  {
    id: 'panne',
    title: 'Panne und Unfall',
    keywords: ['panne', 'unfall', 'warndreieck', 'warnweste', 'erste hilfe', 'notruf', '112', 'liegenbleiben'],
    answer:
      'Bei Panne oder Unfall: Warnblinklicht an, Warnweste anziehen, Unfallstelle absichern. Das Warndreieck stellst du innerorts etwa 50 m, außerorts etwa 100 m und auf der Autobahn etwa 200 m oder mehr hinter dem Fahrzeug auf. Dann Erste Hilfe leisten und den Notruf 112 wählen.',
    related: ['fah-06', 'fah-07', 'tec-04', 'tec-05'],
  },
  {
    id: 'kinder',
    title: 'Kinder und Ältere',
    keywords: ['kinder', 'kind', 'ball', 'schule', 'ältere', 'senioren', 'schulbus', 'bus'],
    answer:
      'Gegenüber Kindern, älteren und hilfsbedürftigen Menschen musst du so fahren, dass eine Gefährdung ausgeschlossen ist: langsamer, bremsbereit, mit Fehlern rechnen. An haltenden Bussen mit Warnblinklicht fährst du nur in Schrittgeschwindigkeit vorbei – auch im Gegenverkehr.',
    related: ['gef-01', 'gef-02', 'gef-07', 'gef-08'],
  },
  {
    id: 'wild',
    title: 'Wildwechsel',
    keywords: ['wild', 'reh', 'hirsch', 'wildschwein', 'wildwechsel', 'tier'],
    answer:
      'Taucht Wild auf: abblenden, hupen, kontrolliert bremsen und die Spur halten. Ein riskantes Ausweichmanöver ist meist gefährlicher als ein Zusammenstoß mit kleinem Wild.',
    related: ['gef-03'],
  },
  {
    id: 'muedigkeit',
    title: 'Müdigkeit',
    keywords: ['müde', 'müdigkeit', 'sekundenschlaf', 'pause', 'gähnen', 'medikamente'],
    answer:
      'Warnzeichen sind Gähnen, brennende Augen und Erinnerungslücken. Dann hilft nur eine Pause mit Schlaf – Kaffee und frische Luft wirken nur kurz. Auch Medikamente können die Fahrtüchtigkeit beeinträchtigen: Lies den Beipackzettel.',
    related: ['gef-04', 'gef-12'],
  },
  {
    id: 'umwelt',
    title: 'Spritsparend fahren',
    keywords: ['umwelt', 'sprit', 'kraftstoff', 'verbrauch', 'sparen', 'motor abstellen', 'co2', 'lärm'],
    answer:
      'Spritsparend fährst du mit niedriger Drehzahl, frühem Hochschalten und vorausschauendem Rollenlassen. Dachträger abnehmen, Reifendruck prüfen und bei längeren Wartezeiten den Motor abstellen. Warmlaufenlassen im Stand ist verboten.',
    related: ['umw-01', 'umw-02', 'umw-03', 'umw-04'],
  },
  {
    id: 'pruefung',
    title: 'Theorieprüfung',
    keywords: ['prüfung', 'theorieprüfung', 'fehlerpunkte', 'bestehen', 'bestanden', 'durchfallen', 'tüv', 'dekra', 'wie viele fragen'],
    answer:
      'In der Theorieprüfung Klasse B beantwortest du 30 Fragen (20 Grundstoff, 10 Zusatzstoff). Du darfst maximal 10 Fehlerpunkte haben – aber zwei falsche 5-Punkte-Fragen bedeuten „nicht bestanden“. In Livo kannst du unter „Prüfung“ beliebig oft eine Simulation starten.',
    related: [],
  },
  {
    id: 'schilder-system',
    title: 'Verkehrszeichen-System',
    keywords: ['verkehrszeichen', 'schild', 'schilder', 'zeichen', 'form', 'farbe', 'dreieck', 'rund', 'blau'],
    answer:
      'Form und Farbe verraten die Bedeutung: Rote Dreiecke warnen (Gefahrzeichen). Runde Schilder mit rotem Rand verbieten, runde blaue gebieten. Rechteckige Schilder sind Richtzeichen und geben Hinweise. Sonderformen: Stopp-Achteck, Vorfahrt-gewähren-Dreieck auf der Spitze und die Vorfahrtstraßen-Raute.',
    related: ['zei-15', 'zei-16'],
  },
  {
    id: 'credits',
    title: 'Credits',
    keywords: ['credits', 'punkte sammeln', 'belohnung', 'prämie', 'auszahlung', 'rabatt'],
    answer:
      'Für jede richtig beantwortete Frage bekommst du 2 Credits – einmal pro Frage. Deine Credits kannst du auf mylivo.app gegen Rabatte, Livo Plus oder Auszahlungen eintauschen. Deinen Stand siehst du im Tab „Konto“.',
  },
];
