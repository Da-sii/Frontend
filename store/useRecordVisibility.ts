import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// 그래프 카드의 보기/숨김(프라이버시) 설정. 기기에 영구 저장.
interface RecordVisibilityState {
  isVisible: boolean; // true = 보기, false = 숨김
  toggle: () => void;
  setVisible: (v: boolean) => void;
}

export const useRecordVisibility = create<RecordVisibilityState>()(
  persist(
    (set) => ({
      isVisible: true,
      toggle: () => set((s) => ({ isVisible: !s.isVisible })),
      setVisible: (v) => set({ isVisible: v }),
    }),
    {
      name: 'record-visibility',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
