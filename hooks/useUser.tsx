import { handelError } from '@/services/handelErrors';
import { userAPI } from '@/services/user';
import { IUser } from '@/types/models/user';
import {
  UpdateNicknamePayload,
  UpdatePasswordPayload,
  VerifyCurrentPasswordPayload,
} from '@/types/payloads/fetch';

import { useCallback, useState } from 'react';

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mypageInfo, setMypageInfo] = useState<IUser>();

  const fetchMypage = useCallback(async () => {
    try {
      const data = await userAPI.getMypage();
      setMypageInfo(data.user_info);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateNickname = async (payload: UpdateNicknamePayload) => {
    setIsLoading(true);

    try {
      const data = await userAPI.updateNickname(payload);
      return data;
    } catch (error) {
      handelError(error);
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
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCurrentPassword = async (
    payload: VerifyCurrentPasswordPayload,
  ) => {
    setIsLoading(true);
    try {
      const data = await userAPI.verifyCurrentPassword(payload);
      return data;
    } catch (error) {
      handelError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async () => {
    setIsLoading(true);
    try {
      const data = await userAPI.deleteUser();
      return data;
    } catch (error) {
      handelError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchMypage,
    mypageInfo,
    updateNickname,
    updatePassword,
    verifyCurrentPassword,
    isLoading,
    setIsLoading,
    deleteUser,
  };
};
