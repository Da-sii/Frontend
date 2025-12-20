import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import ArrowRightIcon from '@/assets/icons/ic_arrow_right.svg';
import HomeIcon from '@/assets/icons/ic_home.svg';
import InfoIcon from '@/assets/icons/ic_info.svg';
import SearchIcon from '@/assets/icons/ic_magnifier.svg';
import StarIcon from '@/assets/icons/ic_star.svg';
import EmptyReviewIcon from '@/assets/icons/product/productDetail/ic_no_review.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { ReviewButton } from '@/components/common/buttons/ReviewButton';
import { ScrollToTopButton } from '@/components/common/buttons/ScrollToTopButton';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import BottomSheetLayout from '@/components/page/product/productDetail/BottomSeetLayout';
import CoupangTabBar from '@/components/page/product/productDetail/CoupangTabBar';
import MaterialInfo from '@/components/page/product/productDetail/materialInfo';
import PhotoCard from '@/components/page/product/productDetail/PhotoCard';
import ReviewCard from '@/components/page/product/productDetail/ReviewCard';
import ReviewItems from '@/components/page/product/productDetail/reviewItem';
import CustomTabs from '@/components/page/product/productDetail/tab';
import colors from '@/constants/color';
import { useIsLoggedIn } from '@/hooks/auth/useIsLoggedIn';
import { useGetReviewImageList } from '@/hooks/product/review/image/useGetReviewImageList';
import { useParseReviewIdFromImage } from '@/hooks/product/review/image/useParseReviewIdFromImage';
import { useProductReviewsPreview } from '@/hooks/product/review/useGetProductReview';
import { useProductRatingStats } from '@/hooks/product/review/useProductRatingStats';
import { useProductDetail } from '@/hooks/product/useProductDetail';
import { useUser } from '@/hooks/useUser';
import BottomSheet from '@gorhom/bottom-sheet';
import { PortalHost, PortalProvider } from '@gorhom/portal';

import { useQueryClient } from '@tanstack/react-query';
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const fallbackPath = (id: string) => `/product/${id}`;

