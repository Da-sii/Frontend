import CheckIcon from '@/assets/icons/ic_check.svg';
import colors from '@/constants/color';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

const SORT_OPTIONS = [
  { id: 'monthly_rank', label: '랭킹순' },
  { id: 'review_desc', label: '리뷰순' },
];

interface SortBottomSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  selected: string;
  onSelect: (id: string) => void;
}

export function SortBottomSheet({
  sheetRef,
  selected,
  onSelect,
}: SortBottomSheetProps) {
  const snapPoints = useMemo(() => ['30%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior='close'
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      index={-1}
      backgroundStyle={{ backgroundColor: '#fff' }}
      handleIndicatorStyle={{ backgroundColor: colors.gray[100] }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView className='flex-1 px-6 py-4 rounded-2xl'>
        <View className='space-y-2'>
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              className='flex-row items-center justify-between px-8 py-2'
            >
              <Text
                className={`text-base ${
                  selected === option.id
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-500 font-normal'
                }`}
              >
                {option.label}
              </Text>
              {selected === option.id && <CheckIcon width={14} height={14} />}
            </Pressable>
          ))}
        </View>
        <View className='h-8' />
      </BottomSheetView>
    </BottomSheet>
  );
}
