// ProductRequestModal.tsx
import { TextInput, View } from 'react-native';
import DefaultModal from '../../common/modals/DefaultModal';

export default function ProductRequestModal({
  visible,
  value,
  onChange,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  value: string;
  onChange: (text: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const isConfirmDisabled = value.trim().length === 0;

  return (
    <DefaultModal
      visible={visible}
      title='찾으시는 제품이 없으신가요?'
      message={`아직 등록되지 않은 제품이라면 알려주세요.\n검토 후 서비스에 반영할게요!`}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText='전송'
      cancelText='닫기'
      confirmDisabled={isConfirmDisabled}
    >
      <View className='w-full'>
        <TextInput
          multiline
          value={value}
          onChangeText={onChange}
          placeholder='제품에 대한 정보를 남겨주세요.'
          placeholderTextColor='#60676C'
          className='border border-gray-100 rounded-[12px] p-4 h-[100px] w-[270px] mt-6 mb-2 text-b-sm'
          textAlignVertical='top'
        />
      </View>
    </DefaultModal>
  );
}
