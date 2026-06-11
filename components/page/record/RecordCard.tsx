import AddIcon from '@/assets/icons/ic_add.svg';
import ArrowRightIcon from '@/assets/icons/ic_arrow_right.svg';
import RemoveIcon from '@/assets/icons/ic_minus.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import DefaultModal from '@/components/common/modals/DefaultModal';
import colors from '@/constants/color';
import {
  useDeleteRecordMutation,
  useRecordQuery,
  useUpsertRecordMutation,
} from '@/hooks/useRecordQueries';
import { useProductSelectStore } from '@/store/useProductSelectStore';
import { IMedicationRecord } from '@/types/models/record';
import { recordColor } from '@/utils/recordColor';
import { formatKoreanDate } from '@/utils/recordDate';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

  const [mode, setMode] = useState<'create' | 'view' | 'edit'>('create');
  const [weight, setWeight] = useState('');
  const [meds, setMeds] = useState<IMedicationRecord[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [draftName, setDraftName] = useState('');

  const selected = useProductSelectStore((s) => s.selected);
  const setSelected = useProductSelectStore((s) => s.setSelected);

  const [saveSuccess, setSaveSuccess] = useState(false); // 기록 완료 모달 상태
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (selected) {
      setMeds((prev) => [
        ...prev,
        {
          id: `${selected.id}-${Date.now()}`,
          productName: selected.name,
          productImage: selected.image, // 추가
          startDate: date,
        },
      ]);
      setSelected(null);
    }
  }, [selected]);

  // 기록 로드 / 날짜 변경 시 폼 동기화
  useEffect(() => {
    if (existing) {
      setWeight(existing.weight != null ? String(existing.weight) : '');
      setMeds(existing.medications);
      setMode(startInEdit ? 'edit' : 'view');
    } else {
      setWeight('');
      setMeds([]);
      setMode('create');
    }
  }, [date, startInEdit]);

  const weightNum = parseFloat(weight);
  const canSave = weight.trim() !== '' && !Number.isNaN(weightNum);
  const isView = mode === 'view';

  const handleSave = async () => {
    if (!canSave) return;
    await upsert.mutateAsync({ date, weight: weightNum, medications: meds });
    setMode('view');
    setSaveSuccess(true);
    onSaved?.();
  };

  const handleCancelEdit = () => {
    if (existing) {
      setWeight(existing.weight != null ? String(existing.weight) : '');
      setMeds(existing.medications);
    }
    setMode('view');
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

  const removeMed = (id: string) => {
    setDeleteTargetId(id);
  };

  return (
    <View className='bg-white rounded-[12px] border border-gray-200 p-[15px] mx-5'>
      {/* 헤더 */}
      <View className='flex-row items-center justify-between'>
        <Text className='text-c3 font-n-bd text-gray-500'>
          {formatKoreanDate(date)}
        </Text>
        {showCalendarLink && (
          <TouchableOpacity
            className='flex-row items-center gap-[3px]'
            activeOpacity={0.7}
            onPress={() => router.push('/record/calendar')}
          >
            <Text className='text-c3 font-n-bd'>캘린더 전체보기</Text>
            <ArrowRightIcon width={12} height={12} />
          </TouchableOpacity>
        )}
      </View>

      {/* 체중 */}
      <View className='mt-5'>
        <Text className='text-c2 font-n-bd text-gray-900'>
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
                onChangeText={(t) => {
                  const filtered = t.replace(/[^0-9.]/g, '');
                  setWeight(filtered);
                }}
                keyboardType='decimal-pad'
                placeholder='체중 입력'
                placeholderTextColor={colors.gray[400]}
                style={{
                  fontFamily: 'NotoSansKR-Regular',
                  fontSize: 14,
                  fontWeight: '800',
                }}
                className='border border-gray-100 rounded-[8px] px-4 py-[11px] text-b-sm text-gray-900'
              />
              <Text className='text-b-sm font-n-bd text-gray-900 ml-2'>kg</Text>
            </>
          )}
        </View>
      </View>

      {/* 복용 중인 제품 */}
      <View className='mt-[30px]'>
        <Text className='text-c2 font-n-bd text-gray-900'>복용 중인 제품</Text>
        <View
          className='flex-row flex-wrap items-center'
          style={{ marginTop: 12, gap: 8 }}
        >
          {meds.map((m) => (
            <View key={m.id} style={{ position: 'relative' }}>
              <View className='items-center justify-center overflow-hidden border rounded-full w-20 h-20 border-gray-100'>
                {m.productImage ? (
                  <Image
                    source={{ uri: m.productImage }}
                    style={{ width: 80, height: 80 }}
                  />
                ) : (
                  <View
                    className='w-[70px] h-[70px]'
                    style={{
                      backgroundColor: recordColor(m.productName),
                    }}
                  />
                )}
              </View>
              {!isView && (
                <TouchableOpacity
                  onPress={() => removeMed(m.id)}
                  hitSlop={4}
                  className='w-[18px] h-[18px] absolute top-1 right-0 bg-gray-100 rounded-full items-center justify-center'
                >
                  <RemoveIcon width={6} height={10} />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {!isView && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/home/search?mode=add')}
              className='w-20 h-20 items-center justify-center rounded-full border border-gray-100'
            >
              <AddIcon width={9} height={10} />
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
        {mode === 'view' && (
          <TouchableOpacity
            onPress={() => setMode('edit')}
            activeOpacity={0.8}
            className='flex-1 h-[52px] rounded-xl items-center justify-center bg-green-500'
          >
            <Text className='text-b-lg font-n-eb text-white'>수정하기</Text>
          </TouchableOpacity>
        )}

        {mode === 'edit' && (
          <View className='flex-row' style={{ gap: 8 }}>
            <TouchableOpacity
              onPress={handleCancelEdit}
              activeOpacity={0.8}
              className='flex-1 h-[52px] rounded-xl items-center justify-center bg-gray-100'
            >
              <Text className='text-b-lg font-n-eb text-gray-500'>
                취소하기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={!canSave}
              className='flex-1 h-[52px] rounded-xl items-center justify-center bg-green-500'
            >
              <Text className='text-b-lg font-n-eb text-white'>수정하기</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'create' && (
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

      {/* 기록 완료 모달 */}
      <DefaultModal
        visible={saveSuccess}
        title='기록이 완료되었습니다.'
        singleButton
        confirmText='확인'
        onConfirm={() => setSaveSuccess(false)}
      />

      {/* 제품 삭제 확인 모달 */}
      <DefaultModal
        visible={!!deleteTargetId}
        title='해당 제품을 삭제하시겠습니까?'
        confirmText='확인'
        onConfirm={() => {
          setMeds((prev) => prev.filter((m) => m.id !== deleteTargetId));
          setDeleteTargetId(null);
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </View>
  );
}
