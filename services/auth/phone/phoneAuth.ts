// services/auth/signIn.ts
import { axiosInstance } from '../../index';

export type sendPhoneAuthResponse = {
  success: boolean;
  original_phone: string;
  parsed_phone: string;
  message: string;
  remaining_requests: number;
  sent_at: string;
  verification_code: string;
};

export type verifyAuthTokenResponse = {
  valid: boolean;
  phone_number: string;
  expires_at: string;
};

export type verifyAuthCodeResponse = {
  success: boolean;
  message: string;
  verification_token: string;
  expires_at: string;
  expires_in_seconds: number;
};

// 전화번호 인증 발송
export async function sendPhoneAuth(
  phone_number: string,
): Promise<sendPhoneAuthResponse> {
  const { data } = await axiosInstance.post<sendPhoneAuthResponse>(
    '/auth/send/',
    { phone_number },
  );
  return data;
}

// 인증 토큰 검증
export async function verifyAuthToken(
  verification_token: string,
): Promise<verifyAuthTokenResponse> {
  const { data } = await axiosInstance.post<verifyAuthTokenResponse>(
    '/auth/token/verify/',
    { verification_token },
  );
  return data;
}

// 인증번호 검증
export async function verifyAuthCode(
  phone_number: string,
  verification_code: string,
): Promise<verifyAuthCodeResponse> {
  const { data } = await axiosInstance.post<verifyAuthCodeResponse>(
    '/auth/verify/',
    { phone_number, verification_code },
  );
  return data;
}
