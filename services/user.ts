import {
  UpdateNicknamePayload,
  UpdatePasswordPayload,
  VerifyCurrentPasswordPayload,
} from '@/types/payloads/fetch';
import { InquiryPayload } from '@/types/payloads/post';
import { VerifyCurrentPasswordResponse } from '@/types/responses/my';
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

  verifyCurrentPassword: async (
    payload: VerifyCurrentPasswordPayload,
  ): Promise<VerifyCurrentPasswordResponse> => {
    const { data } = await axiosInstance.post<VerifyCurrentPasswordResponse>(
      '/auth/password/verify/',
      payload,
    );
    return data;
  },

  submitInquiry: async (payload: InquiryPayload) => {
    const response = await axiosInstance.post('/auth/advertisement/', payload);
    return response.data;
  },

  deleteUser: async () => {
    const response = await axiosInstance.delete('/auth/delete/');
    return response.data;
  },

  blockReview: async (reviewId: number) => {
    const response = await axiosInstance.post(`/review/${reviewId}/block/`, {});
    return response.data;
  },
};
