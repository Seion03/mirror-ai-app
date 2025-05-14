/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Update these colors to match your app's purple theme
const tintColorLight = '#4A00E0'; // Primary purple from your buttons
const tintColorDark = '#8E2DE2'; // Deeper purple from your gradients

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#8E54E9', // Updated to match your secondary purple
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#4776E6', // Updated to match your blue accent color
    tabIconSelected: tintColorDark,
  },
};
