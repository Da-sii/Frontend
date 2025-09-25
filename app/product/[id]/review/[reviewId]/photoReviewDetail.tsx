import XIcon from '@/assets/icons/ic_x.svg';
import { ReviewButton } from '@/components/common/buttons/ReviewButton';
import Navigation from '@/components/layout/Navigation';
import ReviewItems from '@/components/page/product/productDetail/reviewItem';
import colors from '@/constants/color';
import { PortalProvider } from '@gorhom/portal';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useGetPhotoReviewDetail } from '@/hooks/product/review/image/useGetPhotoReviewDetail';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function PhotoReviewDetail() {
  const router = useRouter();

  const { id, reviewId, index } = useLocalSearchParams<{
    id: string;
    reviewId: string;
    index?: string;
  }>();
  const reviewIdNum = Number(reviewId);
  const idNum = Number(id);

  const { data: reviewDetail } = useGetPhotoReviewDetail(reviewIdNum);

  const startIndex = Math.max(0, Number(index ?? 0));
  const SCREEN_W = Dimensions.get('window').width;
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  // 리뷰/이미지 확보
  // const { review, images } = useMemo(() => {
  //   const product = mockProductData.find((p) => p.id === String(id));
  //   const reviews = product?.review?.reviewList ?? [];
  //   const r = reviews.find(
  //     (rv: any, i: number) => String(rv.id ?? i) === String(reviewId),
  //   );
  //   const imgs: string[] = r?.images ?? [];
  //   return { review: r, images: imgs };
  // }, [id, reviewId]);

  // 별점 간단 렌더러 (정수/반개 처리 생략 버전)
  const StarRow = ({ score = 0 }: { score?: number }) => {
    const filled = Math.round(score); // 네 요구대로 4.79 -> 5가 싫으면 Math.floor로 바꿔
    return (
      <Text style={{ color: colors.yellow[500], fontWeight: '700' }}>
        {'★'.repeat(filled)}
      </Text>
    );
  };

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const next = Math.round(x / SCREEN_W);
      setCurrentIndex(next);
    },
    [SCREEN_W],
  );

  const listRef = useRef<FlatList<string>>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <PortalProvider>
        <Navigation
          title='포토 리뷰 상세보기'
          right={<XIcon width={18} height={18} />}
          onRightPress={() => router.back()}
        />

        <ScrollView
          keyboardShouldPersistTaps='handled'
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {/* 이미지 뷰어 (리뷰 내 이미지들) */}
          <View
            style={{ width: '100%', aspectRatio: 1, backgroundColor: 'black' }}
          >
            <FlatList
              ref={listRef}
              data={reviewDetail?.url ? [reviewDetail.url] : []}
              horizontal
              pagingEnabled
              initialScrollIndex={startIndex}
              getItemLayout={(_, i) => ({
                length: SCREEN_W,
                offset: SCREEN_W * i,
                index: i,
              })}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(uri, i) => uri + i}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: SCREEN_W,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={{ uri: item }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode='cover'
                  />
                </View>
              )}
              onMomentumScrollEnd={onMomentumEnd}
              onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                  listRef.current?.scrollToIndex({
                    index: info.index,
                    animated: false,
                  });
                }, 0);
              }}
            />

            {/* 우상단 인디케이터: 현재/전체 */}
            <View
              style={{
                position: 'absolute',
                right: 20,
                top: 20,
                borderRadius: 999,
                backgroundColor: 'rgba(0,0,0,0.5)',
                width: 48,
                height: 24,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              {/* FlatList의 onViewableItemsChanged로 실시간 인덱스 추적하려면 상태 추가 */}
              <Text
                className='text-white text-c3 font-bold'
                style={{ color: 'white', fontSize: 12 }}
              >
                {currentIndex + 1} / {reviewDetail?.url ? 1 : 0}
              </Text>
            </View>
          </View>

          {/* 리뷰 메타 + 본문 */}
          {reviewDetail && (
            <ReviewItems
              reviewItem={{
                id: idNum,
                reviewId: reviewIdNum,
                name: reviewDetail.nickname ?? '',
                date: reviewDetail.date ?? '-',
                isEdited: true,
                content: reviewDetail.review ?? '',
                rating: reviewDetail.rate ?? 0,
                images: reviewDetail.url ? [reviewDetail.url] : [],
              }}
              isPhoto={false}
              isMore={false}
            />
          )}
          <View className='items-center'>
            <ReviewButton
              onPress={() =>
                router.push({
                  pathname: '/product/[id]/review/allReview',
                  params: { id: String(id) },
                })
              }
              // count={
              //   mockProductData.find((p) => p.id === String(id))?.review
              //     ?.reviewList?.length ?? 0
              // }
              count={0}
            />
          </View>
        </ScrollView>
      </PortalProvider>
    </SafeAreaView>
  );
}
