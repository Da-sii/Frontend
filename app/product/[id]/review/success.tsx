import XIcon from '@/assets/icons/ic_x.svg';
import Navigation from '@/components/layout/Navigation';
import ProductCard from '@/components/page/product/review/ProductCard';
import { mockProductData } from '@/mocks/data/productDetail';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function sucess() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // 제품 id
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const product = mockProductData.find((item) => item.id === id);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        title='리뷰 작성 완료'
        right={<XIcon width={18} height={18} />}
        onRightPress={() => {
          router.back();
          router.back();
        }}
      />

      <View className='p-5'>
        <Text className='text-b-sm font-extrabold mb-5'>
          이 제품을 써 봤다면 리뷰를 남겨주세요!
        </Text>

        <View style={{ rowGap: 20 }}>
          <ProductCard
            brand={product?.brand || ''}
            name={product?.name || ''}
            image={product?.image}
            onPress={() => {
              router.push(`/product/${id}/review/write`);
            }}
            buttonName='리뷰 작성'
          />
          <ProductCard
            brand={product?.brand || ''}
            name={product?.name || ''}
            image={product?.image}
            onPress={() => {
              router.push(`/product/${id}/review/write`);
            }}
            buttonName='리뷰 작성'
          />
          <ProductCard
            brand={product?.brand || ''}
            name={product?.name || ''}
            image={product?.image}
            onPress={() => {
              router.push(`/product/${id}/review/write`);
            }}
            buttonName='리뷰 작성'
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
