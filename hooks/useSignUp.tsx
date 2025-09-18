import { useMutation } from '@tanstack/react-query';
import { signUp, SignUpRequest, SignUpResponse } from '../services/auth/signUp';

export const useSignup = (opts?: {
  onSuccess?: (data: SignUpResponse) => void;
  onError?: (err: unknown) => void;
}) =>
  useMutation<SignUpResponse, unknown, SignUpRequest>({
    mutationFn: signUp,
    onSuccess: (data) => {
      console.log('회원가입 성공:', data);
      opts?.onSuccess?.(data);
    },
    onError: (err: any) => {
      console.log('회원가입 실패:', err.response?.status, err.response?.data);
      let msg = '회원가입 중 오류가 발생했어요.';

      // 서버 응답이 { email: ["..."], password: ["..."] } 형태
      if (err?.response?.data && typeof err.response.data === 'object') {
        const data = err.response.data;
        msg = Object.entries(data)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return `${field} : ${messages.join('\n')}`;
            }
            return `${field} : ${messages}`;
          })
          .join('\n\n');
      } else if (typeof err?.response?.data === 'string') {
        msg = err.response.data;
      }

      opts?.onError?.(err);
    },
  });
