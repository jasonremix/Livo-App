import type { Course, CourseModule } from './types';

/**
 * Die vier Kurse von mylivo.app/kurse mit je drei Lernmodulen.
 * Das erste Modul jedes Kurses ist kostenlos, alle weiteren sind in Livo Plus enthalten.
 */
export const COURSES: Course[] = [
  {
    id: 'grundlagen',
    title: 'Grundlagen im Straßenverkehr',
    tagline: 'Die Regeln, auf denen alles aufbaut.',
    icon: 'school-outline',
    modules: [
      {
        id: 'grundlagen-1',
        title: 'Rücksicht, Vorsicht, Rechtsfahrgebot',
        minutes: 8,
        summary: 'Warum § 1 StVO die wichtigste Regel ist und wie du dich auf der Fahrbahn einordnest.',
        sections: [
          {
            heading: 'Die Grundregel: § 1 StVO',
            body: 'Die Teilnahme am Straßenverkehr erfordert ständige Vorsicht und gegenseitige Rücksicht. Niemand darf geschädigt, gefährdet oder mehr als unvermeidbar behindert oder belästigt werden. Diese zwei Sätze stehen über allen anderen Regeln – auch wer Vorfahrt hat, muss einen Unfall vermeiden, wenn er kann.',
          },
          {
            heading: 'Rechtsfahrgebot',
            body: 'Du fährst möglichst weit rechts – nicht nur bei Gegenverkehr, beim Überholtwerden, an Kuppen und in Kurven, sondern grundsätzlich (§ 2 StVO). Auf Autobahnen und mehrspurigen Straßen heißt das: Der rechte Fahrstreifen ist dein Standard, die linken nutzt du zum Überholen.',
          },
          {
            heading: 'Besonders schützenswert',
            body: 'Kinder, ältere und hilfsbedürftige Menschen genießen besonderen Schutz. Ihnen gegenüber musst du dich so verhalten, dass eine Gefährdung ausgeschlossen ist: langsamer fahren, bremsbereit sein und mit Fehlern rechnen (§ 3 Abs. 2a StVO).',
          },
          {
            heading: 'Sehen und gesehen werden',
            body: 'Regelmäßige Spiegelblicke, der Schulterblick vor jedem Spurwechsel und rechtzeitiges Blinken machen dein Verhalten für andere vorhersehbar. Wer vorausschauend fährt, muss seltener stark bremsen und hat mehr Zeit für Unerwartetes.',
          },
        ],
        takeaways: [
          '§ 1 StVO: ständige Vorsicht und gegenseitige Rücksicht.',
          'Rechts fahren ist der Normalfall – auch auf der Autobahn.',
          'Kinder, Ältere und Hilfsbedürftige: Gefährdung ausschließen.',
        ],
        quiz: ['gef-01', 'gef-15', 'ver-14'],
      },
      {
        id: 'grundlagen-2',
        title: 'Geschwindigkeit & Anhalteweg',
        minutes: 8,
        summary: 'Tempolimits, Faustformeln und warum doppelte Geschwindigkeit viermal so viel Bremsweg bedeutet.',
        sections: [
          {
            heading: 'Die wichtigsten Tempolimits',
            body: 'Innerorts gilt für alle Kraftfahrzeuge 50 km/h, außerorts für Pkw 100 km/h. Auf Autobahnen gibt es für Pkw kein allgemeines Limit, aber eine Richtgeschwindigkeit von 130 km/h. Mit Anhänger sind außerorts 80 km/h erlaubt, mit Schneeketten höchstens 50 km/h, bei Sicht unter 50 m ebenfalls 50 km/h.',
            signs: ['310', '274-50', '380'],
          },
          {
            heading: 'Reaktionsweg',
            body: 'Bis du eine Gefahr erkennst und bremst, vergeht etwa eine Sekunde – so lange fährst du ungebremst weiter. Faustformel: (Geschwindigkeit ÷ 10) × 3. Bei 50 km/h sind das 15 m, bei 100 km/h schon 30 m.',
          },
          {
            heading: 'Bremsweg',
            body: 'Normale Bremsung: (Geschwindigkeit ÷ 10)². Bei 50 km/h also 25 m, bei 100 km/h 100 m. Bei einer Gefahrbremsung halbierst du den Wert. Weil die Geschwindigkeit im Quadrat eingeht, vervierfacht sich der Bremsweg bei doppelter Geschwindigkeit.',
          },
          {
            heading: 'Anhalteweg = Reaktionsweg + Bremsweg',
            body: 'Bei 50 km/h: 15 m + 25 m = 40 m. Bei 100 km/h: 30 m + 100 m = 130 m. Auf nasser oder glatter Straße wird der Bremsweg deutlich länger – passe deine Geschwindigkeit an Sicht, Straße und Wetter an.',
          },
          {
            heading: 'Abstand halten',
            body: 'Außerorts gilt als Faustregel: halber Tacho in Metern, also bei 100 km/h 50 m. Praktischer ist die Zwei-Sekunden-Regel – zähl „einundzwanzig, zweiundzwanzig“, nachdem dein Vordermann an einem festen Punkt vorbeigefahren ist.',
          },
        ],
        takeaways: [
          'Reaktionsweg: (v ÷ 10) × 3',
          'Bremsweg: (v ÷ 10)² – Gefahrbremsung: halbieren',
          'Doppelte Geschwindigkeit = vierfacher Bremsweg',
          'Abstand: halber Tacho oder zwei Sekunden',
        ],
        quiz: ['ver-05', 'ver-06', 'ver-07', 'ver-08'],
      },
      {
        id: 'grundlagen-3',
        title: 'Halten & Parken',
        minutes: 8,
        summary: 'Wo du halten darfst, wo nicht – und ab wann Halten zu Parken wird.',
        sections: [
          {
            heading: 'Halten oder Parken?',
            body: 'Du parkst, sobald du dein Fahrzeug verlässt oder länger als drei Minuten hältst – egal, ob der Motor läuft (§ 12 Abs. 2 StVO). Diese Grenze ist wichtig, denn an vielen Stellen ist Halten erlaubt, Parken aber verboten.',
          },
          {
            heading: 'Haltverbote',
            body: 'Nicht halten darfst du u. a. an engen und unübersichtlichen Stellen, im Bereich scharfer Kurven, auf Fußgängerüberwegen und bis 5 m davor, auf Bahnübergängen und dort, wo das Zeichen 283 steht. Beim Zeichen 286 darfst du bis zu drei Minuten halten – zum Ein- und Aussteigen oder Be- und Entladen auch länger.',
            signs: ['283', '286'],
          },
          {
            heading: 'Parkverbote',
            body: 'Parken ist verboten bis 5 m vor und hinter Kreuzungen und Einmündungen, bis 15 m vor und hinter Haltestellenschildern, vor Grundstücksein- und -ausfahrten und vor Bordsteinabsenkungen. Außerorts darfst du auf der Fahrbahn einer Vorfahrtstraße nicht parken.',
            signs: ['306'],
          },
          {
            heading: 'Richtig parken',
            body: 'Geparkt wird am rechten Fahrbahnrand oder auf gekennzeichneten Flächen (Zeichen 314). Lass Platz für andere, sichere das Fahrzeug gegen Wegrollen und achte beim Aussteigen auf Radfahrer – der „holländische Griff“ mit der rechten Hand zwingt dich zum Schulterblick.',
            signs: ['314'],
          },
        ],
        takeaways: [
          'Parken: Fahrzeug verlassen oder länger als 3 Minuten halten.',
          'Zebrastreifen: Haltverbot auf dem Überweg und 5 m davor.',
          'Kreuzungen 5 m, Haltestellen 15 m – Parkverbot.',
        ],
        quiz: ['ver-16', 'ver-17', 'ver-18', 'zei-05'],
      },
    ],
  },
  {
    id: 'vorfahrt',
    title: 'Vorfahrt sicher meistern',
    tagline: 'Wer zuerst fährt – in jeder Situation.',
    icon: 'git-merge-outline',
    modules: [
      {
        id: 'vorfahrt-1',
        title: 'Rangfolge & rechts vor links',
        minutes: 8,
        summary: 'Polizei, Ampel, Schild, Regel – in dieser Reihenfolge entscheidest du.',
        sections: [
          {
            heading: 'Die Rangfolge',
            body: 'An jeder Kreuzung gilt: Zeichen und Weisungen der Polizei vor Ampeln, Ampeln vor Verkehrszeichen, Verkehrszeichen vor den allgemeinen Regeln. Zeigt die Ampel Grün, spielt das Vorfahrtsschild darunter also keine Rolle – fällt sie aus, gilt wieder das Schild.',
          },
          {
            heading: 'Rechts vor links',
            body: 'Gibt es keine Regelung, hat Vorfahrt, wer von rechts kommt (§ 8 StVO). Das gilt an Kreuzungen und Einmündungen, egal ob du geradeaus fährst oder abbiegst. Typisch in Wohngebieten und Tempo-30-Zonen.',
          },
          {
            heading: 'Zeichen der Polizei',
            body: 'Seitlich ausgestreckte Arme quer zu deiner Fahrtrichtung bedeuten „Halt vor der Kreuzung“ – du siehst also Brust oder Rücken des Beamten. Der Verkehr parallel zu den Armen hat frei. Ein erhobener Arm bedeutet „Vorsicht, auf das nächste Zeichen warten“.',
          },
          {
            heading: 'Die Ampel richtig lesen',
            body: 'Grün: Fahrt frei. Gelb: Vor der Kreuzung auf das nächste Zeichen warten, wenn du gefahrlos anhalten kannst. Rot: Halt. Rot und Gelb zusammen kündigen Grün an – du darfst aber erst bei Grün fahren. Ein Grünpfeil-Schild erlaubt das Rechtsabbiegen nach vorherigem Anhalten.',
          },
        ],
        takeaways: [
          'Polizei > Ampel > Verkehrszeichen > allgemeine Regeln',
          'Ohne Regelung: rechts vor links',
          'Grünpfeil: erst anhalten, dann vorsichtig abbiegen',
        ],
        quiz: ['vor-01', 'vor-02', 'vor-03', 'vor-05'],
      },
      {
        id: 'vorfahrt-2',
        title: 'Vorfahrtszeichen',
        minutes: 8,
        summary: 'Die fünf Schilder, die Vorfahrt regeln – und woran du sie sofort erkennst.',
        sections: [
          {
            heading: 'Vorfahrt gewähren',
            body: 'Das auf der Spitze stehende Dreieck (Zeichen 205) verlangt, dass du den Querverkehr durchlässt. Anhalten musst du nur, wenn es nötig ist. Durch seine Form erkennst du es auch von hinten oder verschneit.',
            signs: ['205'],
          },
          {
            heading: 'Halt. Vorfahrt gewähren',
            body: 'Am Stoppschild (Zeichen 206) hältst du immer vollständig an der Haltlinie – auch wenn die Straße frei ist. Das Achteck ist weltweit einheitlich.',
            signs: ['206'],
          },
          {
            heading: 'Vorfahrt an der nächsten Kreuzung',
            body: 'Zeichen 301 gibt dir Vorfahrt nur an der nächsten Kreuzung oder Einmündung. Danach musst du neu schauen, was gilt.',
            signs: ['301'],
          },
          {
            heading: 'Vorfahrtstraße und ihr Ende',
            body: 'Die gelbe Raute (Zeichen 306) gibt dir Vorfahrt an allen folgenden Kreuzungen, bis Zeichen 307 die Vorfahrtstraße beendet. Außerorts gilt auf der Fahrbahn einer Vorfahrtstraße Parkverbot.',
            signs: ['306', '307'],
          },
        ],
        takeaways: [
          'Dreieck auf der Spitze: Vorfahrt gewähren',
          'Stopp: immer anhalten – auch bei freier Straße',
          'Raute: Vorfahrtstraße bis zum Ende-Zeichen',
        ],
        quiz: ['vor-10', 'vor-11', 'vor-12', 'vor-13'],
      },
      {
        id: 'vorfahrt-3',
        title: 'Abbiegen, Kreisverkehr & Vorrang',
        minutes: 8,
        summary: 'Gegenverkehr, Radfahrer, Fußgänger, Straßenbahn und der Kreisverkehr.',
        sections: [
          {
            heading: 'Links abbiegen',
            body: 'Linksabbieger lassen entgegenkommende Fahrzeuge durchfahren – auch wenn diese rechts abbiegen. Schienenfahrzeuge haben sogar dann Vorrang, wenn sie in derselben Richtung neben dir fahren (§ 9 Abs. 3 StVO).',
          },
          {
            heading: 'Rechts abbiegen',
            body: 'Radfahrende, die auf dem Radweg neben dir geradeaus fahren, haben Vorrang. Sie sind oft im toten Winkel – deshalb ist der Schulterblick nach rechts Pflicht.',
          },
          {
            heading: 'Fußgänger beim Abbiegen',
            body: 'Auf Fußgänger, die die Straße überqueren, in die du einbiegst, nimmst du besondere Rücksicht und wartest notfalls. Am Zebrastreifen musst du ihnen das Überqueren ermöglichen.',
          },
          {
            heading: 'Kreisverkehr',
            body: 'Steht vor dem Kreisverkehr „Vorfahrt gewähren“, hat der Verkehr im Kreis Vorfahrt. Beim Einfahren blinkst du nicht, beim Ausfahren immer rechts. Auf der Kreisfahrbahn ist Halten verboten.',
            signs: ['205'],
          },
          {
            heading: 'Bahnübergänge',
            body: 'Am Andreaskreuz haben Schienenfahrzeuge Vorrang. Nähere dich mit mäßiger Geschwindigkeit und halte bei Rotlicht, sich senkenden Schranken oder wenn ein Zug kommt.',
            signs: ['201'],
          },
        ],
        takeaways: [
          'Linksabbieger warten auf Gegenverkehr und Straßenbahnen.',
          'Rechtsabbieger: Schulterblick, Radfahrer zuerst.',
          'Kreisverkehr: rein ohne Blinker, raus mit Blinker rechts.',
        ],
        quiz: ['vor-06', 'vor-07', 'vor-08', 'vor-14'],
      },
    ],
  },
  {
    id: 'zeichen',
    title: 'Verkehrszeichen-System',
    tagline: 'Form und Farbe verraten die Bedeutung.',
    icon: 'triangle-outline',
    modules: [
      {
        id: 'zeichen-1',
        title: 'Gefahrzeichen',
        minutes: 7,
        summary: 'Rote Dreiecke warnen dich – meist 150 bis 250 m vor der Gefahr.',
        sections: [
          {
            heading: 'Form und Farbe',
            body: 'Gefahrzeichen sind Dreiecke mit roter Umrandung, deren Spitze nach oben zeigt. Sie fordern dich auf, die Geschwindigkeit anzupassen und besonders aufmerksam zu sein.',
            signs: ['101'],
          },
          {
            heading: 'Wo sie stehen',
            body: 'Außerorts stehen Gefahrzeichen in der Regel 150 bis 250 m vor der Gefahrstelle, innerorts kurz davor. Ein Zusatzzeichen kann eine andere Entfernung oder die Länge der Gefahrstrecke angeben.',
          },
          {
            heading: 'Sonderfälle',
            body: 'Zwei Zeichen tanzen aus der Reihe: Das Andreaskreuz (Zeichen 201) direkt vor Bahnübergängen und das Dreieck auf der Spitze (Zeichen 205), das kein Gefahrzeichen, sondern ein Vorschriftzeichen ist.',
            signs: ['201', '205'],
          },
        ],
        takeaways: [
          'Rotes Dreieck, Spitze oben = Gefahrzeichen',
          'Außerorts 150–250 m vor der Gefahrstelle',
          'Zusatzzeichen konkretisieren die Gefahr',
        ],
        quiz: ['zei-09', 'zei-15', 'vor-16'],
      },
      {
        id: 'zeichen-2',
        title: 'Vorschriftzeichen',
        minutes: 8,
        summary: 'Rund und rot verbietet, rund und blau gebietet.',
        sections: [
          {
            heading: 'Verbote: rot umrandet',
            body: 'Runde Zeichen mit rotem Rand verbieten etwas – etwa die Durchfahrt (Zeichen 250), die Einfahrt (Zeichen 267) oder eine höhere Geschwindigkeit (Zeichen 274).',
            signs: ['250', '267', '274-30'],
          },
          {
            heading: 'Überholverbot',
            body: 'Zeichen 276 verbietet das Überholen mehrspuriger Kraftfahrzeuge. Fahrräder und Motorräder ohne Beiwagen darfst du weiterhin überholen. Zeichen 282 hebt alle Streckenverbote wieder auf.',
            signs: ['276', '282'],
          },
          {
            heading: 'Haltverbote',
            body: 'Auf blauem Grund mit rotem Rand: Das rote Kreuz (Zeichen 283) verbietet jedes Halten, der einzelne Schrägbalken (Zeichen 286) erlaubt Halten bis drei Minuten.',
            signs: ['283', '286'],
          },
          {
            heading: 'Gebote: blau',
            body: 'Runde blaue Schilder schreiben dir etwas vor – zum Beispiel eine Fahrtrichtung (Zeichen 209).',
            signs: ['209'],
          },
        ],
        takeaways: [
          'Rund + rot umrandet = Verbot',
          'Rund + blau = Gebot',
          'Zeichen 282 hebt Streckenverbote auf',
        ],
        quiz: ['zei-01', 'zei-02', 'zei-06', 'zei-16'],
      },
      {
        id: 'zeichen-3',
        title: 'Richtzeichen',
        minutes: 8,
        summary: 'Rechteckige Schilder geben Hinweise – manche haben aber Regeln im Gepäck.',
        sections: [
          {
            heading: 'Hinweise mit Folgen',
            body: 'Richtzeichen sind meist rechteckig und geben Hinweise. Einige lösen trotzdem Regeln aus: Die gelbe Ortstafel (Zeichen 310) startet die Innerorts-Regeln, also z. B. 50 km/h.',
            signs: ['310'],
          },
          {
            heading: 'Parken und Sackgasse',
            body: 'Das weiße P (Zeichen 314) kennzeichnet Parkflächen. Zeichen 357 warnt vor einer Sackgasse – mit Fußgänger- oder Radsymbol ist sie für diese durchlässig.',
            signs: ['314', '357'],
          },
          {
            heading: 'Richtgeschwindigkeit',
            body: 'Zeichen 380 zeigt eine Richtgeschwindigkeit. Sie ist eine Empfehlung, kein Limit. Wer schneller fährt und in einen Unfall gerät, riskiert aber eine Mithaftung.',
            signs: ['380'],
          },
        ],
        takeaways: [
          'Rechteckig = Richtzeichen mit Hinweisen',
          'Ortstafel = Beginn der Innerorts-Regeln',
          'Richtgeschwindigkeit ist eine Empfehlung',
        ],
        quiz: ['zei-08', 'zei-11', 'zei-12', 'zei-14'],
      },
    ],
  },
  {
    id: 'pruefung',
    title: 'Prüfungstraining mit Livia',
    tagline: 'Gut vorbereitet in die Theorieprüfung.',
    icon: 'ribbon-outline',
    modules: [
      {
        id: 'pruefung-1',
        title: 'So läuft die Prüfung ab',
        minutes: 7,
        summary: '30 Fragen, Fehlerpunkte und die zwei Regeln, die über Bestehen entscheiden.',
        sections: [
          {
            heading: 'Aufbau',
            body: 'Für die Klasse B bekommst du 30 Fragen: 20 aus dem Grundstoff, der für alle Klassen gilt, und 10 aus dem Zusatzstoff der Klasse B. Die Prüfung findet am Computer statt – bei TÜV oder DEKRA. Für die Bearbeitung hast du in der Regel 45 Minuten.',
          },
          {
            heading: 'Fehlerpunkte',
            body: 'Jede Frage ist je nach Bedeutung für die Verkehrssicherheit 2 bis 5 Fehlerpunkte wert. Eine Frage gilt nur dann als richtig, wenn du alle richtigen und keine falsche Antwort angekreuzt hast.',
          },
          {
            heading: 'Wann du bestehst',
            body: 'Du darfst höchstens 10 Fehlerpunkte sammeln. Aber Achtung: Zwei falsch beantwortete 5-Punkte-Fragen bedeuten „nicht bestanden“ – obwohl das genau 10 Punkte sind.',
          },
          {
            heading: 'Zahlenfragen',
            body: 'Bei manchen Fragen trägst du eine Zahl ein, etwa einen Bremsweg oder eine Geschwindigkeit. Rechne mit den Faustformeln und prüfe die Einheit.',
          },
        ],
        takeaways: [
          '30 Fragen: 20 Grundstoff + 10 Klasse B',
          'Maximal 10 Fehlerpunkte',
          'Zwei falsche 5-Punkte-Fragen = nicht bestanden',
        ],
        quiz: ['ver-07', 'gef-09', 'fah-01'],
      },
      {
        id: 'pruefung-2',
        title: 'Fragen richtig lesen',
        minutes: 8,
        summary: 'Strategien, mit denen du Flüchtigkeitsfehler vermeidest.',
        sections: [
          {
            heading: 'Alle Antworten lesen',
            body: 'Oft sind mehrere Antworten richtig. Lies jede Antwort für sich und frag dich: Stimmt diese Aussage immer? Wörter wie „immer“, „nie“ oder „nur“ sind Hinweise, genau hinzuschauen.',
          },
          {
            heading: 'Bilder genau ansehen',
            body: 'Achte auf Schilder, Fahrbahnmarkierungen, Blinker und Spiegelbilder. Ein Detail am Bildrand kann die Antwort ändern.',
          },
          {
            heading: 'Sicherheit vor Bequemlichkeit',
            body: 'Wenn du unsicher bist, wähle das Verhalten, das niemanden gefährdet. Die Prüfung belohnt vorsichtiges, rücksichtsvolles Fahren – genau wie die Straße.',
          },
          {
            heading: 'Livia fragen',
            body: 'Hast du eine Frage falsch beantwortet, tippe auf „Frag Livia“. Livia erklärt dir die Regel dahinter, damit du sie dir nicht nur merkst, sondern verstehst.',
          },
        ],
        takeaways: [
          'Mehrere Antworten können richtig sein.',
          '„Immer“, „nie“, „nur“ – genau prüfen.',
          'Im Zweifel: das sicherste Verhalten wählen.',
        ],
        quiz: ['gef-03', 'ver-09', 'zei-06'],
      },
      {
        id: 'pruefung-3',
        title: 'Typische Fehlerfallen',
        minutes: 8,
        summary: 'Die Klassiker, bei denen in der Prüfung am häufigsten Punkte verloren gehen.',
        sections: [
          {
            heading: 'Gelb ist kein „schnell noch“',
            body: 'Gelb heißt: anhalten, wenn es gefahrlos möglich ist. Nur wer schon zu nah dran ist, fährt vorsichtig weiter.',
          },
          {
            heading: 'Nebelschlussleuchte',
            body: 'Nur bei Nebel und Sicht unter 50 m – nicht bei Regen, nicht bei Dunkelheit. Dann gilt auch höchstens 50 km/h.',
          },
          {
            heading: 'Blinken im Kreisverkehr',
            body: 'Rein ohne Blinker, raus mit Blinker rechts. Wer beim Einfahren links blinkt, verwirrt alle anderen.',
          },
          {
            heading: 'Alkohol in der Probezeit',
            body: '0,0 Promille – in der Probezeit und bis zum 21. Geburtstag. Die 0,5-Promille-Grenze gilt für dich noch nicht.',
          },
          {
            heading: 'Handy an der Ampel',
            body: 'Auch an der roten Ampel und mit Start-Stopp-Automatik darfst du das Handy nicht in die Hand nehmen. Erlaubt ist es erst bei komplett ausgeschaltetem Motor.',
          },
        ],
        takeaways: [
          'Gelb = anhalten, wenn gefahrlos möglich',
          'Nebelschlussleuchte nur unter 50 m Sicht im Nebel',
          'Probezeit: 0,0 Promille',
        ],
        quiz: ['vor-04', 'gef-10', 'vor-08', 'fah-05'],
      },
    ],
  },
];

export const ALL_MODULES: (CourseModule & { courseId: string; index: number })[] = COURSES.flatMap(
  (c) => c.modules.map((m, index) => ({ ...m, courseId: c.id, index })),
);

export function findModule(moduleId: string) {
  return ALL_MODULES.find((m) => m.id === moduleId);
}

/** Das erste Modul jedes Kurses ist kostenlos. */
export function isModuleFree(moduleId: string) {
  return findModule(moduleId)?.index === 0;
}
