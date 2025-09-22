import { userAPI } from '@/services/user';
import {
  UpdateNicknamePayload,
  UpdatePasswordPayload,
} from '@/types/payloads/fetch';
import axios from 'axios';

import { useState } from 'react';

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateNickname = async (payload: UpdateNicknamePayload) => {
    setIsLoading(true);

    try {
      const data = await userAPI.updateNickname(payload);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('잘못된 핀번호입니다.');
      } else {
        console.log('500');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (payload: UpdatePasswordPayload) => {
    setIsLoading(true);
    try {
      const data = await userAPI.updatePassword(payload);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('잘못된 핀번호입니다.');
      } else {
        console.log('500');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateNickname,
    updatePassword,
    isLoading,
    setIsLoading,
  };
};
