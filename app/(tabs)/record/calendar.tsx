import BackIcon from '@/assets/icons/ic_arrow_left.svg';
import DayDetailSheet from '@/components/page/record/calendar/DayDetailSheet';
import EditRecordModal from '@/components/page/record/calendar/EditRecordModal';
import RecordCalendar from '@/components/page/record/calendar/RecordCalendar';
import colors from '@/constants/color';
import { useRecordsRangeQuery } from '@/hooks/useRecordQueries';
import BottomSheet from '@gorhom/bottom-sheet';
import { PortalHost } from '@gorhom/portal';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecordCalendarScreen() {
  const { data: records = [] } = useRecordsRangeQuery();
  const sheetRef = useRef<BottomSheet>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const selectedRecord = useMemo(
    () => records.find((r) => r.date === selectedDay) ?? null,
    [records, selectedDay],
  );

  const handleSelectDay = (key: string) => {
    setSelectedDay(key);
    sheetRef.current?.snapToIndex(0);
  };

  const handleEdit = () => {
    sheetRef.current?.close();
    setEditOpen(true);
  };

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
      <View className='flex-row items-center px-4 py-2'>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <BackIcon width={24} height={24} color={colors.gray[900]} />
        </TouchableOpacity>
      </View>

      <RecordCalendar
        records={records}
        selectedDate={selectedDay}
        onSelectDay={handleSelectDay}
      />

      <DayDetailSheet
        sheetRef={sheetRef}
        date={selectedDay}
        record={selectedRecord}
        allRecords={records}
        onEdit={handleEdit}
      />

      <EditRecordModal
        visible={editOpen}
        date={selectedDay}
        onClose={() => setEditOpen(false)}
      />

      <PortalHost name='overlay-top' />
    </SafeAreaView>
  );
}
