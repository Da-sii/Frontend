import { axiosInstance } from '../index';

type SignUpRequest = {
  email: string;
  password: string;
  password2: string;
};

type SignUpResponse = {
  id: number;
  email: string;
};

export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  const res = await axiosInstance.post<SignUpResponse>('/api/signup/', data);
  return res.data;
}
