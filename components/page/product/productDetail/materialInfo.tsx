import EffectIfon from '@/assets/icons/ic_effect.svg';
import IngredienStatusIcon from '@/assets/icons/ic_ingredien_status.svg';
import DownArrowIcon from '@/assets/icons/product/productDetail/ic_arrow_down.svg';
import UpArrowIcon from '@/assets/icons/product/productDetail/ic_arrow_up.svg';
import { ProductIngredient } from '@/services/product/getProductDetail';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ProgressBar from './progressBar';

export default function MaterialInfo({
  materialInfo,
}: {
  materialInfo: ProductIngredient;
}) {
  const [isOpen, setIsOpen] = useState(false);

  console.log('materialInfo', materialInfo);

  const renderBulletList = (items: string[]) => {
    if (!items || items.length === 0) {
      return (
        <Text className='flex-1 text-c1 font-n-rg text-gray-400'>
          정보 없음
        </Text>
      );
    }

    return (
      <View className='flex-1'>
        {items.map((txt, idx) => (
          <View key={`${txt}-${idx}`} className='flex-row mb-1 '>
            <Text className='mr-2 text-c1 font-n-rg'>•</Text>
            <Text className='flex-1 text-c1 font-n-rg'>{txt}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      <View className='flex-row w-full'>
        <View className='w-full my-5'>
          <View className='flex-row'>
            <Text className='text-b-sm font-n-eb '>
              {materialInfo.ingredientName}
            </Text>
            <View
              className={`px-[9px] py-[2px] rounded-full border-none ml-[8px] ${materialInfo.status === '초과' ? 'bg-[#FF3A4A]' : materialInfo.status === '미만' ? 'bg-[#FFA600]' : 'bg-green-600'}`}
            >
              <Text className='text-white font-n-bd text-c3'>
                {materialInfo.status}
              </Text>
            </View>
          </View>
          <Text className='text-c3 text-gray-400 font-n-bd mb-[10px]'>
            ({materialInfo.englishName})
          </Text>

          <Text className='text-b-sm font-n-eb'>
            포함량 {materialInfo.amount}
          </Text>
          <Text className='text-c3 text-gray-400 font-n-bd mb-[10px]'>
            1일 권장량 {materialInfo.minRecommended}~
            {materialInfo.maxRecommended}
          </Text>
          <ProgressBar
            recommended={materialInfo.maxRecommended}
            status={materialInfo.status}
            amount={materialInfo.amount}
          />

          {isOpen ? (
            <View className='bg-[#F6F5FA] rounded-[12px] flex-col px-3'>
              <Pressable
                onPress={() => setIsOpen(false)}
                className='flex-row justify-between items-center h-[40px]'
              >
                <Text className='text-c1 font-n-bd'>
                  효과 및 부작용 알아보기
                </Text>
                <View className='p-1'>
                  <UpArrowIcon className='w-[12px] h-[12px]' />
                </View>
              </Pressable>
              <View className='mt-1 '>
                <View className='flex-row justify-between mb-5 px-[7px]'>
                  <EffectIfon className='mr-[14px]' />
                  {renderBulletList(materialInfo.effect ?? [])}
                </View>
                <View
                  className='w-full h-[1px]'
                  style={{
                    borderBottomWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: '#E4E6E7',
                  }}
                />

                <View className='flex-row justify-between mb-5 mt-5 px-[7px]'>
                  <IngredienStatusIcon className='mr-[14px]' />
                  {renderBulletList(materialInfo.sideEffect ?? [])}
                </View>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => setIsOpen(true)}
              className='bg-[#F6F5FA] rounded-[12px] flex-row justify-between items-center px-3 h-[40px] '
            >
              <Text className='text-c1 font-n-bd'>효과 및 부작용 알아보기</Text>
              <View className='p-1'>
                <DownArrowIcon className='w-[12px] h-[12px]' />
              </View>
            </Pressable>
          )}
        </View>
      </View>
      <View className='w-[200%] h-[1px] left-[-50%] bg-gray-50' />
    </>
  );
}
