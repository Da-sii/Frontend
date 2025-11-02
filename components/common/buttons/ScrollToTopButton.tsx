// components/common/buttons/ScrollToTopButton.tsx
import ArrowUpIcon from '@/assets/icons/ic_top_button.svg';
import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

type Props = {
  scrollRef: any; // ScrollView/FlatList 어댑터
  visible: boolean; // 부모에서 내려주는 보임 여부
};

export const ScrollToTopButton = ({ scrollRef, visible }: Props) => {
  // Animated.Value는 렌더마다 새로 만들면 안 보일 수 있음 -> useRef로 고정
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: visible ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [visible, fade]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={{
        opacity: fade,
        position: 'absolute',
        right: 20,
        bottom: 100,
        zIndex: 50,

        // ✅ iOS용 shadow
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },

        // ✅ Android용 그림자
        elevation: 4,
        backgroundColor: 'white',
        borderRadius: 999,
      }}
    >
      <Pressable
        onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
        className='rounded-full items-center justify-center w-[36px] h-[36px]'
        android_ripple={{ borderless: true }}
      >
        <ArrowUpIcon />
      </Pressable>
    </Animated.View>
  );
};
