import { axiosInstance } from '../index';

export type ResetPasswordRequest = {
  email: string;
  new_password1: string;
  new_password2: string;
  verification_token: string;
};
export type ResetPasswordResponse = {
  success: boolean;
  email: string;
  user_id: number;
  message: string;
};

export async function resetPasswordConfirm(
  body: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  const { data } = await axiosInstance.post<ResetPasswordResponse>(
    '/auth/email/password/reset/',
    body,
  );
  return data;
}
