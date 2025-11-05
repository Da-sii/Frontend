import { mainAPI } from '@/services/home';
import { productAPI } from '@/services/product';
import { rankingAPI } from '@/services/ranking';
import {
  GetProductsPayload,
  GetRankingPayload,
  SearchProductsPayload,
} from '@/types/payloads/fetch';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const useFetchProductsQuery = (payload: GetProductsPayload) => {
  return useInfiniteQuery({
    queryKey: ['products', payload],
    queryFn: ({ pageParam = 1 }) =>
      productAPI.getProducts({ ...payload, page: pageParam }),
    enabled: !!payload.bigCategory,

    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const hasNext = lastPage.next !== null;
      const currentPage = allPages.length;
      return hasNext ? currentPage + 1 : undefined;
    },
  });
};

export const useSearchProductsQuery = (payload: SearchProductsPayload) => {
  return useInfiniteQuery({
    queryKey: ['products', 'search', payload],
    queryFn: ({ pageParam = 1 }) =>
      productAPI.searchProducts({ ...payload, page: pageParam }),
    enabled: !!payload.word?.trim(),

    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const hasNext = lastPage.next !== null;
      const currentPage = allPages.length;
      return hasNext ? currentPage + 1 : undefined;
    },
  });
};

export const useFetchRankingQuery = (payload: GetRankingPayload) => {
  return useInfiniteQuery({
    queryKey: ['ranking', payload],

    queryFn: ({ pageParam = 1 }) => {
      return rankingAPI.getRanking({ ...payload, page: pageParam });
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      const hasNext = lastPage.next !== null;
      const currentPage = allPages.length;
      return hasNext ? currentPage + 1 : undefined;
    },
  });
};

export const useFetchMainScreenQuery = () => {
  return useQuery({
    queryKey: ['mainScreen'],
    queryFn: () => mainAPI.getMainScreen(),
  });
};
