import MoreIcon from '@/assets/icons/product/productDetail/ic_more_line.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import BottomSheetLayout from '@/components/page/product/productDetail/BottomSeetLayout';
import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextLayoutEventData,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
  onMorePress?: () => void;
}

const REASONS = [
  '제품과 관련 없는 이미지 / 내용',
  '제품 미사용 / 리뷰 내용과 다른 제품 선택',
  '광고 홍보 / 거래 시도',
  '욕설, 비속어가 포함된 내용',
  '개인 정보 노출',
];

type SheetView = 'menu' | 'report';

export default function ReviewItems({ reviewItem }: reviewItemProups) {
  const [isOpen, setIsOpen] = useState(false);
  const [measured, setMeasured] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const [sheetView, setSheetView] = useState<SheetView>('menu');
  const [selected, setSelected] = useState<number | null>(null);

  const MAX_LINES = 5;
  const MAX_HEIGHT = 100;

  // ===== BottomSheet =====
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [154], [414]);
  const openSheet = () => {
    setSheetView('menu'); // 항상 메뉴부터
    sheetRef.current?.snapToIndex?.(0); // 첫 스냅으로 열기
  };
  const closeSheet = () => sheetRef.current?.close();

  const goReport = () => {
    setSheetView('report');
    sheetRef.current?.snapToIndex(1);
  };

  const submitReport = async () => {
    if (selected == null) return;
    // TODO: 신고 API 호출
    // await reportReview({ reviewId: reviewItem.id, reason: REASONS[selected] });
    closeSheet();
  };

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
          <Text className='mb-[5px]'>{reviewItem.name}</Text>
          <View className='flex-row items-center '>
            <ReviewStar height={12} reviewRank={reviewItem.rating} />
            <Text className='border-l ml-1 pl-1 border-[#E4E6E7] text-c3 font-bold text-gray-300'>
              {reviewItem.date}
              {reviewItem.isEdited && '  수정됨'}
            </Text>
          </View>
        </View>
        <Pressable onPress={openSheet} hitSlop={8} className='my-auto'>
          <MoreIcon className='my-auto' />
        </Pressable>
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

      {/* 신고하기 */}
      <BottomSheetLayout snapPoints={snapPoints} sheetRef={sheetRef}>
        {sheetView === 'menu' ? (
          // ===== 메뉴 화면 =====
          <View className='px-5 pt-[30px] pb-[44px]'>
            <Pressable onPress={goReport} hitSlop={8}>
              <Text className='text-b-sm font-bold mb-[25px]'>신고하기</Text>
            </Pressable>
            <Pressable onPress={closeSheet} hitSlop={8}>
              <Text className='text-b-sm font-bold text-gray-400'>닫기</Text>
            </Pressable>
          </View>
        ) : (
          // ===== 신고 사유 선택 화면 =====
          <View className='px-5 pt-[30px] pb-[45px]'>
            <View className='flex-row items-center justify-between'>
              <Text className='text-b-md font-extrabold text-gray-700 mb-[25px]'>
                이 리뷰를 신고하는 이유가 무엇인가요?
              </Text>
            </View>

            <View className='gap-y-[25px] mb-[25px]'>
              {REASONS.map((label, idx) => {
                const checked = selected === idx;
                return (
                  <Pressable
                    key={idx}
                    onPress={() => setSelected(idx)}
                    className='flex-row items-center '
                    hitSlop={8}
                  >
                    <Svg width={18} height={18} viewBox='0 0 18 18' fill='none'>
                      <Path
                        d='M16.5 4.5L6.5 15L1.5 9'
                        stroke={checked ? '#181A1B' : '#C9CDD2'}
                        strokeWidth={1.5}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </Svg>

                    <Text
                      className={`ml-[13px] font-bold text-b-sm ${
                        !checked && 'text-b-sm text-gray-400'
                      }`}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <LongButton
              label='리뷰 신고 완료'
              onPress={submitReport}
              disabled={selected === null}
            />
          </View>
        )}
      </BottomSheetLayout>
    </View>
  );
}
