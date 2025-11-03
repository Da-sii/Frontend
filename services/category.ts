import { ICategory, IRankingCategory } from '@/types/models/category';
import { axiosInstance } from './index';

export const categoryAPI = {
  getCategory: async (): Promise<ICategory[]> => {
    const { data } = await axiosInstance.get<ICategory[]>(
      '/products/category/',
    );
    return data;
  },

  getRankingCategory: async (): Promise<IRankingCategory[]> => {
    const { data } = await axiosInstance.get<IRankingCategory[]>(
      '/products/ranking/category/',
    );
    return data;
  },
};
