import { productAPI } from '@/services/product';
import { rankingAPI } from '@/services/ranking';
import {
  GetProductsPayload,
  GetRankingPayload,
  SearchProductsPayload,
} from '@/types/payloads/fetch';
import { useQuery } from '@tanstack/react-query';

export const useFetchProductsQuery = (payload: GetProductsPayload) => {
  return useQuery({
    queryKey: ['products', payload],
    queryFn: () => productAPI.getProducts(payload),
    enabled: !!payload.bigCategory,
  });
};

export const useSearchProductsQuery = (payload: SearchProductsPayload) => {
  return useQuery({
    queryKey: ['products', 'search', payload],
    queryFn: () => productAPI.searchProducts(payload),
    enabled: !!payload.word?.trim(),
  });
};

export const useFetchRankingQuery = (payload: GetRankingPayload) => {
  return useQuery({
    queryKey: ['ranking', payload],
    queryFn: () => rankingAPI.getRanking(payload),
  });
};
