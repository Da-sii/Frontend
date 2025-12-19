// 제품 상세 조회 API 서비스
import { axiosInstance } from '..';

export type ProductImage = { url: string };

export type ProductIngredient = {
  ingredientName: string;
  englishName: string;
  amount: string;
  minRecommended: string;
  maxRecommended: string;
  effect: string;
  sideEffect: string;
  status: string; // "unknown" 등
};

export type ProductDetailDTO = {
  id: number;
  name: string;
  company: string;
  productType: string; // "supplement"
  isMyReview: boolean;
  reviewCount: number; // int
  reviewAvg: number | null; // null 가능
  ranking: any[]; // 서버에서 배열 내려줌
  images: ProductImage[];
  reviewImages: ProductImage[];
  ingredientsCount: number;
  ingredients: ProductIngredient[];
};

// UI 사용 편의를 위한 클라이언트 전용 타입
export type ProductDetail = ProductDetailDTO & {
  reviewCountNum: number;
  reviewAvgNum: number | null;
  rankingNum: number | null;
};

// DTO → ViewModel 변환
function mapToProductDetail(dto: ProductDetailDTO): ProductDetail {
  const toNum = (v: any): number | null => {
    if (v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    ...dto,
    reviewCountNum: dto.reviewCount,
    reviewAvgNum: toNum(dto.reviewAvg),
    rankingNum: toNum(dto.ranking as any), // 빈 배열이면 null
  };
}

export async function getProductDetail(
  id: number | string,
): Promise<ProductDetail> {
  const { data } = await axiosInstance.get<ProductDetailDTO>(
    `/products/${id}/`,
    {
      headers: { Accept: 'application/json' },
    },
  );
  return mapToProductDetail(data);
}
