import {
  UpdateNicknamePayload,
  UpdatePasswordPayload,
} from '@/types/payloads/fetch';
import {
  MypageResponse,
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

  getMypage: async (): Promise<MypageResponse> => {
    const { data } = await axiosInstance.get<MypageResponse>('/auth/mypage/', {
      disableRedirect: true,
    });
    return data;
  },
};
