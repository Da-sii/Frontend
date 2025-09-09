// app/product/photo-reviews.tsx (예시)
import { mockProductData } from '@/mocks/data/productDetail';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// import Navigation from '@/components/layout/Navigation';  // 너네 컴포넌트 쓰면 교체
import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import Navigation from '@/components/layout/Navigation';
import colors from '@/constants/color';
const PAGE_SIZE = 10;
const COLS = 3;
const GAP = 3; // 고정 간격

const SCREEN_W = Dimensions.get('window').width;
const ITEM_W = (SCREEN_W - GAP * (COLS - 1)) / COLS;

type Photo = { id: string; uri: string; reviewId: string; imageIndex: number };

export default function allPhoto() {
  const router = useRouter();
  const [page, setPage] = useState(1); // 현재 페이지
  const [photoList, setPhotoList] = useState<Photo[]>([]); // 현재 화면에 뿌리는 데이터
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false); // 마지막 페이지 여부
  const { id } = useLocalSearchParams<{ id: string }>();

  // onEndReached가 연속 호출되는 걸 한 번 더 막기 위한 플래그
  const reachedRef = useRef(false);

  const allPhotos: Photo[] = useMemo(() => {
    if (!id) return [];
    const product = mockProductData.find((p) => p.id === String(id));
    const reviewList = product?.review?.reviewList ?? [];

    // review 단위로 평탄화하면서 reviewId / imageIndex 달기
    const flat: Photo[] = [];
    reviewList.forEach((rev, rIdx) => {
      (rev.images ?? []).forEach((img: string, i: number) => {
        flat.push({
          id: `${rIdx}-${i}`,
          uri: img,
          reviewId: String(rev.id ?? rIdx), // mock에 id 없으면 인덱스 사용
          imageIndex: i,
        });
      });
    });

    // (선택) 중복 제거
    // const uniq = Array.from(new Map(flat.map(p => [p.uri + p.reviewId, p])).values());
    // return uniq;

    return flat;
  }, [id]);

  const renderItem = useCallback(
    ({ item, index }: { item: Photo; index: number }) => (
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/product/[id]/review/[reviewId]/photoReviewDetail', // 뷰어 라우트
            params: {
              id: String(id),
              reviewId: item.reviewId,
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

  const loadMore = useCallback(() => {
    if (loading || end || reachedRef.current) return;
    reachedRef.current = true; // onEndReached 중복 방어
    setLoading(true);

    const start = (page - 1) * PAGE_SIZE;
    const endIndex = start + PAGE_SIZE;
    const next = allPhotos.slice(start, endIndex);

    if (next.length === 0) {
      setEnd(true);
      setLoading(false);
      reachedRef.current = false;
      return;
    }

    setPhotoList((prev) => [...prev, ...next]);
    setPage((p) => p + 1);
    setLoading(false);
    reachedRef.current = false;
  }, [allPhotos, page, loading, end]);

  // id 바뀌면 페이지네이션 초기화 후 첫 로드
  useEffect(() => {
    setPage(1);
    setPhotoList([]);
    setEnd(false);
  }, [id]);

  useEffect(() => {
    if (!end && photoList.length === 0) {
      // 초기 진입/리셋 시 첫 페이지 로드
      loadMore();
    }
  }, [end, photoList.length, loadMore]);

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
          data={photoList}
          keyExtractor={(it, i) => `${it.id}-${i}`}
          renderItem={renderItem}
          numColumns={COLS}
          onEndReached={loadMore}
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
            loading ? (
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
