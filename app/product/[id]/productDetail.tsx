import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import ArrowRightIcon from '@/assets/icons/ic_arrow_right.svg';
import HomeIcon from '@/assets/icons/ic_home.svg';
import SearchIcon from '@/assets/icons/ic_magnifier.svg';
import StarIcon from '@/assets/icons/ic_star.svg';
import EmptyReviewIcon from '@/assets/icons/product/productDetail/ic_no_review.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import Navigation from '@/components/layout/Navigation';
import MaterialInfo from '@/components/page/product/productDetail/materialInfo';
import PhotoCard from '@/components/page/product/productDetail/PhotoCard';
import ReviewCard from '@/components/page/product/productDetail/ReviewCard';
import ReviewItems from '@/components/page/product/productDetail/reviewItem';
import CustomTabs from '@/components/page/product/productDetail/tab';
import colors from '@/constants/color';
import { mockProductData } from '@/mocks/data/productDetail';
import { PortalProvider } from '@gorhom/portal'; // ← 설치했다면 사용
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProductDetail } from '@/hooks/product/useProductDetail';
const tabs = [
  { key: 'ingredient', label: '성분 정보' },
  { key: 'review', label: '리뷰' },
];

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, error } = useProductDetail(id);

  const router = useRouter();
  const product = mockProductData.find((item) => item.id === id);

  const [activeTab, setActiveTab] = useState<'ingredient' | 'review'>(
    'ingredient',
  );

  if (!product) return <Text>제품을 찾을 수 없습니다.</Text>;

  // 리뷰 탭에서 상단 사진 그리드에 쓸 사진 모음(예: 상품/리뷰 이미지 합치기 원하면 여기서 처리)
  const reviewPhotos = useMemo(
    () => product.review?.reviewList?.flatMap((r) => r.images ?? []) ?? [],
    [product.review?.reviewList],
  );

  // 탭에 따라 리스트 데이터 스위치: ingredient면 빈 배열(아이템 없음), review면 리뷰 리스트
  const listData = activeTab === 'review' ? product.review?.reviewList : [];

  const imageUrl =
    typeof product.image === 'string' ? product.image : (product.image as any); // 로컬 require면 params로 넘기지 말고 빈 문자열

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <PortalProvider>
        <Navigation
          left={
            <ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />
          }
          onLeftPress={() => router.back()}
          right={<SearchIcon width={20} height={20} fill={colors.gray[900]} />}
          secondRight={
            <HomeIcon width={20} height={20} fill={colors.gray[900]} />
          }
          onRightPress={() => router.push('/home/search')}
        />

        <FlatList
          data={listData}
          keyExtractor={(_, index) => String(index)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          /* 상단 고정 영역 */
          ListHeaderComponent={
            <View>
              {/* 상품 이미지 */}
              <View className='h-[390px] w-full'>
                {product.image ? (
                  typeof product.image === 'string' ? (
                    <Image
                      source={{ uri: product.image }}
                      className='w-full h-full'
                    />
                  ) : (
                    <Image
                      source={product.image as any}
                      className='w-full h-full'
                    />
                  )
                ) : (
                  <View className='border-gray-100 border w-full h-full items-center justify-center'>
                    <Text className='text-b-lg font-bold text-gray-500'>
                      상품 이미지를 준비중입니다.
                    </Text>
                  </View>
                )}
              </View>

              {/* 상품 정보 헤더 */}
              <View className='flex-col gap-y-5 border-gray-100 border-b py-5 px-5'>
                <View className='flex-col gap-[15px]'>
                  <Text className='text-b-sm font-bold'>{data?.company}</Text>
                  <Text className='text-h-md font-bold'>{data?.name}</Text>
                  <View className='flex-row items-center'>
                    <StarIcon />
                    <Text className='text-c1 font-normal text-gray-400 ml-[3px]'>
                      {data?.reviewAvg ?? 0} ({data?.reviewCount ?? 0})
                    </Text>
                  </View>
                </View>
                <View className='flex-row items-center'>
                  <Text className='text-b-lg font-bold'>정가 </Text>
                  <Text className='text-h-md font-extrabold'>
                    {data?.price ?? 0}원{' '}
                  </Text>
                  <Text className='text-c1 font-bold text-gray-300'>
                    / {data?.unit ?? ''}
                  </Text>
                </View>
              </View>

              {/* 랭킹 및 영양 정보 */}
              <View className='flex-col gap-y-4 border-gray-100 border-b-[3px] py-5 px-5'>
                <View className='flex-row'>
                  <Text className='text-c2 font-normal text-gray-400 mr-[26px] w-[46px]'>
                    랭킹
                  </Text>
                  <View className='flex-col'>
                    {data?.ranking?.map((item, index) => (
                      <Text key={index} className='text-c2 font-normal'>
                        {item.title}
                      </Text>
                    ))}
                  </View>
                </View>
                <View className='flex-row'>
                  <Text className='text-c2 font-normal text-gray-400 w-[46px] mr-[26px]'>
                    식품 유형
                  </Text>
                  <Text className='text-c2 font-normal'>
                    {data?.productType}
                  </Text>
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
                <IngredientSection product={data} />
              ) : (
                <View className='px-5 mt-5'>
                  <View className='flex-row items-center justify-between mb-5'>
                    <View className='flex-row items-center'>
                      <Text className='text-b-lg font-bold'>리뷰 </Text>
                      <Text className='text-b-lg font-bold text-gray-400'>
                        ({product.review?.reviewList?.length ?? 0})
                      </Text>
                    </View>
                    {(product?.review?.reviewList?.length ?? 0) > 0 && (
                      <Pressable
                        onPress={() =>
                          router.push(`/product/${id}/review/allReview`)
                        }
                      >
                        <ArrowRightIcon />
                      </Pressable>
                    )}
                  </View>

                  <LongButton
                    label={'리뷰 작성하기'}
                    height='h-[40px]'
                    onPress={() =>
                      router.push({
                        pathname: `/product/${id}/review/write` as any,
                        params: {
                          id: String(id), // 제품아이디
                          name: data?.name ?? '', // 제품명
                          brand: data?.company ?? '', // 회사명
                          image: typeof imageUrl === 'string' ? imageUrl : '', // URL만 보내기
                        },
                      })
                    }
                  />

                  {(product?.review?.reviewList?.length ?? 0) <= 0 ? (
                    <View className='items-center mt-[60px]'>
                      <EmptyReviewIcon />
                      <View className='flex-col items-center mt-[15px]'>
                        <Text className='text-b-md font-bold text-gray-600 mb-[7px]'>
                          아직 작성된 리뷰가 없어요.
                        </Text>
                        <Text className='text-b-md font-bold text-gray-600'>
                          첫번째 리뷰를 작성해주세요!
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View className='mt-[16px]'>
                      <ReviewCard
                        reviewRank={product.review?.reviewRank || 0}
                        distribution={{
                          5: product.review?.fiveStarPercent || 0,
                          4: product.review?.fourStarPercent || 0,
                          3: product.review?.threeStarPercent || 0,
                          2: product.review?.twoStarPercent || 0,
                          1: product.review?.oneStarPercent || 0,
                        }}
                      />

                      {/* 사진 그리드(주의: 내부가 세로 FlatList면 View+map 버전으로 바꾸기) */}
                      <View className='mt-4 pb-5'>
                        <PhotoCard
                          images={reviewPhotos}
                          maxPreview={6}
                          onPressPhoto={(idx) => console.log('사진 클릭', idx)}
                          onPressMore={() =>
                            router.push(`/product/${id}/review/allPhoto`)
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
                    <ReviewItems reviewItem={item} id={id} />
                    <View className='w-[200%] h-[1px] left-[-50%] bg-gray-50' />
                  </View>
                )
              : undefined
          }
          ListFooterComponent={<View style={{ height: 24 }} />}
        />
      </PortalProvider>
    </SafeAreaView>
  );
}

/* 그대로 사용 */
function IngredientSection({ product }: { product: any }) {
  return (
    <View className='p-5'>
      <View className='flex-row mb-[10px]'>
        <Text className='text-b-lg font-bold mb-2'>기능성 원료 </Text>
        <Text className='text-b-lg font-extrabold text-green-500'>
          {product?.ingredientsCount ?? 0}개
        </Text>
      </View>
      {product?.ingredients.map((item: any, index: any) => (
        <MaterialInfo key={index} materialInfo={item} />
      ))}
    </View>
  );
}
