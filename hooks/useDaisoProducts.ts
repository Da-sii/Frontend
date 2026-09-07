import { DAISO_BIG_CATEGORY } from '@/constants/daiso';
import { handelError } from '@/services/handelErrors';
import { productAPI } from '@/services/product';
import { IProduct } from '@/types/models/product';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

// next가 비정상 동작할 경우를 대비한 루프 가드
const MAX_PAGES = 20;

/**
 * 뱃지 판별용이라 전부 못 모아도 일부라도 붙는 편이 낫다.
 * 중간 페이지가 실패하면 그때까지 모은 결과를 반환한다 (all-or-nothing 방지).
 */
const fetchAllDaisoProducts = async (): Promise<IProduct[]> => {
  const products: IProduct[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    let data;

    try {
      data = await productAPI.getProducts({
        bigCategory: DAISO_BIG_CATEGORY,
        sort: 'monthly_rank',
        page,
      });
    } catch (error) {
      handelError(error);
      if (__DEV__) {
        console.warn(
          `[daiso] ${page}페이지 조회 실패. ${products.length}개까지만 뱃지가 붙습니다.`,
        );
      }
      break;
    }

    products.push(...(data.results ?? []));

    if (!data.next) break;

    // 상한에 걸려 잘리면 이후 상품은 다이소여도 뱃지가 안 붙는다.
    if (page === MAX_PAGES && __DEV__) {
      console.warn(
        `[daiso] MAX_PAGES(${MAX_PAGES}) 도달. 남은 페이지의 상품에는 뱃지가 붙지 않습니다.`,
      );
    }
  }

  return products;
};

/**
 * 다이소 대분류 상품 전체.
 * 뱃지 판별용으로 여러 화면에서 쓰이므로 전체 페이지를 모아 하나의 캐시로 관리한다.
 */
export const useDaisoProductsQuery = () => {
  return useQuery({
    queryKey: ['products', 'daiso'],
    queryFn: fetchAllDaisoProducts,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

/**
 * 다이소 상품 id 집합.
 * 목록/검색 응답에 다이소 여부 필드가 없어서 id로 판별한다.
 * 추후 백엔드가 isDaiso를 내려주면 이 훅 내부만 교체하면 된다.
 */
export const useDaisoProductIds = (): Set<number> => {
  const { data } = useDaisoProductsQuery();

  return useMemo(() => new Set((data ?? []).map((item) => item.id)), [data]);
};
