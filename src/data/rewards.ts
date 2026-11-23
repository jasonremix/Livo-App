import type { Reward } from './types';

/** Credits-Prämien, wie auf mylivo.app/credits beschrieben. */
export const CREDITS_PER_CORRECT_ANSWER = 2;

export const REWARDS: Reward[] = [
  { id: 'discount-10', title: '10 % Rabatt', cost: 100, kind: 'discount' },
  { id: 'discount-25', title: '25 % Rabatt', cost: 220, kind: 'discount' },
  { id: 'plus-30', title: '30 Tage Livo Plus gratis', cost: 300, kind: 'plus' },
  { id: 'discount-50', title: '50 % Rabatt', cost: 400, kind: 'discount' },
  { id: 'payout-10', title: '10 € Auszahlung', cost: 750, kind: 'payout' },
  { id: 'plus-180', title: '180 Tage Livo Plus gratis', cost: 900, kind: 'plus' },
  { id: 'payout-25', title: '25 € Auszahlung', cost: 1800, kind: 'payout' },
  { id: 'license-100', title: '100 € für deinen Führerschein', cost: 6500, kind: 'payout' },
];
