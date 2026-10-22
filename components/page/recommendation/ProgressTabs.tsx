import { Fragment } from 'react';
import { Text, View } from 'react-native';

type ProgressTabsProps = {
  activeStep: 1 | 2 | 3;
};

const steps = ['기본 정보', '생활 습관', '결과'];

export default function ProgressTabs({ activeStep }: ProgressTabsProps) {
  return (
    <View className='border  border-b border-gray-100 bg-white px-[20px] py-[5px]'>
      <View className='flex-row justify-between'>
        {steps.map((label, index) => {
          const step = (index + 1) as 1 | 2 | 3;
          const isActive = activeStep === step;

          return (
            <Fragment key={label}>
              <View key={label} className='items-center'>
                <View
                  className={`h-[24px] w-[24px] items-center justify-center rounded-[8px] ${
                    isActive ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <Text
                    className={`font-n-eb text-c3 ${
                      isActive ? 'text-green-500' : 'text-gray-400'
                    }`}
                  >
                    {step}
                  </Text>
                </View>
                <Text
                  className={`mt-[3px] font-n-bd text-c3 ${
                    isActive ? 'text-green-500' : 'text-gray-400'
                  }`}
                >
                  {label}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View className='mx-3 mt-[12px] h-px flex-1 bg-gray-200' />
              )}
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}
