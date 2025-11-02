import { Stack } from 'expo-router';

export default function CategoryStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='list' />
    </Stack>
  );
}
