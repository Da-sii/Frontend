import XIcon from '@/assets/icons/ic_x.svg';
import Navigation from '@/components/layout/Navigation';
import ProductCard from '@/components/page/product/review/ProductCard';
import { useGetThreeRandomProduct } from '@/hooks/product/useGetRandomProduct';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function sucess() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // 제품 id
  const { data: randomProducts } = useGetThreeRandomProduct();
  console.log('randomProducts', randomProducts);
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />

      <Navigation
        title='리뷰 작성 완료'
        right={<XIcon width={18} height={18} />}
        onRightPress={() => {
          router.replace(`/product/${id}/productDetail` as any);
        }}
      />

      <View className='p-5'>
        <Text className='text-b-sm font-extrabold mb-5'>
          이 제품을 써 봤다면 리뷰를 남겨주세요!
        </Text>

        <View style={{ rowGap: 20 }}>
          <ProductCard
            brand={randomProducts?.products[0].company || ''}
            name={randomProducts?.products[0].name || ''}
            image={randomProducts?.products[0].image || ''}
            onPress={() => {
              router.push({
                pathname:
                  `/product/${randomProducts?.products[0].id}/review/write` as any,
                params: {
                  id: String(randomProducts?.products[0].id), // 제품아이디
                  name: randomProducts?.products[0].name ?? '', // 제품명
                  brand: randomProducts?.products[0].company ?? '', // 회사명
                  image:
                    typeof randomProducts?.products[0].image === 'string'
                      ? randomProducts?.products[0].image
                      : '', // URL만 보내기
                },
              });
            }}
            buttonName='리뷰쓰기'
          />

          <ProductCard
            brand={randomProducts?.products[1].company || ''}
            name={randomProducts?.products[1].name || ''}
            image={randomProducts?.products[1].image || ''}
            onPress={() => {
              router.push({
                pathname:
                  `/product/${randomProducts?.products[1].id}/review/write` as any,
                params: {
                  id: String(randomProducts?.products[1].id), // 제품아이디
                  name: randomProducts?.products[1].name ?? '', // 제품명
                  brand: randomProducts?.products[1].company ?? '', // 회사명
                  image:
                    typeof randomProducts?.products[1].image === 'string'
                      ? randomProducts?.products[1].image
                      : '', // URL만 보내기
                },
              });
            }}
            buttonName='리뷰쓰기'
          />

          <ProductCard
            brand={randomProducts?.products[2].company || ''}
            name={randomProducts?.products[2].name || ''}
            image={randomProducts?.products[2].image || ''}
            onPress={() => {
              router.push({
                pathname:
                  `/product/${randomProducts?.products[2].id}/review/write` as any,
                params: {
                  id: String(randomProducts?.products[2].id), // 제품아이디
                  name: randomProducts?.products[2].name ?? '', // 제품명
                  brand: randomProducts?.products[2].company ?? '', // 회사명
                  image:
                    typeof randomProducts?.products[2].image === 'string'
                      ? randomProducts?.products[2].image
                      : '', // URL만 보내기
                },
              });
            }}
            buttonName='리뷰쓰기'
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
