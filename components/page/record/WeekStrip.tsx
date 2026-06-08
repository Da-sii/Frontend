import {
  dayNumber,
  todayKey,
  weekdayLabel,
  weekStripKeys,
} from '@/utils/recordDate';
import { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface WeekStripProps {
  selectedDate: string;
  onSelectDate: (key: string) => void;
}

/**
 * 오늘을 가운데 둔 7일 가로 스트립.
 * - 오늘: 요일 라벨에 green-300 원, 숫자 gray-900
 * - 선택된 날(오늘이 아닌): 숫자 gray-900 로 강조
 * - 그 외: 요일/숫자 gray-400
 */
export default function WeekStrip({
  selectedDate,
  onSelectDate,
}: WeekStripProps) {
  const today = todayKey();
  const days = useMemo(() => weekStripKeys(today), [today]);

  return (
    <View
      className='w-full flex-row items-center border-t border-b border-gray-50'
      style={{ height: 55, marginVertical: 20 }}
    >
      {days.map((key) => {
        const isToday = key === today;
        const isSelected = key === selectedDate;
        const numberColor =
          isToday || isSelected ? 'text-gray-900' : 'text-gray-400';

        return (
          <TouchableOpacity
            key={key}
            activeOpacity={0.7}
            onPress={() => onSelectDate(key)}
            className='flex-1 items-center justify-center'
          >
            <View
              className={`items-center justify-center ${
                isToday ? 'bg-green-300' : ''
              }`}
              style={{ width: 22, height: 22, borderRadius: 11 }}
            >
              <Text
                className={`text-c3 font-n-bd ${
                  isToday ? 'text-white' : 'text-gray-400'
                }`}
              >
                {weekdayLabel(key)}
              </Text>
            </View>
            <Text
              className={`text-c2 font-n-bd ${numberColor}`}
              style={{ marginTop: 5 }}
            >
              {dayNumber(key)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
