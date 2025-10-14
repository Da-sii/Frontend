import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getProductDetail,
  ProductDetail,
} from '../../services/product/getProductDetail';

export const productKeys = {
  all: ['product'] as const,
  detail: (id: number | string) =>
    [...productKeys.all, 'detail', String(id)] as const,
};

export function useProductDetail(id?: number | string) {
  return useQuery<ProductDetail>({
    queryKey: id
      ? productKeys.detail(id)
      : [...productKeys.all, 'detail', 'unknown'],
    queryFn: () => {
      if (id == null) throw new Error('id is required');
      return getProductDetail(id);
    },
    enabled: id != null, // id 있을 때만 호출
    placeholderData: keepPreviousData,
  });
}
