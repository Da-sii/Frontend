import { Text, TextInput, View } from 'react-native';

type Props = {
  review: string;
  setReview: (v: string) => void;
  touched: boolean;
  setTouched: (v: boolean) => void;
  showMinError: boolean;
  setShowMinError: (v: boolean) => void;
  isReviewValid: (text: string) => boolean;
};

export default function ReviewTextSection({
  review,
  setReview,
  touched,
  setTouched,
  showMinError,
  setShowMinError,
  isReviewValid,
}: Props) {
  return (
    <View>
      <Text className='text-b-sm font-n-eb mb-[20px]'>
        자세한 제품 리뷰를 남겨주세요
      </Text>

      <View className='border border-gray-100 rounded-[12px] px-[15px] pt-[15px] pb-[40px] h-[150px] relative'>
        <TextInput
          placeholder={`사용하신 제품에 대한 효과나\n양/부작용/섭취 팁 등에 대해 남겨주세요!`}
          value={review}
          onChangeText={(t) => {
            if (t.trim().length <= 1000) {
              setReview(t);
            }
            if (touched) setShowMinError(!isReviewValid(t));
            else if (showMinError) setShowMinError(false);
          }}
          onBlur={() => {
            setTouched(true);
            setShowMinError(!isReviewValid(review));
          }}
          onEndEditing={() => {
            setTouched(true);
            setShowMinError(!isReviewValid(review));
          }}
          multiline
          textAlignVertical='top'
        />

        {touched && showMinError && (
          <Text className='text-c3 font-n-rg text-[#FF3A4A] absolute bottom-[15px] left-[20px]'>
            최소 20자 이상 입력해 주세요.
          </Text>
        )}
      </View>

      <View className='flex-row items-center absolute bottom-[15px] right-5'>
        <Text className='text-c3 font-n-bd text-gray-700'>{review.length}</Text>
        <Text className='text-c3 font-n-rg text-gray-400'>
          {' '}
          / 1,000 (최소 20자)
        </Text>
      </View>
    </View>
  );
}
