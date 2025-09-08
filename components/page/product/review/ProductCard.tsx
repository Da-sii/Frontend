import { LongButton } from '@/components/common/buttons/LongButton';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface ProductCardProps {
  brand: string;
  name: string;
  image: string;
  onPress: () => void;
  buttonName: string;
}

export default function ProductCard({
  brand,
  name,
  onPress,
  buttonName,
  image,
}: ProductCardProps) {
  return (
    <View className='w-full p-5 border border-gray-100 bg-white rounded-[12px]'>
      <View className='flex-row mb-5'>
        <View className=' w-[14%] aspect-square mr-[10px] border-gray-100 border rounded-[10px]'>
          {image ? (
            typeof image === 'string' ? (
              <Image source={{ uri: image }} className='w-full h-full' />
            ) : (
              <Image source={image as any} className='w-full h-full' />
            )
          ) : (
            <View className='border-gray-100 w-full h-full items-center justify-center'>
              <Text className='text-b-lg font-bold text-gray-500'>?</Text>
            </View>
          )}
        </View>

        <View className='gap-y-[7px] flex-1'>
          <Text
            className='text-c2 text-gray-500'
            ellipsizeMode='tail'
            numberOfLines={1}
          >
            {brand}
          </Text>
          <Text
            className='text-b-sm font-bold'
            ellipsizeMode='tail'
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      </View>

      <LongButton label={buttonName} onPress={onPress} />
    </View>
  );
}
