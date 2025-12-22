import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
interface BottomSheetLayoutProps {
  children: React.ReactNode;
  snapPoints?: number[];
  sheetRef?: React.RefObject<BottomSheet | null>;
}

export default function BottomSheetLayout({
  children,
  snapPoints,
  sheetRef,
}: BottomSheetLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        // index -1(닫힘) → 숨김, index 0 이상(열림) → 보임
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        // 배경을 터치해도 닫히지 않고, 대신 터치만 막고 싶다면 'none'
        // 배경 터치로 시트를 닫고 싶다면 'close' 로 바꾸세요.
        pressBehavior='close'
        opacity={0.5} // 딤 투명도 (0~1)
      />
    ),
    [],
  );

  const handleChange = useCallback((index: number) => {
    console.log(index);
    setIsOpen(index >= 0);
  }, []);

  return (
    <View
      pointerEvents={isOpen ? 'auto' : 'none'}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={handleChange}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        handleIndicatorStyle={{ opacity: 1 }}
      >
        <BottomSheetView>{children}</BottomSheetView>
      </BottomSheet>
    </View>
  );
}
