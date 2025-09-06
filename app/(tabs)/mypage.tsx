import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Mypage() {
  const router = useRouter();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [isLogin, setIsLogin] = useState(false);

  const handleOAuthPasswordPress = () => {
    // setShowPasswordModal(true);
    router.replace('/mypage/password');
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

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Navigation title='마이페이지' />

      <ScrollView className='flex-1 bg-white px-4'>
        {isLogin ? (
          <>
            <TouchableOpacity
              className='px-4 py-4 flex-row items-center justify-between'
              onPress={handleNicknamePress}
            >
              <Text className='text-lg font-medium'>치킨데이콘나누 님</Text>
              <Ionicons name='chevron-forward' size={20} color='#666' />
            </TouchableOpacity>

            <View className='h-px bg-gray-100 px-4' />

            <View className='px-4 py-3'>
              <Text className='text-sm text-gray-500 mb-3'>내 계정</Text>

              <View className='flex-row mb-4'>
                <Text className='text-base text-gray-700 flex-1'>아이디</Text>
                <Text className='text-xs text-gray-500'>
                  dki688@naver.com (카카오 로그인)
                </Text>
              </View>

              <TouchableOpacity
                className='flex-row items-center justify-between py-2'
                onPress={handleOAuthPasswordPress}
              >
                <Text className='text-base'>비밀번호 변경</Text>
                <Ionicons name='chevron-forward' size={20} color='#666' />
              </TouchableOpacity>
            </View>

            <View className='h-px bg-gray-100 px-4' />

            <View className='px-4 py-3'>
              <Text className='text-sm text-gray-500 mb-3'>리뷰</Text>

              <TouchableOpacity
                className='flex-row items-center justify-between py-2'
                onPress={handleReviewsPress}
              >
                <View className='flex-row items-center'>
                  <Text className='text-base'>내가 쓴 리뷰 </Text>
                  <Text className='text-base text-green-600 font-medium'>
                    32개
                  </Text>
                </View>
                <Ionicons name='chevron-forward' size={20} color='#666' />
              </TouchableOpacity>
            </View>

            <View className='h-px bg-gray-100 px-4' />

            <View className='px-4 py-3'>
              <Text className='text-base py-2'>도움말</Text>
            </View>

            <View className='px-4 py-3'>
              <View className='flex-row mb-4'>
                <Text className='text-sm text-gray-700 flex-1'>버전 정보</Text>
                <Text className='text-xs text-gray-500'>V 1.0</Text>
              </View>

              <View className='flex-row mb-4'>
                <Text className='text-sm text-gray-700 flex-1'>문의 메일</Text>
                <Text className='text-xs text-gray-500'>
                  podostore1111@gmail.com
                </Text>
              </View>
            </View>

            <View className='h-px bg-gray-100 px-4' />

            <View className='px-4 py-3'>
              <Text className='text-base py-2'>기타</Text>
            </View>

            <View className='px-4 py-3'>
              <TouchableOpacity
                className='flex-row items-center justify-between py-3'
                onPress={handleLogoutPress}
              >
                <Text className='text-base'>로그아웃</Text>
                <Ionicons name='chevron-forward' size={20} color='#666' />
              </TouchableOpacity>

              <TouchableOpacity
                className='flex-row items-center justify-between py-3'
                onPress={handleWithdrawPress}
              >
                <Text className='text-base'>회원 탈퇴</Text>
                <Ionicons name='chevron-forward' size={20} color='#666' />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View className='px-4 py-3'>
              <Text className='text-sm text-gray-500 mb-3'>내 계정</Text>

              <View className='flex-row mb-4'>
                <Text className='text-base text-gray-700 flex-1'>로그인</Text>
                <Ionicons name='chevron-forward' size={20} color='#666' />
              </View>
            </View>

            <View className='h-px bg-gray-100 px-4' />

            <View className='px-4 py-3'>
              <Text className='text-base py-2'>도움말</Text>
            </View>

            <View className='px-4 py-3'>
              <View className='flex-row mb-4'>
                <Text className='text-sm text-gray-700 flex-1'>버전 정보</Text>
                <Text className='text-xs text-gray-500'>V 1.0</Text>
              </View>

              <View className='flex-row mb-4'>
                <Text className='text-sm text-gray-700 flex-1'>문의 메일</Text>
                <Text className='text-xs text-gray-500'>
                  podostore1111@gmail.com
                </Text>
              </View>
            </View>
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
        message={'로그아웃 하시겠습니까?'}
        onConfirm={() => {
          setShowLogoutModal(false);
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
          router.replace('/mypage/completion?action=withdraw');
        }}
        onCancel={() => setShowWithdrawModal(false)}
        confirmText='확인'
        cancelText='취소'
      />
    </SafeAreaView>
  );
}
