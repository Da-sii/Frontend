import { getAccessToken } from '@/lib/authToken';
import { useCallback } from 'react';

export function useIsLoggedIn() {
  /**
   * 현재 디바이스에 액세스 토큰이 저장돼 있는지만 빠르게 확인.
   * (실제 유효성은 서버 호출 시 401 나오면 인터셉터가 처리/로그아웃으로 이어짐)
   */
  const check = useCallback(async () => {
    try {
      const at = await getAccessToken();
      return Boolean(at);
    } catch {
      return false;
    }
  }, []);

  return check; // 사용처에서는 isLoggedIn() 형태로 await 호출
}
