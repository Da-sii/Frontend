import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import HomeIcon from '@/assets/icons/ic_home.svg';
import SearchIcon from '@/assets/icons/ic_magnifier.svg';
import StarIcon from '@/assets/icons/ic_star.svg';
import Navigation from '@/components/layout/Navigation';
import MaterialInfo from '@/components/page/productDetail/materialInfo';
import CustomTabs from '@/components/page/productDetail/tab';
import colors from '@/constants/color';
import { mockProductData } from '@/mocks/data/productDetail';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const tabs = [
  { key: 'ingredient', label: '성분 정보' },
  { key: 'review', label: '리뷰' },
];
export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  // mock 데이터에서 해당 id 제품 찾기
  const product = mockProductData.find((item) => item.id === id);

  const [activeTab, setActiveTab] = useState<'ingredient' | 'review'>(
    'ingredient',
  );

  if (!product) {
    return <Text>제품을 찾을 수 없습니다.</Text>;
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />}
        onLeftPress={() => router.back()}
        right={<SearchIcon width={20} height={20} fill={colors.gray[900]} />}
        secondRight={
          <HomeIcon width={20} height={20} fill={colors.gray[900]} />
        }
        onRightPress={() => router.push('/home/search')}
      />

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        {/* 상품 이미지 */}
        <View className='h-[390px] w-full'>
          {product.image ? (
            <Image source={product.image} className='w-full h-full' />
          ) : (
            <View className='border-gray-100 border w-full h-full mx-auto'>
              <Text className='text-b-lg font-bold text-gray-500 w-fit mx-auto my-auto'>
                상품 이미지를 준비중입니다.
              </Text>
            </View>
          )}
        </View>
        {/* 상품 정보 헤더  */}
        <View className='flex-col gap-y-5 border-gray-100 border-b py-5 px-5'>
          <View className='flex-col gap-[15px]'>
            <Text className='text-b-sm font-bold'>{product.brand}</Text>
            <Text className='text-h-md font-bold'>{product.name}</Text>
            <View className='flex-row items-center'>
              <StarIcon />
              <Text className='text-c1 font-nomal text-gray-400 ml-[3px]'>
                {product.rating} ({product.reviewCount})
              </Text>
            </View>
          </View>
          <View className='flex-row items-center'>
            <Text className='text-b-lg font-bold '>정가 </Text>
            <Text className='text-h-md font-extrabold'>{product.price}원 </Text>
            <Text className='text-c1 font-bold text-gray-300'>
              / {product.weight}g
            </Text>
          </View>
        </View>

        {/* 랭킹 및 영양 정보 */}
        <View className='flex-col gap-y-4 border-gray-100 border-b-[3px] py-5 px-5'>
          <View className='flex-row '>
            <Text className='text-c2 font-nomal text-gray-400 mr-[26px] w-[46px]'>
              랭킹
            </Text>
            <View className='flex-col'>
              {product.ranking?.map((item, index) => (
                <Text key={index} className='text-c2 font-nomal'>
                  {item.title}
                </Text>
              ))}
            </View>
          </View>
          <View className='flex-row '>
            <Text className='text-c2 font-nomal text-gray-400 w-[46px] mr-[26px]'>
              영양정보
            </Text>
            <Text className='text-c2 font-nomal '>{product.antelope} </Text>
          </View>
        </View>

        {/* 하단 정보 */}
        <CustomTabs
          tabs={tabs}
          value={activeTab}
          onChange={(key) => setActiveTab(key as 'ingredient' | 'review')}
        />

        {/* 탭에 따른 내용 */}
        {activeTab === 'ingredient' && (
          <IngredientSection product={product.ingredients} />
        )}
        {activeTab === 'review' && <ReviewSection productId={product.id} />}
      </ScrollView>
    </SafeAreaView>
  );
}

function IngredientSection({
  product,
}: {
  product: (typeof mockProductData)[number]['ingredients'];
}) {
  return (
    <View className='p-5'>
      {/* 성분/영양 등 상세 */}
      <View className='flex-row mb-[10px]'>
        <Text className='text-b-lg font-bold mb-2'>기능성 원료 </Text>
        <Text className='text-b-lg font-extrabold text-green-500'>
          {product?.materials}개
        </Text>
      </View>

      {product?.materialInfo.map((item, index) => {
        return <MaterialInfo key={index} materialInfo={item} />;
      })}
    </View>
  );
}

function ReviewSection({ productId }: { productId: string }) {
  // 서버/목데이터로 리뷰 불러오기 로직 자리
  return (
    <View className='p-5'>
      <Text className='text-b-md font-bold mb-2'>리뷰</Text>
      <Text className='text-c2 text-gray-600'>
        아직 등록된 리뷰가 없습니다.
      </Text>
    </View>
  );
}
