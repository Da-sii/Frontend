import { IBannerCell } from '@/types/models/main';
import { axiosInstance } from './index';

export const mainAPI = {
  getMainScreen: async () => {
    const { data } = await axiosInstance.get('/products/main/');
    return data;
  },

  getBanners: async (): Promise<IBannerCell[]> => {
    const { data } = await axiosInstance.get('/banners/');
    return data.map((item: any) => ({
      id: String(item.id),
      image: { uri: item.image_url },
      imageUrl: item.image_url,
    }));
  },
};
