import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import StarIcon from '@/assets/icons/ic_star.svg';
import ArrowDownIcon from '@/assets/icons/product/productDetail/ic_arrow_down.svg';
import Navigation from '@/components/layout/Navigation';
import BottomSheetLayout from '@/components/page/product/productDetail/BottomSeetLayout';
import PhotoCard from '@/components/page/product/productDetail/PhotoCard';
import ReviewItems from '@/components/page/product/productDetail/reviewItem';
import colors from '@/constants/color';
import { useProductReviewsInfinite } from '@/hooks/product/review/useGetProductReview';
import { mockProductData } from '@/mocks/data/productDetail';
import { ProductRatingStatsDTO } from '@/services/product/review/getProductRatingStats';
import BottomSheet from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import { useQueryClient } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { ProductDetail } from '@/services/product/getProductDetail';

const SORT_OPTIONS: {
  key: 'time' | 'high' | 'low';
  label: string;
}[] = [
  { key: 'high', label: '별점 높은순' },
  { key: 'low', label: '별점 낮은순' },
  { key: 'time', label: '최신순' },
];

export default function allReview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const idNum = Number(id);
  const qc = useQueryClient();
  const [sort, setSort] = useState<'time' | 'high' | 'low'>('high');

  // const cachedRatingStats = qc.getQueryData<ProductRatingStatsDTO>([
  //   'product',
  //   'ratingStats',
  //   idNum,
  // ]);
  const cachedRatingStats = qc.getQueryData<{
    reviewAvg: number;
    reviewCount: number;
  }>(['product', 'detail', idNum]);

  const cachedPhotoPreview = qc.getQueryData<{
    previewPhotos: string[];
    total_photo: number;
  }>(['product', 'photo-preview', idNum]);

  const { items, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useProductReviewsInfinite(idNum, sort);

  const router = useRouter();
  const product = mockProductData.find((item) => item.id === id);
  if (!product) return <Text>제품을 찾을 수 없습니다.</Text>;

  // ===== BottomSheet =====
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [197], []);
  const openSheet = () => {
    sheetRef.current?.snapToIndex?.(0);
  };
  const closeSheet = () => sheetRef.current?.close();

  // 리뷰 탭에서 상단 사진 그리드에 쓸 사진 모음(예: 상품/리뷰 이미지 합치기 원하면 여기서 처리)
  const reviewPhotos = useMemo(
    () => items.flatMap((r) => r.images ?? []) ?? [],
    [product.review?.reviewList],
  );

  console.log('reviewPhotos', reviewPhotos);

  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };
  // const listData = product.review?.reviewList;

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <PortalProvider>
        <Navigation
          title='리뷰 전체보기'
          left={
            <ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />
          }
          onLeftPress={() => router.back()}
        />

        <FlatList
          key={sort}
          data={items ?? []}
          keyExtractor={(it, i) => String(it?.review_id ?? `p-${i}`)}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          /* 상단 고정 영역 */
          ListHeaderComponent={
            <View className='bg-white p-5 pb-0'>
              {/* 리뷰 전체보기 타이틀 */}
              <View className='flex-row items-center justify-between mb-[15px]'>
                <View className='flex-row items-center'>
                  <Text className='text-b-md font-extrabold text-gray-700 mr-[8px]'>
                    리뷰 {cachedRatingStats?.reviewCount ?? 0}개
                  </Text>
                  <StarIcon width={20} height={20} />
                  <Text className='text-b-md font-extrabold text-gray-700 ml-[2px]'>
                    ({cachedRatingStats?.reviewAvg ?? 0})
                  </Text>
                </View>
              </View>

              {/* 리뷰 전체보기 사진 그리드 */}
              <View>
                <View className='pb-5'>
                  <PhotoCard
                    images={cachedPhotoPreview?.previewPhotos ?? []}
                    total_photo={cachedPhotoPreview?.total_photo ?? 0}
                    maxPreview={6}
                    onPressMore={() =>
                      router.push(`/product/${id}/review/photo/allList`)
                    }
                  />
                </View>
                <View className='w-[200%] h-[1px] left-[-50%] bg-gray-50' />
              </View>

              {/* 정렬 */}
              <View>
                <View className='py-[12px]'>
                  <Pressable
                    onPress={openSheet}
                    hitSlop={8}
                    className='flex-row items-center '
                  >
                    <Text className='text-b-sm font-bold mr-[3px]'>
                      {
                        SORT_OPTIONS.find((option) => option.key === sort)
                          ?.label
                      }
                    </Text>
                    <ArrowDownIcon />
                  </Pressable>
                </View>
                <View className='w-[200%] h-[1px] left-[-50%] bg-gray-50' />
              </View>

              <BottomSheetLayout snapPoints={snapPoints} sheetRef={sheetRef}>
                <View className='px-5 pt-[30px] pb-[44px]'>
                  {SORT_OPTIONS.map((opt) => {
                    const active = sort === opt.key;
                    return (
                      <Pressable
                        key={opt.key}
                        onPress={() => {
                          setSort(opt.key as 'time' | 'high' | 'low');
                          closeSheet();
                        }}
                        hitSlop={8}
                        accessibilityRole='button'
                        accessibilityState={{ selected: active }}
                      >
                        <View className='flex-row items-center justify-between mb-[25px]'>
                          <Text
                            className={`text-b-sm font-bold ${active ? 'text-gray-900' : 'text-gray-400'}`}
                          >
                            {opt.label}
                          </Text>
                          {active && (
                            <Svg
                              width={18}
                              height={18}
                              viewBox='0 0 18 18'
                              fill='none'
                            >
                              <Path
                                d='M16.5 4.5L6.5 15L1.5 9'
                                stroke={'#181A1B'}
                                strokeWidth={1.5}
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </Svg>
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </BottomSheetLayout>
            </View>
          }
          renderItem={({ item, index }) => (
            <View key={index}>
              <ReviewItems
                reviewItem={{
                  id: item.review_id ?? '',
                  reviewId: item.review_id ?? '',
                  name: item.user_nickname ?? '',
                  date: item.date ?? '-',
                  isEdited: item.updated,
                  content: item.review ?? '',
                  rating: item.rate ?? 0,
                  images: item.images ?? [],
                }}
                id={id}
              />
              <View className='w-[200%] h-[1px] left-[-50%] bg-gray-50' />
            </View>
          )}
          ListFooterComponent={
            <View
              style={{
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isFetchingNextPage ? (
                <Text>불러오는 중…</Text>
              ) : !hasNextPage ? (
                <Text>-</Text>
              ) : null}
            </View>
          }
        />
      </PortalProvider>
    </SafeAreaView>
  );
}
