// services/auth/signIn.ts
import { axiosInstance } from '../index';

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse = {
  success: boolean;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
  access: string;
  refresh: string;
};

export async function signIn(req: SignInRequest): Promise<SignInResponse> {
  const { data } = await axiosInstance.post<SignInResponse>(
    '/auth/signin/',
    req,
  );
  return data;
}
