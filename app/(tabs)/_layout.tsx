import { Tabs, usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  
  // This redirects to the home tab when users just enter the tabs directory
  useEffect(() => {
    if (pathname === '/(tabs)') {
      router.replace('/(tabs)/index');
    }
  }, [pathname]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            backgroundColor: colorScheme === 'dark' ? '#1a1a2e' : '#ffffff',
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      {/* We need to keep room and inroom in tabs but hide them from the tab bar */}
      <Tabs.Screen
        name="room"
        options={{
          href: null, // This makes it not appear in the tab bar
        }}
      />
      <Tabs.Screen
        name="inroom"
        options={{
          href: null, // This makes it not appear in the tab bar
        }}
      />
    </Tabs>
  );
}
