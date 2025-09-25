import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toCdnUrl } from '@/utils/cdn';
import { useGetReviewImageList } from '@/hooks/product/review/image/useGetReviewImageList';
import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import Navigation from '@/components/layout/Navigation';
import colors from '@/constants/color';

const COLS = 3;
const GAP = 3;

const SCREEN_W = Dimensions.get('window').width;
const ITEM_W = (SCREEN_W - GAP * (COLS - 1)) / COLS;

type Photo = {
  id: string; // 고유 키(화면용)
  uri: string; // CDN 변환된 URL
  imageIndex: number; // 전체 리스트 내 인덱스(옵션)
  reviewId: number; // ← 추가: 이 이미지가 속한 리뷰 ID
  indexInReview: number; // ← 추가: 같은 리뷰 안에서의 순번(0부터)
  rawPath: string; // ← 원본 경로(파싱용)
};

const parseReviewId = (path: string) => {
  const m = path.match(/^(\d+)\/(\d+)\//);
  return m ? Number(m[2]) : -1;
};

export default function allList() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useGetReviewImageList(productId, 0);

  const allPhotos: Photo[] = useMemo(() => {
    if (!data) return [];
    const perReviewCount: Record<number, number> = {};
    const items = data.pages.flatMap((page) => page.image_urls ?? []);

    return items.map((it, i) => {
      const raw = it.url; // DTO: {id, url}
      const reviewId = parseReviewId(raw);
      const cur = perReviewCount[reviewId] ?? 0;
      perReviewCount[reviewId] = cur + 1;

      return {
        id: `img-${it.id}-${i}`,
        uri: toCdnUrl(raw),
        imageIndex: i,
        reviewId,
        indexInReview: cur,
        rawPath: raw,
      };
    });
  }, [data]);

  const renderItem = useCallback(
    ({ item, index }: { item: Photo; index: number }) => (
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/product/[id]/review/[reviewId]/photoReviewDetail', // 뷰어 라우트
            params: {
              id: Number(id),
              reviewId: item.reviewId,
              url: String(item.uri),
              index: String(item.imageIndex), // 리뷰 내 시작 인덱스
            },
          })
        }
        style={{
          width: ITEM_W,
          aspectRatio: 1,
          marginRight: (index + 1) % COLS === 0 ? 0 : GAP,
          marginBottom: GAP,
          overflow: 'hidden',
          backgroundColor: '#eee',
        }}
      >
        <Image
          source={{ uri: item.uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode='cover'
        />
      </Pressable>
    ),
    [id, router],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        title='포토 리뷰 전체보기'
        left={<ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />}
        onLeftPress={() => router.back()}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={allPhotos}
          keyExtractor={(it, i) => `${it.id}-${i}`}
          renderItem={renderItem}
          numColumns={COLS}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.6}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={24}
          windowSize={10}
          maxToRenderPerBatch={24}
          getItemLayout={(_, index) => ({
            length: ITEM_W + GAP,
            offset: Math.floor(index / COLS) * (ITEM_W + GAP),
            index,
          })}
          ListFooterComponent={
            isLoading || isFetchingNextPage ? (
              <ActivityIndicator style={{ marginVertical: 16 }} />
            ) : (
              <View style={{ height: 16 }} />
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}
