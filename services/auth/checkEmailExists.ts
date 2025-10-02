// services/auth/checkEmail.ts
import { axiosInstance } from '../index';

export type CheckEmailRequest = {
  email: string;
};

export type CheckEmailResponse = {
  success: boolean;
  email: string;
  exists: boolean;
  message: string;
};

/** 이메일 존재 여부 확인 */
export async function checkEmailExists(
  payload: CheckEmailRequest,
): Promise<CheckEmailResponse> {
  const { data } = await axiosInstance.post<CheckEmailResponse>(
    '/auth/email/check/',
    payload,
  );
  return data;
}
