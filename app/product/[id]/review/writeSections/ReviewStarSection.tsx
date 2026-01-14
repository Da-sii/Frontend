import ReviewStar from '@/components/page/product/productDetail/ReviewStar';
import { Text, View } from 'react-native';

const startContent = {
  0: '선택해주세요',
  1: '별로예요',
  2: '그저 그래요',
  3: '괜찮아요',
  4: '꽤 만족해요',
  5: '최고예요',
};

type Props = {
  rate: number;
  onChange: (rate: number) => void;
  touched: boolean;
  review: string;
  setTouched: (v: boolean) => void;
  setShowMinError: (v: boolean) => void;
  isReviewValid: (text: string) => boolean;
};

export default function ReviewStarSection({
  rate,
  onChange,
  touched,
  review,
  setTouched,
  setShowMinError,
  isReviewValid,
}: Props) {
  return (
    <View className='border-y border-gray-100 py-5 my-5 flex-col items-center'>
      <View className='flex-row'>
        <Text className='text-b-sm font-n-bd text-[#FF3A4A] mr-1'>*</Text>
        <Text className='text-h-md font-n-eb mb-[15px]'>
          제품은 어떠셨나요?
        </Text>
      </View>

      <ReviewStar
        reviewRank={rate}
        height={24}
        gap={8}
        editable
        onChange={(newRate) => {
          onChange(newRate);
          if (!touched) setTouched(true);
          setShowMinError(!isReviewValid(review));
        }}
      />

      <Text className='mt-[10px] text-c2 font-n-rg'>
        {startContent[rate as keyof typeof startContent]}
      </Text>
    </View>
  );
}
