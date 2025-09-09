import XIcon from '@/assets/icons/ic_x.svg';
import Navigation from '@/components/layout/Navigation';
import { Stack, useRouter } from 'expo-router';
import { Dimensions, FlatList, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalSearchParams } from 'expo-router';

import { mockProductData } from '@/mocks/data/productDetail';
export default function photoViewer() {
  const { id, reviewId, index } = useLocalSearchParams<{
    id: string;
    reviewId: string;
    index?: string;
  }>();
  const router = useRouter();

  const product = mockProductData.find((p) => p.id === id);
  const review = product?.review?.reviewList.find((r) => r.id === reviewId);
  const images = review?.images ?? [];
  const SCREEN_W = Dimensions.get('window').width;
  const startIndex = index ? parseInt(index) : 0;

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
