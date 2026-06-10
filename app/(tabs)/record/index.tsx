import RecordCard from '@/components/page/record/RecordCard';
import WeekStrip from '@/components/page/record/WeekStrip';
import WeightGraphCard from '@/components/page/record/WeightGraphCard';
import { useRecordsRangeQuery } from '@/hooks/useRecordQueries';
import { todayKey } from '@/utils/recordDate';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RecordTab = 'weight' | 'history';

const TABS: { key: RecordTab; label: string }[] = [
  { key: 'weight', label: '체중' },
  { key: 'history', label: '제품 히스토리' },
];

export default function RecordScreen() {
  const [tab, setTab] = useState<RecordTab>('weight');
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const { data: records = [] } = useRecordsRangeQuery();

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
      {/* 타이틀 */}
      <Text
        className='text-b-lg font-n-eb text-gray-900 text-center'
        style={{ marginTop: 20, marginBottom: 32 }}
      >
        나의 기록
      </Text>

      {/* 탭바 */}
      <View
        className='flex-row'
        style={{ paddingHorizontal: 20, marginBottom: 20, gap: 20 }}
      >
        {TABS.map(({ key, label }) => {
          const active = tab === key;
          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.7}
              onPress={() => setTab(key)}
            >
              <Text
                className={`text-c2 font-n-bd ${
                  active ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {tab === 'weight' && (
          <>
            <WeightGraphCard records={records} />
            <WeekStrip
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <RecordCard date={selectedDate} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
