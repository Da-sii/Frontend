import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import { SettingItem } from '@/components/page/my/SettingItem';
import { SettingSection } from '@/components/page/my/SettingSection';
import { useUser } from '@/hooks/useUser';
import { getAccessToken } from '@/lib/authToken';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogout } from '../../hooks/useLogout';

export default function Mypage() {
  const router = useRouter();
  const logout = useLogout();
  const { deleteUser } = useUser();
  const { mypageInfo, fetchMypage } = useUser();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [isLogin, setIsLogin] = useState(true);

  const handleOAuthPasswordPress = () => {
    router.push('/mypage/password');
  };

  const handleOAuthModalConfirm = () => {
    setShowPasswordModal(false);
  };

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleWithdrawPress = () => {
    setShowWithdrawModal(true);
  };

  const handleNicknamePress = () => {
    router.push('/mypage/nickname');
  };

  const handleReviewsPress = () => {
    router.push('/mypage/reviews');
  };

  useFocusEffect(
    useCallback(() => {
      const checkLoginAndFetchData = async () => {
        const token = await getAccessToken();
        const isLoggedIn = !!token;
        setIsLogin(isLoggedIn);
        if (isLoggedIn) {
          await fetchMypage();
        }
      };
      checkLoginAndFetchData();
    }, [fetchMypage]),
  );

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Navigation title='마이페이지' />

      <ScrollView className='flex-1 bg-white px-2 py-2'>
        {isLogin ? (
          <>
            <SettingSection>
              <SettingItem
                label={`${mypageInfo?.nickname} 님`}
                onPress={handleNicknamePress}
              />
            </SettingSection>

            <SettingSection title='내 계정' topBorder>
              <SettingItem
                label='아이디'
                value={`${mypageInfo?.email} (${mypageInfo?.login_type} 로그인)`}
              />
              <SettingItem
                label='비밀번호 변경'
                onPress={handleOAuthPasswordPress}
              />
            </SettingSection>

            <SettingSection title='리뷰' topBorder>
              <SettingItem
                label='내가 쓴 리뷰'
                subLabel={`${mypageInfo?.review_count}개`}
                onPress={handleReviewsPress}
              />
            </SettingSection>

            <SettingSection title='도움말' topBorder>
              <SettingItem label='버전 정보' value='V 1.0.1' />
              <SettingItem label='문의 메일' value='podostore1111@gmail.com' />
            </SettingSection>

            <SettingSection title='기타' topBorder>
              <SettingItem label='로그아웃' onPress={handleLogoutPress} />
              <SettingItem label='회원 탈퇴' onPress={handleWithdrawPress} />
            </SettingSection>
          </>
        ) : (
          <>
            <SettingSection title='내 계정'>
              <SettingItem
                label='로그인'
                onPress={() => router.push('/auth/login')}
              />
            </SettingSection>

            <SettingSection title='도움말' topBorder>
              <SettingItem label='버전 정보' value='V 1.0.1' />
              <SettingItem label='문의 메일' value='podostore1111@gmail.com' />
            </SettingSection>
          </>
        )}
      </ScrollView>

      <DefaultModal
        visible={showPasswordModal}
        message='소셜 로그인 계정은&#10;비밀번호를 변경할 수 없습니다.'
        onConfirm={handleOAuthModalConfirm}
        confirmText='확인'
        singleButton
      />

      <DefaultModal
        visible={showLogoutModal}
        title={'로그아웃 하시겠습니까?'}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout.mutate();
        }}
        onCancel={() => setShowLogoutModal(false)}
        confirmText='확인'
        cancelText='취소'
      />

      <DefaultModal
        visible={showWithdrawModal}
        title='탈퇴 하시겠습니까?'
        message={
          '회원 탈퇴 시 계정 및 개인정보는 복구 불가능하며, \n모든 서비스 이용 내역이 삭제됩니다. \n탈퇴를 진행하시겠습니까?'
        }
        onConfirm={() => {
          setShowWithdrawModal(false);
          deleteUser();
          router.replace('/mypage/completion?action=withdraw');
        }}
        onCancel={() => setShowWithdrawModal(false)}
        confirmText='확인'
        cancelText='취소'
      />
    </SafeAreaView>
  );
}
