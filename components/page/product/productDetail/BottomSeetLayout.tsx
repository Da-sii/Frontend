import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import React, { useCallback } from 'react';

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
  return (
    <Portal>
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <BottomSheetView className=''>{children}</BottomSheetView>
      </BottomSheet>
    </Portal>
  );
}
