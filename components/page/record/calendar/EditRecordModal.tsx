import { Modal, Pressable, ScrollView } from 'react-native';
import RecordCard from '../RecordCard';

interface EditRecordModalProps {
  visible: boolean;
  date: string | null;
  onClose: () => void;
}

export default function EditRecordModal({
  visible,
  date,
  onClose,
}: EditRecordModalProps) {
  if (!date) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <Pressable
        className='flex-1 bg-black/60 justify-center'
        onPress={onClose}
      >
        {/* 카드 영역 탭은 닫힘 방지 */}
        <Pressable onPress={() => {}}>
          <ScrollView keyboardShouldPersistTaps='handled'>
            <RecordCard
              date={date}
              startInEdit
              showCalendarLink={false}
              onSaved={onClose}
            />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
