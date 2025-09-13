import { clearTokens } from '../lib/authToken';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

async function clientLogout() {
  // 서버 signout API 없으니 클라만 처리
  await clearTokens();
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clientLogout,
    onSuccess: async () => {
      // 진행 중 쿼리 취소 + 캐시 비우기
      qc.cancelQueries();
      await qc.clear();

      // 필요 시 axios 기본 헤더도 초기화
      // axiosInstance.defaults.headers.Authorization = undefined;

      // 로그인 페이지로
      router.replace('/auth/login');
    },
  });
}
