import { IBannerCell } from '@/types/models/main';
import { useState } from 'react';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

interface BannerCarouselProps {
  data: IBannerCell[];
  onPress: (index: number) => void;
}

export default function BannerCarousel({ data, onPress }: BannerCarouselProps) {
  const screenWidth = Dimensions.get('window').width;
  const ITEM_SIZE = screenWidth;

  const [activeIndex, setActiveIndex] = useState(0);

  const renderBannerItem = ({ item }: { item: IBannerCell }) => (
    <Pressable
      onPress={() => onPress(activeIndex)}
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        className='bg-white rounded-2xl overflow-hidden shadow-lg'
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Image
          source={item.image}
          resizeMode='contain'
          className='w-full h-full'
        />
        <View className='absolute left-8 bottom-8'>
          <Text className='text-white text-2xl font-bold'>{item.title}</Text>
          <Text className='text-white text-lg font-bold mt-1'>
            {item.subTitle}
          </Text>
        </View>
        <View className='absolute top-5 right-5 bg-black/40 px-4 py-1 rounded-full'>
          <Text className='text-white text-sm font-semibold'>
            {activeIndex + 1} / {data.length}
          </Text>
        </View>
      </View>
    </Pressable>
  );
  const progress = useSharedValue<number>(0);

  return (
    <Carousel
      autoPlay
      autoPlayInterval={5000}
      data={data}
      height={ITEM_SIZE}
      loop={true}
      pagingEnabled={true}
      snapEnabled={true}
      width={Dimensions.get('window').width}
      style={{
        width: Dimensions.get('window').width,
      }}
      mode='parallax'
      modeConfig={{
        parallaxScrollingScale: 0.85,
        parallaxScrollingOffset: 70,
      }}
      onProgressChange={progress}
      renderItem={renderBannerItem}
      onSnapToItem={(index) => setActiveIndex(index)}
    />
  );
}
