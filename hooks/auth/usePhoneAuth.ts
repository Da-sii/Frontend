// hooks/usePhoneAuth.ts
import { useMutation } from '@tanstack/react-query';
import {
  sendPhoneAuth,
  verifyAuthCode,
  verifyAuthToken,
  sendPhoneAuthResponse,
  verifyAuthCodeResponse,
  verifyAuthTokenResponse,
} from '@/services/auth/phone/phoneAuth';

// 전화번호 인증 발송 훅
export const useSendPhoneAuth = (opts?: {
  onSuccess?: (data: sendPhoneAuthResponse) => void;
  onError?: (err: unknown) => void;
}) =>
  useMutation<sendPhoneAuthResponse, unknown, string>({
    mutationFn: (phoneNumber: string) => sendPhoneAuth(phoneNumber),
    onSuccess: (data) => {
      opts?.onSuccess?.(data);
    },
    onError: (err: any) => {
      console.log('인증번호 발송 실패:', err.response?.data);
      opts?.onError?.(err);
    },
  });

// 인증번호 검증 훅
export const useVerifyAuthCode = (opts?: {
  onSuccess?: (data: verifyAuthCodeResponse) => void;
  onError?: (err: unknown) => void;
}) =>
  useMutation<
    verifyAuthCodeResponse,
    unknown,
    { phoneNumber: string; verificationCode: string }
  >({
    mutationFn: ({ phoneNumber, verificationCode }) =>
      verifyAuthCode(phoneNumber, verificationCode),
    onSuccess: (data) => {
      opts?.onSuccess?.(data);
    },
    onError: (err: any) => {
      console.log('인증 실패:', err.response?.data);

      opts?.onError?.(err);
    },
  });

// 인증 토큰 검증 훅
export const useVerifyAuthToken = (opts?: {
  onSuccess?: (data: verifyAuthTokenResponse) => void;
  onError?: (err: unknown) => void;
}) =>
  useMutation<verifyAuthTokenResponse, unknown, string>({
    mutationFn: (verificationToken: string) =>
      verifyAuthToken(verificationToken),
    onSuccess: (data) => {
      opts?.onSuccess?.(data);
    },
    onError: (err: any) => {
      console.log('토큰 검증 실패:', err.response?.data);
      opts?.onError?.(err);
    },
  });
