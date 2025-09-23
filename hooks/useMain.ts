import { mainAPI } from '@/services/home';
import { MainScreenInfo } from '@/types/models/main';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export const useMain = () => {
  const [mainScreenInfo, setMainScreenInfo] = useState<MainScreenInfo>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchMainScreen = async () => {
    setIsLoading(true);

    try {
      const data = await mainAPI.getMainScreen();

      setMainScreenInfo(data);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        //console.log('잘못된 핀번호입니다.');
      } else {
        // console.log('500');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchMainScreen,
    isLoading,
    setIsLoading,
    mainScreenInfo,
  };
};

export const useFetchMainScreenQuery = () => {
  return useQuery({
    queryKey: ['mainScreen'],
    queryFn: () => mainAPI.getMainScreen(),
  });
};
