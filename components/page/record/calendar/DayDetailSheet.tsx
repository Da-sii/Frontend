import { IDailyRecord } from '@/types/models/record';
import { recordColor } from '@/utils/recordColor';
import {
  daysTaken,
  medicationPeriodLabel,
  weightLost,
} from '@/utils/recordMetrics';
import { parseDateKey, WEEKDAYS } from '@/utils/recordDate';
import BottomSheet from '@gorhom/bottom-sheet';
import { RefObject } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import BottomSheetLayout from '@/components/page/product/productDetail/BottomSheet/BottomSheetLayout';

interface DayDetailSheetProps {
  sheetRef: RefObject<BottomSheet | null>;
  date: string | null;
  record: IDailyRecord | null;
  allRecords: IDailyRecord[];
  onEdit: () => void;
}

function formatLong(key: string): string {
  const d = parseDateKey(key);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${
    WEEKDAYS[d.getDay()]
  })`;
}

export default function DayDetailSheet({
  sheetRef,
  date,
  record,
  allRecords,
  onEdit,
}: DayDetailSheetProps) {
  return (
    <BottomSheetLayout sheetRef={sheetRef} snapPoints={[420]}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}>
        {/* 헤더 */}
        <View className='flex-row items-center justify-between'>
          <Text className='text-h-sm font-n-eb text-gray-900'>
            {date ? formatLong(date) : ''}
          </Text>
          <TouchableOpacity
            onPress={onEdit}
            activeOpacity={0.7}
            className='flex-row items-center rounded-full border border-gray-100'
            style={{ paddingVertical: 6, paddingHorizontal: 12, gap: 4 }}
          >
            <Text className='text-c1 font-n-bd text-gray-500'>✎ 수정</Text>
          </TouchableOpacity>
        </View>

        {/* 체중 */}
        <View className='flex-row items-end' style={{ marginTop: 16, gap: 6 }}>
          <Text className='text-c1 font-n-bd text-gray-500'>나의 체중</Text>
          <Text className='text-h-md font-n-eb text-gray-900'>
            {record?.weight != null ? `${record.weight}kg` : '-'}
          </Text>
        </View>

        {/* 복용 제품 목록 */}
        <View style={{ marginTop: 20, gap: 16 }}>
          {record && record.medications.length > 0 ? (
            record.medications.map((m) => {
              const lost = weightLost(allRecords, m.startDate, date ?? m.startDate);
              return (
                <View key={m.id} className='flex-row' style={{ gap: 8 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      marginTop: 5,
                      backgroundColor: recordColor(m.productName),
                    }}
                  />
                  <View className='flex-1'>
                    <Text className='text-b-sm font-n-eb text-gray-900'>
                      {m.productName}
                    </Text>
                    <View
                      className='flex-row items-center'
                      style={{ marginTop: 6, gap: 8 }}
                    >
                      <Text className='text-c1 font-n-rg text-gray-500'>
                        복용기간{' '}
                        {date ? medicationPeriodLabel(m.startDate, date) : ''}
                      </Text>
                      <View className='rounded-full bg-gray-50 px-2 py-[2px]'>
                        <Text className='text-c3 font-n-bd text-gray-500'>
                          복용 {date ? daysTaken(m.startDate, date) : 0}일째
                        </Text>
                      </View>
                    </View>
                    <View
                      className='flex-row items-center'
                      style={{ marginTop: 4, gap: 6 }}
                    >
                      <Text className='text-c1 font-n-rg text-gray-500'>
                        감량 체중
                      </Text>
                      <Text className='text-c1 font-n-eb text-green-600'>
                        {lost}kg
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <Text className='text-c1 font-n-rg text-gray-400'>
              복용 중인 제품이 없어요.
            </Text>
          )}
        </View>
      </View>
    </BottomSheetLayout>
  );
}
