import RecordCard from '@/components/page/record/RecordCard';
import WeekStrip from '@/components/page/record/WeekStrip';
import WeightGraphCard from '@/components/page/record/WeightGraphCard';
import { useRecordsRangeQuery } from '@/hooks/useRecordQueries';
import { todayKey } from '@/utils/recordDate';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

<<<<<<< Updated upstream
type RecordTab = 'weight' | 'history';

const TABS: { key: RecordTab; label: string }[] = [
  { key: 'weight', label: '체중' },
  { key: 'history', label: '제품 히스토리' },
];
=======
type Tab = '체중' | '제품 히스토리';
const TABS: Tab[] = ['체중', '제품 히스토리'];
>>>>>>> Stashed changes

export default function RecordScreen() {
  const [tab, setTab] = useState<RecordTab>('weight');
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [activeTab, setActiveTab] = useState<Tab>('체중');
  const { data: records = [] } = useRecordsRangeQuery();

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
<<<<<<< Updated upstream
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
=======
      <View className='pt-5 pb-4 w-full flex items-center justify-center'>
        <Text className='text-b-lg font-n-eb text-gray-900'>나의 기록</Text>
      </View>

      {/* 탭 메뉴 */}
      <View className='flex-row px-5 gap-5 pb-5'>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              className={`text-c2 pb-1 ${
                activeTab === tab
                  ? 'text-gray-900 font-n-eb'
                  : 'text-gray-400 font-n-db'
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
>>>>>>> Stashed changes
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
<<<<<<< Updated upstream
        {tab === 'weight' && (
=======
        {activeTab === '체중' && (
>>>>>>> Stashed changes
          <>
            <WeightGraphCard records={records} />
            <WeekStrip
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <RecordCard date={selectedDate} />
          </>
        )}
<<<<<<< Updated upstream
=======

        {activeTab === '제품 히스토리' &&
          // TODO: 제품 히스토리 컴포넌트
          null}
>>>>>>> Stashed changes
      </ScrollView>
    </SafeAreaView>
  );
}
