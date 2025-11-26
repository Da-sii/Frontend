import { Dimensions, FlatList, Image, Text, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 3;

interface ProductItem {
  id: string;
  image: string;
  name: string;
  rating: number;
  price: number;
}

interface ProductCarouselProps {
  data: ProductItem[];
}

export default function ProductCarousel({ data }: ProductCarouselProps) {
  const renderRankingItem = ({
    item,
    index,
  }: {
    item: ProductItem;
    index: number;
  }) => (
    <View
      key={item.id}
      className='w-36 mr-1 rounded-xl bg-white py-3 max-w-[144px]'
      style={{ marginLeft: index === 0 ? 0 : 8 }}
    >
      <View className='absolute top-3 left-1 bg-green-500 px-2 py-1 rounded-full mb-1 z-10'>
        <Text className='text-white text-xs font-bold'>{index + 1}</Text>
      </View>
      <Image
        source={{ uri: item.image }}
        resizeMode='cover'
        className='w-full aspect-square rounded-lg bg-gray-box'
        style={{ width: cardWidth, height: cardWidth }}
      />
      <Text
        className='text-xs mt-2 mb-1 font-medium text-gray-800'
        numberOfLines={1}
      >
        {item.name}
      </Text>
      <View className='flex-row items-center gap-1 mb-1'>
        <Text className='text-yellow-star text-xs'>★</Text>
        <Text className='text-xs text-gray-600'>{item.rating} (리뷰수)</Text>
      </View>
      <Text className='text-sm text-gray-900 font-semibold'>
        정가 {item.price.toLocaleString('ko-KR')}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderRankingItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
}
