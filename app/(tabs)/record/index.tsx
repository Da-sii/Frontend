import RecordCard from '@/components/page/record/RecordCard';
import WeekStrip from '@/components/page/record/WeekStrip';
import WeightGraphCard from '@/components/page/record/WeightGraphCard';
import { useRecordsRangeQuery } from '@/hooks/useRecordQueries';
import { todayKey } from '@/utils/recordDate';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecordScreen() {
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const { data: records = [] } = useRecordsRangeQuery();

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
      <View className='px-5 py-3'>
        <Text className='text-h-md font-n-eb text-gray-900'>나의 기록</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <WeightGraphCard records={records} />
        <WeekStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <RecordCard date={selectedDate} />
      </ScrollView>
    </SafeAreaView>
  );
}
