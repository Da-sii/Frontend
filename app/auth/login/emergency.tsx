import DefaultModal from '@/components/common/modals/DefaultModal';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import Index from '.';

export default function EmergencyLogin() {
  const [login, setLogin] = useState(false);
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {login ? (
        <Index emergency='true' />
      ) : (
        <DefaultModal
          visible={true}
          onConfirm={() => {
            setLogin(true);
          }}
          onCancel={() => {
            router.back();
          }}
          title='로그인'
          message='로그인이 필요합니다.'
          confirmText='확인'
        />
      )}
    </>
  );
}
