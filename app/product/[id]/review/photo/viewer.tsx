import XIcon from '@/assets/icons/ic_x.svg';
import Navigation from '@/components/layout/Navigation';
import { Stack, useRouter } from 'expo-router';
import { Dimensions, FlatList, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
export default function photoViewer() {
  const { token, index } = useLocalSearchParams<{
    token?: string;
    index?: string;
  }>();

  const router = useRouter();
  const SCREEN_W = Dimensions.get('window').width;
  const startIndex = index ? Number(index) : 0;
  const photoViewerKey = (token: string) => ['photoViewer', token] as const;

  const qc = useQueryClient();
  const images =
    (token ? qc.getQueryData<string[]>(photoViewerKey(token)) : []) ?? [];

  useEffect(() => {
    return () => {
      if (token) qc.removeQueries({ queryKey: photoViewerKey(token) });
    };
  }, [qc, token]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        title='이미지 상세보기'
        right={<XIcon width={18} height={18} />}
        onRightPress={() => router.back()}
      />

      <FlatList
        data={images}
        horizontal
        pagingEnabled
        initialScrollIndex={startIndex}
        getItemLayout={(_, i) => ({
          length: SCREEN_W,
          offset: SCREEN_W * i,
          index: i,
        })}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_W, flex: 1, backgroundColor: 'black' }}>
            <Image
              source={{ uri: item }}
              style={{ flex: 1 }}
              resizeMode='contain'
            />
          </View>
        )}
        keyExtractor={(uri, i) => `${uri}-${i}`}
      />
    </SafeAreaView>
  );
}
