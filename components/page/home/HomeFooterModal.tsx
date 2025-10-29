import Navigation from '@/components/layout/Navigation';
import { TERMS } from '@/constants/terms';
import { Ionicons } from '@expo/vector-icons';
import { Modal, ScrollView, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
interface ModalProps {
  type:
    | 'terms'
    | 'service'
    | 'privacy'
    | 'reviewPolicy'
    | 'adInquiry'
    | 'age'
    | 'appUsage'
    | 'notification'
    | 'footerService'
    | 'footerPrivacyUsage'
    | 'footerReviewPolicy';

  visible: boolean;
  onClose: () => void;
}

export const HomeFooterModal = ({ type, visible, onClose }: ModalProps) => {
  const term = TERMS.find((t) => t.id === type);
  const insets = useSafeAreaInsets();
  // 1) \n(문자) -> 실제 개행 치환
  // 2) 모든 개행을 "마크다운 줄바꿈(공백2 + \n)"으로 변환
  const mdContent = (term?.content ?? '')
    .replace(/\\n/g, '\n') // literal "\n" -> newline
    .replace(/\r\n/g, '\n') // 통일
    .replace(/^[ \t]+/gm, '') // 들여쓰기 제거(리스트가 코드블록 되는 것 방지)
    .replace(/\n/g, '  \n'); // 강제 줄바꿈

  return (
    <Modal
      animationType='slide'
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <Navigation
          right={<Ionicons name='close' size={25} color='black' />}
          onRightPress={onClose}
          title={TERMS.find((term) => term.id === type)?.title}
        />

        <ScrollView className='p-4'>
          <Text className='font-bold'>
            {TERMS.find((term) => term.id === type)?.subTitle} {'\n'}
          </Text>
          <Markdown
            style={{
              body: { fontSize: 14, color: '#333', lineHeight: 22 },
              heading1: {
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 12,
                marginBottom: 6,
              },
              heading2: {
                fontSize: 18,
                fontWeight: 'bold',
                marginTop: 10,
                marginBottom: 4,
              },
              bullet_list: { marginLeft: 10 },
              ordered_list: { marginLeft: 10 },
            }}
          >
            {mdContent}
          </Markdown>
        </ScrollView>
      </View>
    </Modal>
  );
};
