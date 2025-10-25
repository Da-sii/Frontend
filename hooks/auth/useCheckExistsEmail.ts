// hooks/auth/useCheckEmail.ts
import {
  checkEmailExists,
  CheckEmailRequest,
  CheckEmailResponse,
} from '@/services/auth/checkEmailExists';
import { useMutation } from '@tanstack/react-query';

/**
 * 이메일 중복/존재 여부 확인 훅
 * - mutate({ email }) 로 호출
 * - onSuccess, onError 옵션으로 후처리 주입 가능
 */
export const useCheckEmailExists = (opts?: {
  onSuccess?: (data: CheckEmailResponse) => void;
  onError?: (err: unknown) => void;
}) =>
  useMutation<CheckEmailResponse, unknown, CheckEmailRequest>({
    mutationFn: checkEmailExists,
    onSuccess: (data) => {
      opts?.onSuccess?.(data);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        '이메일 확인 중 오류가 발생했어요.';
      opts?.onError?.(err);
    },
  });
