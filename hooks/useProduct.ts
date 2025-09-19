import { productAPI } from '@/services/product';
import { IProduct } from '@/types/models/product';
import {
  GetProductsPayload,
  SearchProductsPayload,
} from '@/types/payloads/fetch';
import axios from 'axios';
import { useState } from 'react';

export const useProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState<IProduct[]>([]);

  const fetchProductList = async (payload: GetProductsPayload) => {
    setIsLoading(true);

    try {
      const data = await productAPI.getProducts(payload);
      console.log('아아:', data);
      setProductList(data.results);
      return true;
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

  const fetchSearchProducts = async (payload: SearchProductsPayload) => {
    setIsLoading(true);
    try {
      const data = await productAPI.searchProducts(payload);
      setProductList(data.results);
      return true;
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
    fetchProductList,
    fetchSearchProducts,
    isLoading,
    setIsLoading,
    productList,
  };
};
