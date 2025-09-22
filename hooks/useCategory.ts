import { categoryAPI } from '@/services/category';
import { ICategory } from '@/types/models/category';
import axios from 'axios';
import { useState } from 'react';

export const useCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const fetchCategories = async () => {
    setIsLoading(true);

    try {
      const data = await categoryAPI.getCategory();
      setCategories(data);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        //console.log('잘못된 핀번호입니다.');
      } else {
        //console.log('500');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchCategories,
    isLoading,
    setIsLoading,
    categories,
  };
};
