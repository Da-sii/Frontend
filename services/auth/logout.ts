// services/auth/signIn.ts
import { axiosInstance } from '../index';

export async function serverLogout(): Promise<void> {
  await axiosInstance.post('/auth/logout/');
}
