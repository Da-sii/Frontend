import { axiosInstance } from './index';

export interface ICategory {
  category: string;
  smallCategories: string[];
}

export const categoryAPI = {
  getCategory: async (): Promise<ICategory[]> => {
    const { data } = await axiosInstance.get<ICategory[]>(
      '/products/category/',
    );
    return data;
  },
};
