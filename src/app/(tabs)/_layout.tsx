import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from '@/components/ui';
import { useLivoStore } from '@/store/useLivoStore';
import { Fonts, useTheme } from '@/theme';

const TABS: { name: string; title: string; icon: IconName; iconActive: IconName }[] = [
  { name: 'index', title: 'Start', icon: 'home-outline', iconActive: 'home' },
  { name: 'lernen', title: 'Lernen', icon: 'book-outline', iconActive: 'book' },
  { name: 'pruefung', title: 'Prüfung', icon: 'ribbon-outline', iconActive: 'ribbon' },
  { name: 'livia', title: 'Livia', icon: 'chatbubble-ellipses-outline', iconActive: 'chatbubble-ellipses' },
  { name: 'konto', title: 'Konto', icon: 'person-circle-outline', iconActive: 'person-circle' },
];

export default function TabLayout() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const onboarded = useLivoStore((s) => s.profile.onboarded);

  if (!onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textMuted,
        // Etwas höher als der Standard (49), damit die Manrope-Beschriftung nicht abgeschnitten wird
        tabBarStyle: { backgroundColor: c.bg, borderTopColor: c.border, height: 58 + insets.bottom },
        tabBarLabelStyle: { fontFamily: Fonts.bodyBold, fontSize: 11, lineHeight: 14 },
        sceneStyle: { backgroundColor: c.bg },
      }}>
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? t.iconActive : t.icon} size={size} color={color as string} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
