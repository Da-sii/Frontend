import { handelError } from '@/services/handelErrors';
import { mainAPI } from '@/services/home';
import { MainScreenInfo } from '@/types/models/main';
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
      handelError(error);
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
