import {
  dayNumber,
  todayKey,
  weekdayLabel,
  weekStripKeys,
} from '@/utils/recordDate';
import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface WeekStripProps {
  selectedDate: string;
  onSelectDate: (key: string) => void;
}

export default function WeekStrip({
  selectedDate,
  onSelectDate,
}: WeekStripProps) {
  const today = todayKey();
  const days = useMemo(() => weekStripKeys(selectedDate), [selectedDate]);
  const containerRef = useRef<View>(null);
  const containerX = useRef(0);
  const containerW = useRef(0);

  const translateX = useRef(new Animated.Value(0)).current;
  const prevDays = useRef(days);

  useEffect(() => {
    const prev = prevDays.current;
    const prevCenter = prev[3];
    const nextCenter = days[3];
    if (prevCenter === nextCenter) return;

    const prevIndex = prev.indexOf(nextCenter);
    if (prevIndex !== -1) {
      const cellW = containerW.current / 7;
      const delta = (prevIndex - 3) * cellW;
      translateX.setValue(delta);
    } else {
      const cellW = containerW.current / 7;
      translateX.setValue(nextCenter > prevCenter ? cellW * 7 : -cellW * 7);
    }

    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();

    prevDays.current = days;
  }, [days]);

  const getKeyFromX = (x: number) => {
    const index = Math.floor(
      (x - containerX.current) / (containerW.current / days.length),
    );
    const clamped = Math.max(0, Math.min(days.length - 1, index));
    return days[clamped];
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e) => {
        const key = getKeyFromX(e.nativeEvent.pageX);
        if (key) onSelectDate(key);
      },
    }),
  ).current;

  return (
    <View
      ref={containerRef}
      onLayout={(e) => {
        containerW.current = e.nativeEvent.layout.width;
        containerRef.current?.measure((_x, _y, _w, _h, pageX) => {
          containerX.current = pageX;
        });
      }}
      className='w-full border-t border-b border-gray-50 h-[55px] overflow-hidden my-5'
      {...panResponder.panHandlers}
    >
      <Animated.View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          transform: [{ translateX }],
        }}
      >
        {days.map((key) => {
          const isToday = key === today;
          const isSelected = key === selectedDate;

          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.7}
              onPress={() => onSelectDate(key)}
              className='flex-1 items-center justify-center gap-[3px]'
            >
              <View
                className={`items-center justify-center w-[18px] h-[18px] rounded-full ${
                  isSelected ? 'bg-green-300' : ''
                }`}
              >
                <Text
                  className={`text-c3 font-n-bd ${
                    isSelected ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {weekdayLabel(key)}
                </Text>
              </View>
              <View className='relative'>
                <Text className={'text-c2 font-n-bd text-gray-500'}>
                  {dayNumber(key)}
                </Text>
                {isToday && (
                  <View className='absolute -top-[1px] right-[-5px] w-[4px] h-[4px] rounded-full bg-green-400' />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
}
