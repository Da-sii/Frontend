// src/components/common/PhotoCard.tsx
import React from 'react';
import { FlatList, Image, Pressable, Text } from 'react-native';
import { toCdnUrl } from '@/utils/cdn';

interface PhotoCardProps {
  images: string[]; // 이미지 URL 배열
  maxPreview?: number; // 몇 장만 미리보기 (기본 6장)
  onPressPhoto?: (index: number) => void; // 개별 사진 눌렀을 때
  onPressMore?: () => void; // "+더보기" 눌렀을 때
  total_photo?: number;
}

export default function PhotoCard({
  images,
  maxPreview = 6,
  onPressPhoto,
  onPressMore,
  total_photo,
}: PhotoCardProps) {
  const remain =  total_photo ? total_photo - images.length : 0;

  return (
    <FlatList
      data={images}
      numColumns={3}
      keyExtractor={(_, idx) => String(idx)}
      columnWrapperStyle={{
        gap: 7,
        marginBottom: 7,
        justifyContent: 'flex-start',
      }}
      renderItem={({ item, index }) => {
        const isLastOverlay = remain > 0 && index === images.length - 1;

        return (
          <Pressable
            key={index}
            className='w-[32%] aspect-square rounded-[8px] overflow-hidden relative'
            onPress={() =>
              isLastOverlay ? onPressMore?.() : onPressPhoto?.(index)
            }
          >
            <Image
              source={{ uri: toCdnUrl(item) }}
              className='w-full h-full'
              resizeMode='cover'
            />

            {isLastOverlay && (
              <Pressable
                className='absolute w-full h-full inset-0 bg-black/50 items-center justify-center'
                onPress={onPressMore}
              >
                <Text className='text-white font-extrabold text-b-sm'>
                  +{total_photo ? total_photo - 5 : 0}
                </Text>
                <Text className='text-white font-extrabold text-b-sm mt-[7px]'>
                  사진 더보기
                </Text>
              </Pressable>
            )}
          </Pressable>
        );
      }}
    />
  );
}
