import { QUESTION_BY_ID } from '@/data/questions';
import { answerOffline, explainQuestion, tokenize } from '@/lib/livia';

describe('Livia offline', () => {
  it('normalisiert Umlaute und entfernt Füllwörter', () => {
    expect(tokenize('Wie funktioniert die Vorfahrt?')).toEqual(['funktioniert', 'vorfahrt']);
    expect(tokenize('Überholen')).toEqual(['ueberhol']);
  });

  it.each([
    ['Wie berechne ich den Bremsweg?', 'Reaktionsweg'],
    ['Muss ich im Kreisel blinken?', 'Kreisverkehr'],
    ['Wie viel Promille darf ich in der Probezeit haben?', '0,0 Promille'],
    ['Wann darf ich die Nebelschlussleuchte benutzen?', '50 m'],
    ['Wie bilde ich eine Rettungsgasse?', 'ganz links'],
    ['Darf ich an der Ampel aufs Handy schauen?', 'Motor'],
    ['Wer hat Vorfahrt, wenn kein Schild da ist?', 'rechts vor links'],
  ])('beantwortet „%s“', (q, expected) => {
    const reply = answerOffline(q);
    expect(reply.text).toContain(expected);
    expect(reply.source).toBe('offline');
  });

  it('liefert passende Übungsfragen mit', () => {
    const reply = answerOffline('Bremsweg bei 100 km/h');
    expect(reply.related.length).toBeGreaterThan(0);
    for (const id of reply.related) expect(QUESTION_BY_ID[id]).toBeDefined();
  });

  it('gibt bei Unbekanntem einen Hinweis statt zu raten', () => {
    expect(answerOffline('Wie backe ich einen Kuchen?').text).toContain('keine passende Erklärung');
  });

  it('begrüßt freundlich', () => {
    expect(answerOffline('Hallo').text).toContain('Livia');
  });

  it('erklärt eine falsch beantwortete Frage', () => {
    const q = QUESTION_BY_ID['gef-01'];
    const text = explainQuestion(q, { selected: ['a', 'b'] });
    expect(text).toContain('Richtig ist');
    expect(text).toContain('Nicht richtig war');
    expect(text).toContain('Gefehlt hat');
  });
});
