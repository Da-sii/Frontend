import {
  GetProductsPayload,
  SearchProductsPayload,
} from '@/types/payloads/fetch';
import { ProductListResponse } from '@/types/responses/product';
import { axiosInstance } from '.';

export const productAPI = {
  getProducts: async (
    payload: GetProductsPayload,
  ): Promise<ProductListResponse> => {
    const { data } = await axiosInstance.get<ProductListResponse>(
      '/products/list/',
      {
        params: payload,
      },
    );
    return data;
  },

  searchProducts: async (
    payload: SearchProductsPayload,
  ): Promise<ProductListResponse> => {
    const { data } = await axiosInstance.get<ProductListResponse>(
      '/products/search/',
      {
        params: payload,
      },
    );
    return data;
  },
};
