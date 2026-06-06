import DefaultModal from '@/components/common/modals/DefaultModal';
import colors from '@/constants/color';
import { IDailyRecord } from '@/types/models/record';
import { recordColor } from '@/utils/recordColor';
import { parseDateKey, todayKey } from '@/utils/recordDate';
import { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface RecordCalendarProps {
  records: IDailyRecord[];
  selectedDate: string | null;
  onSelectDay: (key: string) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const pad = (n: number) => String(n).padStart(2, '0');

export default function RecordCalendar({
  records,
  selectedDate,
  onSelectDay,
}: RecordCalendarProps) {
  const today = todayKey();
  const byDate = useMemo(() => {
    const map: Record<string, IDailyRecord> = {};
    records.forEach((r) => (map[r.date] = r));
    return map;
  }, [records]);

  const [visibleMonth, setVisibleMonth] = useState(today.slice(0, 7) + '-01');
  const [pickerOpen, setPickerOpen] = useState(false);
  const visibleYear = Number(visibleMonth.slice(0, 4));
  const visibleMon = Number(visibleMonth.slice(5, 7));
  const [pickerYear, setPickerYear] = useState(visibleYear);

  const openPicker = () => {
    setPickerYear(visibleYear);
    setPickerOpen(true);
  };

  const pickMonth = (m: number) => {
    setVisibleMonth(`${pickerYear}-${pad(m)}-01`);
    setPickerOpen(false);
  };

  return (
    <View>
      {/* 커스텀 헤더 */}
      <TouchableOpacity
        onPress={openPicker}
        activeOpacity={0.7}
        className='flex-row items-center justify-center'
        style={{ paddingVertical: 12, gap: 4 }}
      >
        <Text className='text-b-md font-n-eb text-gray-900'>
          {visibleYear}.{pad(visibleMon)}
        </Text>
        <Text className='text-c1 text-gray-500'>▼</Text>
      </TouchableOpacity>

      <Calendar
        key={visibleMonth}
        current={visibleMonth}
        hideArrows
        renderHeader={() => null}
        enableSwipeMonths
        onMonthChange={(m: DateData) =>
          setVisibleMonth(`${m.year}-${pad(m.month)}-01`)
        }
        theme={{
          calendarBackground: '#FFFFFF',
          textSectionTitleColor: colors.gray[400],
        }}
        dayComponent={({
          date,
          state,
        }: {
          date?: DateData;
          state?: string;
        }) => {
          if (!date) return null;
          const key = date.dateString;
          const rec = byDate[key];
          const isSelected = key === selectedDate;
          const isToday = key === today;
          const dow = parseDateKey(key).getDay();

          let numColor = colors.gray[900];
          if (state === 'disabled') numColor = colors.gray[300];
          else if (dow === 0) numColor = colors.red[400];
          else if (dow === 6) numColor = colors.blue[400];

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onSelectDay(key)}
              style={{ width: '100%', minHeight: 56 }}
              className='items-center'
            >
              <View
                className={`items-center justify-center ${
                  isSelected ? 'bg-green-300' : isToday ? 'bg-gray-100' : ''
                }`}
                style={{ width: 24, height: 24, borderRadius: 12 }}
              >
                <Text
                  className='text-c2 font-n-bd'
                  style={{ color: isSelected ? '#FFFFFF' : numColor }}
                >
                  {date.day}
                </Text>
              </View>

              <View style={{ width: '100%', marginTop: 2 }}>
                {rec?.medications.slice(0, 3).map((m) => (
                  <View
                    key={m.id}
                    style={{
                      backgroundColor: recordColor(m.productName) + '22',
                      borderRadius: 3,
                      marginTop: 2,
                      paddingHorizontal: 2,
                      paddingVertical: 1,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      className='font-n-bd'
                      style={{
                        fontSize: 7,
                        color: recordColor(m.productName),
                      }}
                    >
                      {m.productName}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* 월 선택 모달 */}
      <DefaultModal
        visible={pickerOpen}
        title='날짜 선택'
        confirmText='닫기'
        singleButton
        onConfirm={() => setPickerOpen(false)}
      >
        <View className='w-full px-5' style={{ marginTop: 12 }}>
          {/* 연도 스텝퍼 */}
          <View
            className='flex-row items-center justify-center'
            style={{ gap: 24, marginBottom: 16 }}
          >
            <TouchableOpacity onPress={() => setPickerYear((y) => y - 1)}>
              <Text className='text-h-md text-gray-500'>‹</Text>
            </TouchableOpacity>
            <Text className='text-b-md font-n-eb text-gray-900'>
              {pickerYear}년
            </Text>
            <TouchableOpacity onPress={() => setPickerYear((y) => y + 1)}>
              <Text className='text-h-md text-gray-500'>›</Text>
            </TouchableOpacity>
          </View>

          {/* 월 그리드 */}
          <View className='flex-row flex-wrap' style={{ gap: 8 }}>
            {MONTHS.map((m) => {
              const active = pickerYear === visibleYear && m === visibleMon;
              return (
                <TouchableOpacity
                  key={m}
                  onPress={() => pickMonth(m)}
                  className={`items-center justify-center rounded-[8px] ${
                    active ? 'bg-green-500' : 'bg-gray-50'
                  }`}
                  style={{ width: '22%', paddingVertical: 10 }}
                >
                  <Text
                    className={`text-b-sm font-n-bd ${
                      active ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {m}월
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </DefaultModal>
    </View>
  );
}
