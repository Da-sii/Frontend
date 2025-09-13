import { axiosInstance } from '../index';

export type SignUpRequest = {
  email: string;
  password: string;
  password2: string;
};

export type SignUpResponse = {
  id: number;
  email: string;
};

export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  const res = await axiosInstance.post<SignUpResponse>('/auth/signup/', data);
  return res.data;
}
