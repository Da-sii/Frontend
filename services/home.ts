import { IBannerAPIItem } from '@/types/models/main';
import { axiosInstance } from './index';

export const mainAPI = {
  getMainScreen: async () => {
    const { data } = await axiosInstance.get('/products/main/');
    return data;
  },

  getBanners: async (): Promise<IBannerAPIItem[]> => {
    const { data } = await axiosInstance.get('/banners/');
    return data;
  },
};
