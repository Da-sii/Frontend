import { useMutation } from '@tanstack/react-query';
import { signUp } from '../services/auth/signUp';

export const useSignup = () =>
  useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      console.log('회원가입 성공:', data);
      // TODO: 자동 로그인 or 로그인 페이지 이동
    },
    onError: (err) => {
      console.error('회원가입 실패:', err);
    },
  });
