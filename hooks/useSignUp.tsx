import { useMutation } from '@tanstack/react-query';
import { signUp, SignUpRequest, SignUpResponse } from '../services/auth/signUp';
import { Alert } from 'react-native';

export const useSignup = (opts?: {
  onSuccess?: (data: SignUpResponse) => void;
  onError?: (err: unknown) => void;
}) =>
  useMutation<SignUpResponse, unknown, SignUpRequest>({
    mutationFn: signUp,
    onSuccess: (data) => {
      opts?.onSuccess?.(data);
    },
    onError: (err: any) => {
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
        Alert.alert(msg);
      } else if (typeof err?.response?.data === 'string') {
        msg = err.response.data;
        Alert.alert(msg);
      }

      opts?.onError?.(err);
    },
  });