const tabs = [
  { key: 'ingredient', label: '성분 정보' },
  { key: 'review', label: '리뷰' },
];

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listRef = useRef<FlatList<any>>(null);
  const [showIsMyReviewModal, setShowIsMyReviewModal] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const isLoggedIn = useIsLoggedIn();
  const idNum = Number(id);
  const { data } = useProductDetail(id);
  const { data: reviews = [] } = useProductReviewsPreview(idNum, 'time');
  const { data: ratingStats, refetch: refetchRatingStats } =
    useProductRatingStats(id);
  const { data: reviewImageList } = useGetReviewImageList(idNum, 0);
  const { parseReviewId } = useParseReviewIdFromImage();
  const qc = useQueryClient();
  const router = useRouter();
  const { mypageInfo, fetchMypage } = useUser();

  useEffect(() => {
    fetchMypage();
  }, [fetchMypage]);

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [300], []);
  const openSheet = () => {
    sheetRef.current?.snapToIndex?.(0);
  };
  const closeSheet = () => sheetRef.current?.close();

  const [activeTab, setActiveTab] = useState<'ingredient' | 'review'>(
    'ingredient',
  );
  const listData = activeTab === 'review' ? reviews : [];
  // 스크롤 200px 넘으면 버튼 보이기
  const handleScroll = useCallback((e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    setShowTopButton(y > 200);
  }, []);

  const previewPhotoUrls = useMemo(
    () =>
      (data?.reviewImages ?? [])
        .map((r) => r?.url)
        .filter((u): u is string => typeof u === 'string' && u.length > 0),
    [data?.reviewImages],
  );

  // 화면이 다시 포커스될 때마다 최신화
  useFocusEffect(
    useCallback(() => {
      // 1) 관련 쿼리 무효화
      qc.invalidateQueries({
        queryKey: ['product', 'reviews', idNum, 'time'],
      });
      qc.invalidateQueries({ queryKey: ['product', 'ratingStats', idNum] });
      qc.invalidateQueries({ queryKey: ['product', 'detail', idNum] }); // 평균/카운트가 detail에 있을 경우
      // 2) 바로 재조회 (선호에 따라 invalidate만으로도 충분)
      // refetchReviews();
      refetchRatingStats();
    }, [qc, idNum, refetchRatingStats]),
  );

  // const [coupangProduct, setCoupangProduct] = useState<ICoupang | null>(null);

  if (!data) return <Text>제품을 찾을 수 없습니다.</Text>;

  return (
    <PortalProvider>
      <SafeAreaView className='flex-1 bg-white'>
        <Stack.Screen options={{ headerShown: false }} />
        <Navigation
          left={
            <ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />
          }
          onLeftPress={() => router.back()}
          right={<SearchIcon width={20} height={20} fill={colors.gray[900]} />}
          secondRight={
            <Pressable onPress={() => router.push('/home')}>
              <HomeIcon width={20} height={20} fill={colors.gray[900]} />
            </Pressable>
          }
          onRightPress={() => router.push('/home/search')}
        />
        <FlatList
          ref={listRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          data={listData}
          keyExtractor={(_, index) => String(index)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          /* 상단 고정 영역 */
          ListHeaderComponent={
            <View>
              {/* 상품 이미지 */}
              <View className='h-[46.2vh] w-full'>
                {(() => {
                  const img = data?.images;
                  let imageSource: { uri: string } | undefined;

                  if (Array.isArray(img) && img.length > 0) {
                    const first = img[0];
                    if (typeof first === 'string') {
                      imageSource = { uri: first };
                    } else if (
                      first &&
                      typeof first === 'object' &&
                      typeof first.url === 'string'
                    ) {
                      imageSource = { uri: first.url };
                    }
                  }
                  return imageSource ? (
                    <Image
                      source={imageSource}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode='contain'
                    />
                  ) : (
                    <View className='border-gray-100 border w-full h-full items-center justify-center'>
                      <Text className='text-b-lg font-n-bd text-gray-500'>
                        상품 이미지를 준비중입니다.
                      </Text>
                    </View>
                  );
                })()}
              </View>

              {/* 상품 정보 헤더 */}
              <View className='flex-col border-gray-100 border-b h-[128px] py-[20px]'>
                <View className='flex-col px-[20px] h-full '>
                  <Text className='text-b-sm font-n-bd  mb-[15px]'>
                    {data?.company}
                  </Text>
                  <Text className='text-h-md font-n-bd  mb-[15px]'>
                    {data?.name}
                  </Text>
                  <View className='flex-row items-center mb-[20px]'>
                    <StarIcon />
                    <Text className='text-c1 font-n-rg text-gray-400 ml-[3px]'>
                      {data?.reviewAvg ?? 0} ({data?.reviewCount ?? 0})
                    </Text>
                  </View>
                </View>
              </View>

              {/* 랭킹 및 영양 정보 */}
              <View className='flex-col gap-y-4 border-gray-100 border-b-[3px] py-5 px-5 '>
                <View className='flex-row w-full'>
                  <View className='flex-[0.2]'>
                    <Text className='text-c2 font-n-rg text-gray-400'>
                      랭킹
                    </Text>
                  </View>

                  <View className='flex-col flex-wrap flex-[0.8]'>
                    {data?.ranking?.map((item, index) => (
                      <View
                        key={index}
                        className='flex-row items-baseline mr-2'
                      >
                        <Text className='text-c2 font-n-rg h-[16px]'>
                          {item.bigCategory}
                        </Text>
                        <Text className='text-c2 font-n-rg'> / </Text>
                        <Text className='text-c2 font-n-rg'>
                          {item.smallCategory} {item.monthlyRank}위
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View className='flex-row w-full'>
                  <View className='flex-[0.2]'>
                    <Text className='text-c2 font-n-rg text-gray-400'>
                      식품 유형
                    </Text>
                  </View>

                  <View className='flex-[0.8]'>
                    <Text className='text-c2 font-n-rg'>
                      {data?.productType}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 탭 */}
              <CustomTabs
                tabs={tabs}
                value={activeTab}
                onChange={(key) => setActiveTab(key as 'ingredient' | 'review')}
              />

              {/* 탭별 상단 콘텐츠 */}
              {activeTab === 'ingredient' ? (
                <IngredientSection product={data} openSheet={openSheet} />
              ) : (
                <View className='px-5 mt-5'>
                  <View className='flex-row items-center justify-between mb-5'>
                    <View className='flex-row items-center'>
                      <Text className='text-b-lg font-n-bd'>리뷰 </Text>
                      <Text className='text-b-lg font-n-bd text-gray-400'>
                        ({ratingStats?.total_reviews ?? 0})
                      </Text>
                    </View>
                    {(ratingStats?.total_reviews ?? 0) > 0 && (
                      <Pressable
                        onPress={async () => {
                          if (await isLoggedIn()) {
                            qc.setQueryData(
                              ['product', 'ratingStats', Number(id)],
                              ratingStats,
                            );
                            qc.setQueryData(
                              ['product', 'photo-preview', idNum],
                              {
                                previewPhotos: previewPhotoUrls ?? [],
                                total_photo:
                                  reviewImageList?.pages?.[0]?.total_images ??
                                  0,
                              },
                            );
                            qc.setQueryData(['product', 'detail', idNum], {
                              reviewAvg: data?.reviewAvg,
                              reviewCount: data?.reviewCount,
                            });
                            router.push(`/product/${id}/review/allReview`);
                          } else {
                            router.push('/auth/login/emergency');
                          }
                        }}
                      >
                        <ArrowRightIcon />
                      </Pressable>
                    )}
                  </View>

                  <LongButton
                    label={'리뷰 작성하기'}
                    height={'h-[44px]'}
                    onPress={async () => {
                      if (data?.isMyReview) {
                        setShowIsMyReviewModal(true);
                        return;
                      } else {
                        if (await isLoggedIn()) {
                          router.push({
                            pathname: `/product/${id}/review/write` as any,
                            params: {
                              id: String(id), // 제품아이디
                              name: data?.name ?? '', // 제품명
                              brand: data?.company ?? '', // 회사명
                              image: data?.images[0]?.url ?? '',
                            },
                          });
                        } else {
                          router.push('/auth/login/emergency');
                        }
                      }
                    }}
                  />

                  {(ratingStats?.total_reviews ?? 0) <= 0 ? (
                    <View className='items-center mt-[60px]'>
                      <EmptyReviewIcon />
                      <View className='flex-col items-center mt-[15px]'>
                        <Text className='text-b-md font-n-bd text-gray-600 mb-[7px]'>
                          아직 작성된 리뷰가 없어요.
                        </Text>
                        <Text className='text-b-md font-n-bd text-gray-600'>
                          첫번째 리뷰를 작성해주세요!
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View className='mt-[16px]'>
                      <ReviewCard
                        reviewRank={data?.reviewAvg || 0}
                        distribution={{
                          5: ratingStats?.percentages[5] || 0,
                          4: ratingStats?.percentages[4] || 0,
                          3: ratingStats?.percentages[3] || 0,
                          2: ratingStats?.percentages[2] || 0,
                          1: ratingStats?.percentages[1] || 0,
                        }}
                      />

                      {/* 사진 그리드(주의: 내부가 세로 FlatList면 View+map 버전으로 바꾸기) */}
                      <View className='mt-4 pb-5'>
                        <PhotoCard
                          images={previewPhotoUrls ?? []}
                          maxPreview={6}
                          onPressPhoto={async (idx) => {
                            if (await isLoggedIn()) {
                              const imageUrl = previewPhotoUrls?.[idx];
                              if (!imageUrl) return;
                              qc.setQueryData(['product', 'detail', idNum], {
                                reviewAvg: data?.reviewAvg,
                                reviewCount: data?.reviewCount,
                              });
                              router.push({
                                pathname:
                                  '/product/[id]/review/[reviewId]/photoReviewDetail',
                                params: {
                                  id: String(id),
                                  reviewId: String(parseReviewId(imageUrl)),
                                  imageUrl,
                                  index: idx,
                                },
                              });
                            } else {
                              router.push('/auth/login/emergency');
                            }
                          }}
                          onPressMore={async () => {
                            qc.setQueryData(['product', 'detail', idNum], {
                              reviewAvg: data?.reviewAvg,
                              reviewCount: data?.reviewCount,
                            });
                            if (await isLoggedIn()) {
                              router.push(
                                `/product/${id}/review/photo/allList`,
                              );
                            } else {
                              router.push('/auth/login/emergency');
                            }
                          }}
                          total_photo={
                            reviewImageList?.pages[0]?.total_images ?? 0
                          }
                        />
                      </View>

                      {/* 아래부터는 아이템을 renderItem으로 렌더 */}
                      <View className='w-[200%] h-[1px] left-[-50%] bg-gray-50' />
                    </View>
                  )}
                </View>
              )}
            </View>
          }
          /* 리뷰 탭일 때만 아이템(리뷰) 렌더 */
          renderItem={
            activeTab === 'review'
              ? ({ item, index }) => (
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
                      enableBottomSheet={
                        !mypageInfo?.nickname === item.user_nickname
                      }
                    />
                    <View className='w-[200%] h-[1px] left-[-50%] bg-gray-50' />
                  </View>
                )
              : undefined
          }
          ListFooterComponent={
            activeTab === 'review' && (ratingStats?.total_reviews ?? 0) > 0 ? (
              <View className='items-center mt-4 mb-6'>
                <ReviewButton
                  onPress={() => {
                    qc.setQueryData(
                      ['product', 'ratingStats', Number(id)],
                      ratingStats,
                    );
                    qc.setQueryData(['product', 'photo-preview', idNum], {
                      previewPhotos: previewPhotoUrls ?? [],
                      total_photo: reviewImageList?.pages[0]?.total_images ?? 0,
                    });
                    qc.setQueryData(['product', 'detail', idNum], {
                      reviewAvg: data?.reviewAvg,
                      reviewCount: data?.reviewCount,
                    });
                    router.push(`/product/${id}/review/allReview`);
                  }}
                  count={ratingStats?.total_reviews ?? 0}
                />
              </View>
            ) : (
              <View style={{ height: 24 }} />
            )
          }
        />
        <CoupangTabBar id={id} coupangUrl='https://naver.com' /> // data.coupang
        <PortalHost name='overlay-top' />
        <DefaultModal
          visible={showIsMyReviewModal}
          message='이미 리뷰를 작성하셨어요.'
          confirmText='확인'
          onConfirm={() => setShowIsMyReviewModal(false)}
          singleButton={true}
        />
        <ScrollToTopButton
          scrollRef={{
            current: {
              scrollTo: ({ y, animated }: any) =>
                listRef.current?.scrollToOffset({ offset: y, animated }),
            },
          }}
          visible={showTopButton}
        />
      </SafeAreaView>
      <BottomSheetLayout snapPoints={snapPoints} sheetRef={sheetRef}>
        <View className='px-[30px] mt-[30px] mb-[44px]'>
          <Text className='text-b-sm font-n-eb text-gray-900 mb-[25px]'>
            성분 정보의 출처
          </Text>
          <Text className='text-c2 font-n-bd text-gray-400 mb-[11px]'>
            본 정보는 식품의약품안전처 건강기능식품 및 영양성분 기준을
            참고했습니다.
          </Text>
          <Text className='text-c2 font-n-bd text-gray-400'>
            (https://www.foodsafetykorea.go.kr)
          </Text>
        </View>
      </BottomSheetLayout>
    </PortalProvider>
  );
}

/* 그대로 사용 */
function IngredientSection({
  product,
  openSheet,
}: {
  product: any;
  openSheet: () => void;
}) {
  return (
    <View className='p-5'>
      <View className='flex-row items-center justify-between mb-[10px]'>
        <View className='flex-row'>
          <Text className='text-b-lg font-n-bd'>기능성 원료 </Text>
          <Text className='text-b-lg font-n-eb text-green-500'>
            {product?.ingredientsCount ?? 0}개
          </Text>
        </View>
        <Pressable onPress={openSheet}>
          <InfoIcon />
        </Pressable>
      </View>
      {product?.ingredients.map((item: any, index: any) => (
        <MaterialInfo key={index} materialInfo={item} />
      ))}
    </View>
  );
}
