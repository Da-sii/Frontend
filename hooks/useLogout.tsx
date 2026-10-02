import { clearTokens } from '../lib/authToken';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { serverLogout } from '@/services/auth/logout';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    // 1) 서버 로그아웃 시도
    mutationFn: async () => {
      try {
        await serverLogout();
      } catch (e) {
        // 401/400 등 실패해도 "베스트 에포트"로 진행 (토큰 정리/네비게이션)
        // 필요하면 여기서 에러 로깅만
      }
      // 2) 로컬 토큰 정리
      await clearTokens();
    },
    onSuccess: async () => {
      // 3) "다음 로그인만 재인증" 플래그 저장
      await AsyncStorage.setItem('forceReauth', '1');

      // 4) 진행 중 쿼리 취소 + 캐시 비우기
      await qc.cancelQueries();
      await qc.clear();

      // 5) 로그인 페이지로 이동
      router.replace('/auth/login');
    },
  });
}
