import {
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { Unbounded_500Medium, Unbounded_700Bold } from '@expo-google-fonts/unbounded';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useLivoStore } from '@/store/useLivoStore';
import { Fonts, useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    Unbounded_500Medium,
    Unbounded_700Bold,
  });
  const hydrated = useLivoStore((s) => s.hasHydrated);
  const { c, isDark } = useTheme();
  const ready = (fontsLoaded || !!fontError) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: { ...base.colors, primary: c.primary, background: c.bg, card: c.bg, text: c.text, border: c.border },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: c.bg },
          headerTintColor: c.text,
          headerTitleStyle: { fontFamily: Fonts.bodyExtra },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: c.bg },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Livo' }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, title: 'Willkommen' }} />
        <Stack.Screen name="quiz" options={{ headerShown: false, title: 'Üben' }} />
        <Stack.Screen name="exam" options={{ headerShown: false, gestureEnabled: false, title: 'Prüfung' }} />
        <Stack.Screen name="exam-result" options={{ title: 'Ergebnis' }} />
        <Stack.Screen name="kurs/[courseId]" options={{ title: 'Kurs' }} />
        <Stack.Screen name="modul/[moduleId]" options={{ title: 'Lernmodul' }} />
        <Stack.Screen name="credits" options={{ title: 'Credits' }} />
        <Stack.Screen name="plus" options={{ presentation: 'modal', headerShown: false, title: 'Livo Plus' }} />
      </Stack>
    </ThemeProvider>
  );
}
