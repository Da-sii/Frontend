import XIcon from '@/assets/icons/ic_x.svg';
import { ReviewButton } from '@/components/common/buttons/ReviewButton';
import Navigation from '@/components/layout/Navigation';
import ReviewItems from '@/components/page/product/productDetail/reviewItem';
import { useGetPhotoReviewDetail } from '@/hooks/product/review/image/useGetPhotoReviewDetail';
import { toCdnUrl } from '@/utils/cdn';
import { PortalProvider } from '@gorhom/portal';
import { useQueryClient } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
export default function PhotoReviewDetail() {
  const router = useRouter();

  const { id, reviewId, imageUrl } = useLocalSearchParams<{
    id: string;
    reviewId: string;

    imageUrl: string;
  }>();
  const reviewIdNum = Number(reviewId);
  const idNum = Number(id);

  const { data: reviewDetail } = useGetPhotoReviewDetail(reviewIdNum);
  const qc = useQueryClient();
  const reviewCount = qc.getQueryData<{
    reviewCount: number;
  }>(['product', 'detail', idNum]);

  const SCREEN_W = Dimensions.get('window').width;

  const images = reviewDetail?.images ?? [];

  const targetIndex = useMemo(() => {
    if (!images.length || !imageUrl) return 0;
    const idx = images.findIndex((img: any) => img?.url === String(imageUrl));
    return idx >= 0 ? idx : 0;
  }, [images, imageUrl]);
  const [currentIndex, setCurrentIndex] = useState(targetIndex);
  const listRef = useRef<FlatList<any>>(null);

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const next = Math.round(x / SCREEN_W);
      setCurrentIndex(next);
    },
    [SCREEN_W],
  );

  useEffect(() => {
    if (!images.length) return;
    // initialScrollIndex가 가끔 무시되는 이슈 보정
    const t = setTimeout(() => {
      listRef.current?.scrollToIndex({ index: targetIndex, animated: false });
      setCurrentIndex(targetIndex);
    }, 0);
    return () => clearTimeout(t);
  }, [images.length, targetIndex]);

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
              data={images}
              horizontal
              pagingEnabled
              initialScrollIndex={targetIndex}
              getItemLayout={(_, i) => ({
                length: SCREEN_W,
                offset: SCREEN_W * i,
                index: i,
              })}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, i) => (item?.url ?? '') + i}
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
                    source={{ uri: toCdnUrl(item.url) }}
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
                className='text-white text-c3 font-n-bd'
                style={{ color: 'white', fontSize: 12 }}
              >
                {currentIndex + 1} / {reviewDetail?.images.length ?? 0}
              </Text>
            </View>
          </View>

          {/* 리뷰 메타 + 본문 */}
          {reviewDetail && (
            <ReviewItems
              reviewItem={{
                id: idNum,
                reviewId: reviewIdNum,
                name: reviewDetail.user.nickname ?? '',
                date: reviewDetail.date ?? '-',
                isEdited: reviewDetail.updated,
                content: reviewDetail.review ?? '',
                rating: reviewDetail.rate ?? 0,
                images: reviewDetail.images ? [reviewDetail.images] : [],
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
              count={reviewCount?.reviewCount ?? 0}
            />
          </View>
        </ScrollView>
      </PortalProvider>
    </SafeAreaView>
  );
}
