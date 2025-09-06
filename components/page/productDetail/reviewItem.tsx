import MoreIcon from '@/assets/icons/productDetail/ic_more_line.svg';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextLayoutEventData,
  View,
} from 'react-native';
import ReviewStar from './ReviewStar';
interface reviewItem {
  name: string;
  date: string;
  isEdited: boolean;
  content: string;
  rating: number;
  images: any[];
}

interface reviewItemProups {
  reviewItem: reviewItem;
}

export default function ReviewItems({ reviewItem }: reviewItemProups) {
  const [isOpen, setIsOpen] = useState(false);
  const [measured, setMeasured] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);

  const MAX_LINES = 5;
  const MAX_HEIGHT = 100;

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (measured) return;
      const lines = e.nativeEvent.lines ?? [];
      const totalHeight = lines.reduce((sum, l) => sum + (l.height ?? 0), 0);
      const shouldClamp = lines.length > MAX_LINES || totalHeight > MAX_HEIGHT;

      setNeedsClamp(shouldClamp);
      setMeasured(true);
    },
    [measured],
  );

  // ====== 이미지 가로 스크롤 세팅 ======
  const THUMB = 100; // 썸네일 한 변(px)
  const GAP = 12; // 카드 간격(px)

  // reviewItem.images가 string[]/object[] 혼용일 수 있으니 URL로 정규화
  const imageUris: string[] = (reviewItem.images ?? [])
    .map((it: any) => (typeof it === 'string' ? it : (it?.url ?? '')))
    .filter(Boolean);

  return (
    <View className='w-full p-5'>
      <View className='flex-row justify-between mb-[19px]'>
        <View className='flex-col'>
          <Text className ="mb-[5px]">{reviewItem.name}</Text>
          <View className='flex-row items-center '>
            <ReviewStar height={12} reviewRank={reviewItem.rating} />
            <Text className='border-l ml-1 pl-1 border-[#E4E6E7] text-c3 font-bold text-gray-300'>
              {reviewItem.date}
              {reviewItem.isEdited && '  수정됨'}
            </Text>
          </View>
        </View>
        <MoreIcon className='my-auto' />
      </View>
      <View>
        <Text
          className='text-[13px] font-normal'
          numberOfLines={!isOpen && needsClamp ? MAX_LINES : undefined}
          ellipsizeMode='tail'
          onTextLayout={onTextLayout}
        >
          {reviewItem.content}
        </Text>

        {needsClamp && (
          <Pressable
            onPress={() => setIsOpen((v) => !v)}
            accessibilityRole='button'
            accessibilityLabel={isOpen ? '접기' : '더보기'}
            className='mt-[7px] self-start '
            hitSlop={8}
          >
            <Text className='text-c2 font-regular text-gray-400'>
              {isOpen ? '접기' : '더보기'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* 이미지: 가로 스크롤 썸네일 리스트 */}
      {imageUris.length > 0 && (
        <FlatList
          className='mt-3'
          data={imageUris}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_: any, idx: number) => `img-${idx}`}
          // 좌우 여백과 아이템 간 간격
          contentContainerStyle={{}}
          ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
          // 스냅(옵션): 카드 하나 단위로 착 붙게
          snapToInterval={THUMB + GAP}
          decelerationRate='fast'
          snapToAlignment='start'
          // iOS에서 스냅 부드럽게(옵션)
          // pagingEnabled={false}
          renderItem={({ item, index }: { item: string; index: number }) => (
            <Pressable
              onPress={() => {
                // TODO: 이미지 뷰어 열기 등
                // router.push({ pathname: '/viewer', params: { start: index } })
              }}
              className='rounded-[12px] overflow-hidden'
              style={{ width: THUMB, height: THUMB }}
            >
              <Image
                source={{ uri: item }}
                resizeMode='cover'
                style={{ width: '100%', height: '100%' }}
              />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
