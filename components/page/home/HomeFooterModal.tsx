import Navigation from '@/components/layout/Navigation';
import { TERMS } from '@/constants/terms';
import { Ionicons } from '@expo/vector-icons';
import { Modal, SafeAreaView, ScrollView, Text } from 'react-native';

interface ModalProps {
  type:
    | 'terms'
    | 'privacy'
    | 'adInquiry'
    | 'inquiryAppUsage'
    | 'footerReviewPolicy'
    | 'footerService'
    | 'footerPrivacy';
  visible: boolean;
  onClose: () => void;
}

export const HomeFooterModal = ({ type, visible, onClose }: ModalProps) => {
  return (
    <Modal
      animationType='slide'
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className='flex-1'>
        <Navigation
          right={<Ionicons name='close' size={25} color='black' />}
          onRightPress={onClose}
          title={TERMS.find((term) => term.id === type)?.title}
        />

        <ScrollView className='p-4 pt-0'>
          <Text className='text-base text-gray-800 leading-6'>
            <Text className='font-bold'>
              {TERMS.find((term) => term.id === type)?.subtitle ||
                TERMS.find((term) => term.id === type)?.title}{' '}
              {'\n'}
            </Text>
            {TERMS.find((term) => term.id === type)?.content}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
