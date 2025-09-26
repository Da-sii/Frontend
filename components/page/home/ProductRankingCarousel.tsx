import IndexIcon from '@/assets/icons/ic_ranking_index.svg';
import ProductGridItemSkeleton from '@/components/common/skeleton/ProductGridItemSkeleton';
import colors from '@/constants/color';
import { IRankingProduct } from '@/types/models/product';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 3;

interface Props {
  data: IRankingProduct[];
  isLoading: boolean;
}

export default function ProductRankingCarousel({ data, isLoading }: Props) {
  const router = useRouter();

  const renderRankingItem = ({
    item,
    index,
  }: {
    item: IRankingProduct;
    index: number;
  }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/product/[id]/productDetail',
          params: { id: item.id },
        })
      }
    >
      <View
        key={item.id}
        className='mr-1 rounded-xl bg-white py-3 max-w-[144px]'
        style={{ width: cardWidth, marginLeft: index === 0 ? 0 : 8 }}
      >
        <View className='w-full aspect-square rounded-xl bg-gray-box'>
          {item.image !== null ? (
            <Image
              source={{ uri: item.image }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode='cover'
            />
          ) : (
            <View className='w-full h-full bg-white items-center justify-center border border-gray-100 rounded-xl'>
              <Text className='text-gray-500 text-xs'>상품 이미지를</Text>
              <Text className='text-gray-500 text-xs'>준비중입니다</Text>
            </View>
          )}
        </View>
        <View
          style={{
            position: 'absolute',
            top: 17,
            left: 10,

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IndexIcon
            className='absolute'
            fill={index < 3 ? colors.green[500] : colors.gray[400]}
          />
          <Text className='text-white text-xs font-semibold'>{index + 1}</Text>
        </View>
        <Text className='text-xs mt-1 text-gray-400' numberOfLines={1}>
          {item.company}
        </Text>
        <Text className='text-sm font-medium text-gray-800' numberOfLines={1}>
          {item.name}
        </Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center' }}
          className='mb-2'
        >
          <Text className='mr-1 text-yellow-star text-xs'>★</Text>
          <Text className='text-gray-500 mr-1 text-xs'>
            {item.reviewAvg || (0).toFixed(2)}
          </Text>
          <Text className='text-xs text-gray-300'>({item.reviewCount})</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text className='mr-1 text-xs'>정가</Text>
          <Text className='text-base text-gray-900 mr-1'>{item.price}원</Text>
        </View>
      </View>
    </Pressable>
  );

  if (isLoading) {
    return (
      <FlatList
        data={Array.from({ length: 5 })}
        renderItem={() => (
          <View className='mr-2'>
            <ProductGridItemSkeleton
              style={{ width: cardWidth }}
              imageStyle={{ width: cardWidth, height: cardWidth }}
            />
          </View>
        )}
        keyExtractor={(_, index) => `skeleton-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderRankingItem}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
}
