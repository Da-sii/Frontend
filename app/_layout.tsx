import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    NanumSquareNeo: require('@/assets/fonts/NanumSquareNeo-Variable.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='+not-found' />
        <Stack.Screen name='home/search' options={{ headerShown: false }} />
      </Stack>
      <StatusBar style='auto' />
    </GestureHandlerRootView>
  );
}
