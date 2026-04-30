import { IBannerCell } from '@/types/models/main';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

interface BannerCarouselProps {
  data: IBannerCell[];
}

export default function BannerCarousel({ data }: BannerCarouselProps) {
  const screenWidth = Dimensions.get('window').width;
  const ITEM_SIZE = screenWidth;

  const [activeIndex, setActiveIndex] = useState(0);

  const router = useRouter();
  const renderBannerItem = ({
    item,
    index,
  }: {
    item: IBannerCell;
    index: number;
  }) => {
    const isFocused = activeIndex === index;

    return (
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/home/banner',
            params: { id: item.id },
          });
        }}
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
            <Text className='text-white text-2xl font-n-bd'>{item.title}</Text>
            <Text className='text-white text-lg font-n-bd mt-1'>
              {item.subTitle}
            </Text>
          </View>
          {isFocused && (
            <View className='absolute top-5 right-5 bg-black/40 px-4 py-1 rounded-full'>
              <Text className='text-white text-sm font-n-bd'>
                {activeIndex + 1} / {data.length}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

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
        parallaxScrollingScale: 0.8,
      }}
      onProgressChange={(_, absoluteProgress) => {
        const index = Math.round(absoluteProgress);
        const realIndex = ((index % data.length) + data.length) % data.length;
        if (realIndex !== activeIndex) {
          setActiveIndex(realIndex);
        }
      }}
      renderItem={renderBannerItem}
      onSnapToItem={(index) => setActiveIndex(index)}
    />
  );
}
