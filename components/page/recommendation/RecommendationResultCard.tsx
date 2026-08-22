import { RecommendationItem } from '@/services/recommendation';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

type RecommendationResultCardProps = {
  item: RecommendationItem;
  rank: number;
};

export default function RecommendationResultCard({
  item,
  rank,
}: RecommendationResultCardProps) {
  const router = useRouter();
  const isTopRank = rank === 1;
  const score = Math.max(0, Math.min(100, item.fit_score));

  return (
    <View
      className={`rounded-[20px] border bg-white px-[16px] pb-[20px] pt-[30px] ${
        isTopRank ? 'border-green-500' : 'border-gray-300'
      }`}
      style={{
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View
        className={`absolute -left-px -top-px h-[30px] w-[30px] items-center justify-center rounded-br-[10px] rounded-tl-[20px] ${
          isTopRank ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <Text className='text-sm text-white font-n-eb'>{rank}</Text>
      </View>

      <Text className='ml-[14px] font-n-eb text-lg leading-[24px] text-gray-900'>
        {item.ingredient_name}
      </Text>
      <Text className='ml-[14px] mt-[8px] font-n-bd text-c2 leading-[19px] text-gray-600'>
        {item.intro}
      </Text>

      <View className='mt-[12px] flex-row rounded-[10px] bg-green-50 px-[12px] py-[8px]'>
        <Text className='flex-1 font-n-rg text-c3 leading-[16px] text-gray-400'>
          💡 {item.reason}
        </Text>
      </View>

      <View className='flex-row items-center border-b py-[12px] border-[#F5F5F5]'>
        <Text className='text-gray-400 font-n-eb text-c3'>적합도</Text>
        <View className='ml-[10px] h-[6px] flex-1 flex-row overflow-hidden rounded-full bg-gray-100'>
          <View style={{ flex: score }} className='bg-green-500' />
          <View style={{ flex: 100 - score }} />
        </View>
        <Text className='ml-[10px] font-n-eb text-c3 text-green-600'>
          {score}%
        </Text>
      </View>

      <Text className='mt-[12px] font-n-eb text-c3 text-gray-500'>
        이 성분 함유 제품
      </Text>

      {item.products.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='mt-[8px] gap-x-[12px]'
        >
          {item.products.map((product) => (
            <Pressable key={product.id} className='w-[100px]'>
              <Image
                source={{ uri: product.thumbnail ?? '' }}
                style={{ width: 100, aspectRatio: 1, borderRadius: 10 }}
                resizeMode='cover'
              />
              <Text
                className='ml-[2px] text-c2 font-n-bd'
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {product.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View className='mt-[10px] h-[70px] items-center justify-center rounded-[10px] bg-gray-50'>
          <Text className='font-n-rg text-[12px] text-gray-400'>
            관련 제품을 준비 중입니다.
          </Text>
        </View>
      )}
    </View>
  );
}
