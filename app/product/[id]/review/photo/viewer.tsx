import XIcon from '@/assets/icons/ic_x.svg';
import Navigation from '@/components/layout/Navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function photoViewer() {
  const { token, index } = useLocalSearchParams<{
    token?: string;
    index?: string;
  }>();

  const router = useRouter();
  const SCREEN_W = Dimensions.get('window').width;
  const startIndex = index ? Number(index) : 0;
  const [currentIndex, setCurrentIndex] = useState(startIndex);
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

      {images.length > 0 && (
        <View
          style={{
            position: 'absolute',
            right: 20,
            top: 138,
            alignSelf: 'center',
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: 48,
            height: 24,
            borderRadius: 999,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '600',
              fontSize: 12,
            }}
          >
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      )}
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
        onMomentumScrollEnd={(e) => {
          const offsetX = e.nativeEvent.contentOffset.x;
          const newIndex = Math.round(offsetX / SCREEN_W);
          setCurrentIndex(newIndex);
        }}
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
