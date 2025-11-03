import { categoryAPI } from '@/services/category';
import { ICategory, IRankingCategory } from '@/types/models/category';
import axios from 'axios';
import { useState } from 'react';

export const useCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [rankingCategories, setRankingCategories] = useState<
    IRankingCategory[]
  >([]);

  const fetchCategories = async () => {
    setIsLoading(true);

    try {
      const data = await categoryAPI.getCategory();
      setCategories(data);
      console.log(data);
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

  const fetchRankingCategories = async () => {
    setIsLoading(true);

    try {
      const data = await categoryAPI.getRankingCategory();
      setRankingCategories(data);
      console.log('으아아아아아아', data);
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
    fetchRankingCategories,
    rankingCategories,
  };
};
