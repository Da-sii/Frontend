import { axiosInstance } from './index';

export const mainAPI = {
  getMainScreen: async () => {
    const { data } = await axiosInstance.get('/products/main/');
    return data;
  },
};
