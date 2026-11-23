import { useColorScheme } from 'react-native';

import { useLivoStore } from '@/store/useLivoStore';

/** Farben aus dem Designsystem von mylivo.app (Primär-Rot, Logo-Türkis, Schilderfarben). */
const light = {
  bg: '#ffffff',
  surface: '#ffffff',
  surfaceAlt: '#f0f2f5',
  text: '#090909',
  textMuted: '#606369',
  border: '#e3e5e8',
  primary: '#f5312c',
  primaryPressed: '#d9221d',
  primarySoft: '#feebea',
  onPrimary: '#fcfcfc',
  teal: '#73c0ba',
  tealSoft: '#e6f4f3',
  tealText: '#2b7f78',
  success: '#54b66e',
  successSoft: '#e7f5eb',
  successText: '#23733c',
  danger: '#e62b34',
  dangerSoft: '#fdeaea',
  dangerText: '#b3141c',
  warning: '#f9cc21',
  warningSoft: '#fff7d9',
  overlay: 'rgba(9, 9, 9, 0.45)',
};

export type Colors = typeof light;

const dark: Colors = {
  bg: '#060606',
  surface: '#111111',
  surfaceAlt: '#1a1a1a',
  text: '#f8f8f8',
  textMuted: '#9e9e9e',
  border: '#262626',
  primary: '#ff4037',
  primaryPressed: '#e7322a',
  primarySoft: '#3a1311',
  onPrimary: '#fcfcfc',
  teal: '#73c0ba',
  tealSoft: '#12302d',
  tealText: '#8fd3cc',
  success: '#54b66e',
  successSoft: '#11281a',
  successText: '#86d69c',
  danger: '#ff5a5f',
  dangerSoft: '#3a1214',
  dangerText: '#ff8a8e',
  warning: '#f9cc21',
  warningSoft: '#33290a',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const Fonts = {
  display: 'Unbounded_700Bold',
  displayMedium: 'Unbounded_500Medium',
  body: 'Manrope_500Medium',
  bodySemi: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
  bodyExtra: 'Manrope_800ExtraBold',
} as const;

export const Radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;
export const Space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const MAX_CONTENT_WIDTH = 720;

export function useTheme() {
  const system = useColorScheme();
  const pref = useLivoStore((s) => s.themePref);
  const isDark = pref === 'system' ? system === 'dark' : pref === 'dark';
  return { c: isDark ? dark : light, isDark };
}
