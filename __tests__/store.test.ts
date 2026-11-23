jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import { initialState, useLivoStore } from '@/store/useLivoStore';

beforeEach(() => {
  useLivoStore.setState({ ...initialState });
});

describe('Store', () => {
  it('vergibt 2 Credits pro richtiger Antwort – einmal pro Frage', () => {
    const { recordAnswer } = useLivoStore.getState();
    expect(recordAnswer('vor-01', true)).toBe(2);
    expect(recordAnswer('vor-01', true)).toBe(0);
    expect(recordAnswer('vor-02', false)).toBe(0);
    expect(recordAnswer('vor-02', true)).toBe(2);
    const s = useLivoStore.getState();
    expect(s.credits).toBe(4);
    expect(s.progress['vor-01'].seen).toBe(2);
    expect(Object.values(s.activity).reduce((a, b) => a + b, 0)).toBe(4);
  });

  it('markiert und entmarkiert Fragen', () => {
    const { toggleMark } = useLivoStore.getState();
    toggleMark('gef-01');
    expect(useLivoStore.getState().marked).toEqual(['gef-01']);
    toggleMark('gef-01');
    expect(useLivoStore.getState().marked).toEqual([]);
  });

  it('begrenzt KI-Nachrichten ohne Plus', () => {
    const { consumeLiviaMessage } = useLivoStore.getState();
    expect(consumeLiviaMessage(2)).toBe(true);
    expect(consumeLiviaMessage(2)).toBe(true);
    expect(consumeLiviaMessage(2)).toBe(false);
    useLivoStore.getState().setPlus(true);
    expect(useLivoStore.getState().consumeLiviaMessage(2)).toBe(true);
  });

  it('behält Credits beim Zurücksetzen des Lernfortschritts', () => {
    useLivoStore.getState().recordAnswer('vor-01', true);
    useLivoStore.getState().resetProgress();
    const s = useLivoStore.getState();
    expect(s.progress).toEqual({});
    expect(s.credits).toBe(2);
  });
});
