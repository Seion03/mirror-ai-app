import { Stack } from 'expo-router';
import React from 'react';

export default function WorkoutsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="quick-workout" options={{ headerShown: false }} />
      <Stack.Screen name="index1" options={{ headerShown: false }} />
    </Stack>
  );
}