// 기타 원료
import InfoIcon from '@/assets/icons/ic_info.svg';
import DefaultModal from '@/components/common/modals/DefaultModal';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  ingredients: string[] | undefined;
  onPressInfo: () => void;
}

export default function OtherIngredientsSection({
  ingredients,
  onPressInfo,
}: Props) {
  const [showNoGuideModal, setShowNoGuideModal] = useState(false);

  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <View className='p-5'>
      <View className='flex-row items-center justify-between mb-[10px]'>
        <View className='flex-row'>
          <Text className='text-b-lg font-n-bd'>기타 원료 </Text>
          <Text className='text-b-lg font-n-eb text-green-500'>
            {ingredients.length}개
          </Text>
        </View>

        <Pressable onPress={onPressInfo}>
          <InfoIcon />
        </Pressable>
      </View>

      <View className='bg-[#F6F5FA] rounded-xl px-4 py-2'>
        {ingredients.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => setShowNoGuideModal(true)}
            className='flex-row items-center justify-between py-[10px]'
          >
            <View className='flex-row items-center gap-x-2'>
              <Text className='text-b-sm font-n-bd'>•</Text>
              <Text className='text-b-sm font-n-bd'>{item}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <DefaultModal
        visible={showNoGuideModal}
        message='성분 가이드가 아직 등록되지 않았습니다.'
        onConfirm={() => setShowNoGuideModal(false)}
        confirmText='확인'
        singleButton
      />
    </View>
  );
}
