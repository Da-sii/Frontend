// hooks/usePhoneAuth.ts
import {
  sendPhoneAuth,
  sendPhoneAuthResponse,
  verifyAuthCode,
  verifyAuthCodeResponse,
  verifyAuthToken,
  verifyAuthTokenResponse,
} from '@/services/auth/phone/phoneAuth';
import { useMutation } from '@tanstack/react-query';

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
      opts?.onError?.(err);
    },
  });
