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
  const { data: randomProducts, isLoading, isError } = useGetThreeRandomProduct();

  const products = randomProducts?.products ?? []; // <= 안전한 기본값

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

        {isLoading && <Text className='text-g-sm'>추천 상품을 불러오는 중…</Text>}
        {isError && <Text className='text-g-sm'>불러오기에 실패했어요.</Text>}

        <View style={{ rowGap: 20 }}>
          {products.slice(0, 3).map((p, i) => (
            <ProductCard
              key={p?.id ?? `placeholder-${i}`}
              brand={p?.company ?? ''}
              name={p?.name ?? ''}
              image={typeof p?.image === 'string' ? p.image : ''}
              buttonName='리뷰쓰기'
              onPress={() => {
                if (!p?.id) return; // 안전 가드
                router.push({
                  pathname: `/product/${p.id}/review/write` as any,
                  params: {
                    id: String(p.id),
                    name: p?.name ?? '',
                    brand: p?.company ?? '',
                    image: typeof p?.image === 'string' ? p.image : '',
                  },
                });
              }}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
