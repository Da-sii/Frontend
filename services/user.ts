import {
  UpdateNicknamePayload,
  UpdatePasswordPayload,
} from '@/types/payloads/fetch';
import {
  UpdateNicknameResponse,
  UpdatePasswordResponse,
} from '@/types/responses/product';
import { axiosInstance } from '.';

export const userAPI = {
  updateNickname: async (
    payload: UpdateNicknamePayload,
  ): Promise<UpdateNicknameResponse> => {
    const { data } = await axiosInstance.patch<UpdateNicknameResponse>(
      '/auth/nickname/',
      payload,
    );
    return data;
  },

  updatePassword: async (
    payload: UpdatePasswordPayload,
  ): Promise<UpdatePasswordResponse> => {
    const { data } = await axiosInstance.post<UpdatePasswordResponse>(
      '/auth/password/',
      payload,
    );
    return data;
  },
};
