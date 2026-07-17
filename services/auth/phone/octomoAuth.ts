// services/auth/phone/octomoAuth.ts
import { axiosInstance } from '../../index';

export type OctomoSendResponse = {
  success: boolean;
  parsed_phone: string;
  code: string;
  message: string;
};

export type OctomoVerifyResponse = {
  success: boolean;
  message: string;
  verification_token: string;
  expires_at: string;
  expires_in_seconds: number;
};

// 옥토모 인증코드 발급
export async function sendOctomoAuth(
  phone_number: string,
): Promise<OctomoSendResponse> {
  const { data } = await axiosInstance.post<OctomoSendResponse>(
    '/auth/octomo/send/',
    { phone_number },
  );
  return data;
}

// 옥토모 수신 여부 확인
export async function verifyOctomoAuth(
  phone_number: string,
): Promise<OctomoVerifyResponse> {
  const { data } = await axiosInstance.post<OctomoVerifyResponse>(
    '/auth/octomo/verify/',
    { phone_number },
  );
  return data;
}
