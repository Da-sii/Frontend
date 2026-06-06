import { LongButton } from '@/components/common/buttons/LongButton';
import DefaultModal from '@/components/common/modals/DefaultModal';
import {
  useDeleteRecordMutation,
  useRecordQuery,
  useUpsertRecordMutation,
} from '@/hooks/useRecordQueries';
import { IMedicationRecord } from '@/types/models/record';
import { recordColor } from '@/utils/recordColor';
import { formatKoreanDate } from '@/utils/recordDate';
import ArrowRightIcon from '@/assets/icons/ic_arrow_right.svg';
import CloseIcon from '@/assets/icons/ic_x.svg';
import colors from '@/constants/color';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface RecordCardProps {
  date: string;
  /** 헤더의 '캘린더 전체보기' 링크 노출 (메인 화면용) */
  showCalendarLink?: boolean;
  /** 기록이 있어도 편집 모드로 시작 (수정 모달용) */
  startInEdit?: boolean;
  /** 저장/취소 완료 후 콜백 (수정 모달에서 닫기 등) */
  onSaved?: () => void;
}

export default function RecordCard({
  date,
  showCalendarLink = true,
  startInEdit = false,
  onSaved,
}: RecordCardProps) {
  const { data: existing } = useRecordQuery(date);
  const upsert = useUpsertRecordMutation();
  const remove = useDeleteRecordMutation();

  const [mode, setMode] = useState<'view' | 'edit'>('edit');
  const [weight, setWeight] = useState('');
  const [meds, setMeds] = useState<IMedicationRecord[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [draftName, setDraftName] = useState('');

  // 기록 로드 / 날짜 변경 시 폼 동기화
  useEffect(() => {
    if (existing) {
      setWeight(existing.weight != null ? String(existing.weight) : '');
      setMeds(existing.medications);
      setMode(startInEdit ? 'edit' : 'view');
    } else {
      setWeight('');
      setMeds([]);
      setMode('edit');
    }
  }, [existing, date, startInEdit]);

  const weightNum = parseFloat(weight);
  const canSave = weight.trim() !== '' && !Number.isNaN(weightNum);
  const isView = mode === 'view';

  const handleSave = async () => {
    if (!canSave) return;
    await upsert.mutateAsync({ date, weight: weightNum, medications: meds });
    setMode('view');
    onSaved?.();
  };

  const handleCancel = async () => {
    await remove.mutateAsync(date);
    setWeight('');
    setMeds([]);
    setMode('edit');
    onSaved?.();
  };

  const confirmAddProduct = () => {
    const name = draftName.trim();
    if (name) {
      setMeds((prev) => [
        ...prev,
        { id: `${name}-${Date.now()}`, productName: name, startDate: date },
      ]);
    }
    setDraftName('');
    setAddOpen(false);
  };

  const removeMed = (id: string) =>
    setMeds((prev) => prev.filter((m) => m.id !== id));

  return (
    <View
      className='bg-white rounded-[16px] border border-gray-50'
      style={{ marginHorizontal: 20, padding: 20 }}
    >
      {/* 헤더 */}
      <View className='flex-row items-center justify-between'>
        <Text className='text-b-md font-n-eb text-gray-900'>
          {formatKoreanDate(date)}
        </Text>
        {showCalendarLink && (
          <TouchableOpacity
            className='flex-row items-center'
            activeOpacity={0.7}
            onPress={() => router.push('/record/calendar')}
          >
            <Text className='text-c1 font-n-bd text-gray-400'>
              캘린더 전체보기
            </Text>
            <ArrowRightIcon width={14} height={14} color={colors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* 체중 */}
      <View style={{ marginTop: 20 }}>
        <Text className='text-b-sm font-n-bd text-gray-900'>
          체중 <Text className='text-red-500'>*</Text>
        </Text>
        <View className='flex-row items-center' style={{ marginTop: 10 }}>
          {isView ? (
            <Text className='text-b-lg font-n-eb text-gray-900'>
              {weight}kg
            </Text>
          ) : (
            <>
              <TextInput
                value={weight}
                onChangeText={(t) => setWeight(t.replace(/[^0-9.]/g, ''))}
                placeholder='체중 입력'
                placeholderTextColor={colors.gray[400]}
                keyboardType='decimal-pad'
                className='border border-gray-100 rounded-[8px] px-3 py-3 text-b-sm font-n-rg text-gray-900'
                style={{ width: 120 }}
              />
              <Text className='text-b-sm font-n-bd text-gray-900' style={{ marginLeft: 8 }}>
                kg
              </Text>
            </>
          )}
        </View>
      </View>

      {/* 복용 중인 제품 */}
      <View style={{ marginTop: 24 }}>
        <Text className='text-b-sm font-n-bd text-gray-900'>복용 중인 제품</Text>
        <View
          className='flex-row flex-wrap items-center'
          style={{ marginTop: 12, gap: 8 }}
        >
          {meds.map((m) => (
            <View
              key={m.id}
              className='flex-row items-center rounded-full border border-gray-100 bg-gray-0'
              style={{ paddingVertical: 6, paddingHorizontal: 10, gap: 6 }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: recordColor(m.productName),
                }}
              />
              <Text className='text-c1 font-n-bd text-gray-700'>
                {m.productName}
              </Text>
              {!isView && (
                <TouchableOpacity onPress={() => removeMed(m.id)} hitSlop={6}>
                  <CloseIcon width={12} height={12} color={colors.gray[400]} />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {!isView && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setAddOpen(true)}
              className='items-center justify-center rounded-full border border-dashed border-gray-300'
              style={{ width: 56, height: 56 }}
            >
              <Text className='text-h-md font-n-rg text-gray-400'>+</Text>
            </TouchableOpacity>
          )}

          {isView && meds.length === 0 && (
            <Text className='text-c1 font-n-rg text-gray-400'>
              복용 중인 제품이 없어요.
            </Text>
          )}
        </View>
      </View>

      {/* 액션 버튼 */}
      <View style={{ marginTop: 28 }}>
        {isView ? (
          <View className='flex-row' style={{ gap: 8 }}>
            <TouchableOpacity
              onPress={handleCancel}
              activeOpacity={0.8}
              className='flex-1 h-[52px] rounded-xl items-center justify-center bg-gray-100'
            >
              <Text className='text-b-lg font-n-eb text-gray-500'>취소하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('edit')}
              activeOpacity={0.8}
              className='flex-1 h-[52px] rounded-xl items-center justify-center bg-green-500 active:bg-green-600'
            >
              <Text className='text-b-lg font-n-eb text-white'>수정하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <LongButton
            label='기록하기'
            onPress={handleSave}
            disabled={!canSave}
            height='h-[52px]'
          />
        )}
      </View>

      {/* 제품 추가 모달 */}
      <DefaultModal
        visible={addOpen}
        title='해당 제품을 추가하시겠습니까?'
        confirmText='추가'
        confirmDisabled={draftName.trim() === ''}
        onConfirm={confirmAddProduct}
        onCancel={() => {
          setDraftName('');
          setAddOpen(false);
        }}
      >
        <View className='w-full px-5' style={{ marginTop: 16 }}>
          <TextInput
            value={draftName}
            onChangeText={setDraftName}
            placeholder='제품명을 입력하세요'
            placeholderTextColor={colors.gray[400]}
            className='border border-gray-100 rounded-[8px] px-3 py-3 text-b-sm font-n-rg text-gray-900'
            autoFocus
          />
        </View>
      </DefaultModal>
    </View>
  );
}
