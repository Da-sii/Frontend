// services/auth/signIn.ts
import { axiosInstance } from '../index';

export type findIDWithPhoneResponse = {
  sucesss: boolean;
  phone_number: string;
  accounts: [{ email: string; created_at: null | string }]; //login_type 없음 (추후 추가)
  message: string;
};

// 전화번호 인증 발송
export async function findIDWithPhone(
  phone_number: string,
): Promise<findIDWithPhoneResponse> {
  const { data } = await axiosInstance.get<findIDWithPhoneResponse>(
    `/auth/phone/account-info`,
    { params: { phone_number } },
  );
  return data;
}
