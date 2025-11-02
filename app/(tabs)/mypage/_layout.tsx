import { Stack } from 'expo-router';

export default function MypageStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
    </Stack>
  );
}
