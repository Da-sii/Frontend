import DottedLine from '@/assets/icons/ic_dotted_line.svg';
import EffectIfon from '@/assets/icons/ic_effect.svg';
import DownArrowIcon from '@/assets/icons/product/productDetail/ic_arrow_down.svg';
import UpArrowIcon from '@/assets/icons/product/productDetail/ic_arrow_up.svg';
import IngredienStatusIcon from '@/assets/icons/ic_ingredien_status.svg';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ProgressBar from './progressBar';
import { ProductIngredient } from '@/services/product/getProductDetail';

export default function MaterialInfo({
  materialInfo,
}: {
  materialInfo: ProductIngredient;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View className='flex-row border-b border-gray-100 w-full   '>
      <View className='w-full my-5'>
        <View className='flex-row'>
          <Text className='text-b-sm font-extrabold'>
            {materialInfo.ingredientName}
          </Text>
          <View
            className={`px-[11px] py-[2px] rounded-full border-none ml-[8px] ${materialInfo.status === '초과' ? 'bg-[#FF3A4A]' : materialInfo.status === '미만' ? 'bg-[#FFA600]' : 'bg-green-600'}`}
          >
            <Text className='text-white font-bold text-c3'>
              {materialInfo.status}
            </Text>
          </View>
        </View>
        <Text className='text-c3 text-gray-400 font-bold mb-[10px]'>
          {materialInfo.englishIngredient}
        </Text>

        <Text className='text-b-sm font-extrabold'>
          포함량 {materialInfo.amount}
        </Text>
        <Text className='text-c3 text-gray-400 font-bold mb-[10px]'>
          1일 권장량 {materialInfo.minRecommended}~{materialInfo.maxRecommended}
        </Text>
        <ProgressBar
          current={parseFloat(materialInfo.amount) || 0}
          recommended={parseFloat(materialInfo.maxRecommended) || 0}
        />

        {isOpen ? (
          <View className='bg-[#F6F5FA] rounded-[12px] flex-col px-3'>
            <View className='flex-row justify-between items-center h-[40px] '>
              <Text className='text-c1 font-bold'>효과 및 부작용 알아보기</Text>
              <Pressable onPress={() => setIsOpen(false)} className='p-1'>
                <UpArrowIcon className='w-[12px] h-[12px]' />
              </Pressable>
            </View>
            <View className=''>
              <View className='flex-row justify-between mb-5 px-[7px]'>
                <EffectIfon className='mr-[14px]' />
                <Text className='flex-1 text-c1 font-nomal'>
                  {materialInfo.effect}
                </Text>
              </View>
              <DottedLine className='w-full' />

              <View className='flex-row justify-between mb-5 mt-5 px-[7px]'>
                <IngredienStatusIcon className='mr-[14px]' />
                <Text className='flex-1 text-c1 font-nomal'>
                  {materialInfo.sideEffect}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View className='bg-[#F6F5FA] rounded-[12px] flex-row justify-between items-center px-3 h-[40px] '>
            <Text className='text-c1 font-bold'>효과 및 부작용 알아보기</Text>
            <Pressable onPress={() => setIsOpen(true)} className='p-1'>
              <DownArrowIcon className='w-[12px] h-[12px]' />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
