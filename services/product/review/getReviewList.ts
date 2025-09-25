// services/product/review/getReviewList.ts
import { axiosInstance } from '../../index';

type ReviewImagesDTO = { url: string };

type ReviewValueDTO = {
  review_id: number;
  user_nickname: string;
  rate: number;
  date?: string;
  review: string;
  images?: ReviewImagesDTO[];
  updated: boolean;
};

// 서버가 주는 여러 형태를 다 수용 (맵/배열/래퍼)
type ReviewsMapDTO = {
  success?: boolean;
  reviews?: Record<string, ReviewValueDTO>;
};
type ReviewsArrayDTO =
  | {
      success?: boolean;
      reviews?: ReviewValueDTO[];
      results?: ReviewValueDTO[];
    }
  | ReviewValueDTO[];

export type ProductReview = {
  review_id: number;
  user_nickname: string;
  rate: number;
  date?: string;
  review: string;
  images: string[]; // url만 추출
  updated: boolean;
};
export type ReviewSort = 'high' | 'low' | 'time';

function normalizeOne(v: ReviewValueDTO): ProductReview {
  return {
    review_id: v.review_id,
    user_nickname: v.user_nickname,
    updated: v.updated,
    rate: v.rate,
    date: v.date,
    review: v.review,
    images: (v.images ?? []).map((img) => img.url),
  };
}

export async function fetchProductReviews(
  productId: number,
  reviewId: number,
  sort: ReviewSort,
): Promise<ProductReview[]> {
  try {
    const { data } = await axiosInstance.get<ReviewsMapDTO & ReviewsArrayDTO>(
      `/review/product/${productId}/reviews/${reviewId}/`,
      { params: { sort } },
    );

    // 1) 순수 배열인 경우
    if (Array.isArray(data)) {
      return data.map(normalizeOne);
    }

    // 2) { reviews: [] } 형태
    if (Array.isArray((data as any)?.reviews)) {
      return (data as any).reviews.map(normalizeOne);
    }

    // 3) { results: [] } 형태
    if (Array.isArray((data as any)?.results)) {
      return (data as any).results.map(normalizeOne);
    }

    // 4) { reviews: { nick: {...}, ... } } 맵 형태
    if (
      data &&
      typeof data === 'object' &&
      (data as any).reviews &&
      !Array.isArray((data as any).reviews)
    ) {
      const map = (data as any).reviews as Record<string, ReviewValueDTO>;
      return Object.values(map ?? {}).map(normalizeOne);
    }

    // 5) 그 외(204/null 등) → 빈 배열
    return [];
  } catch (e) {
    // 401/5xx 등 에러도 빈 배열로 처리 (무한스크롤에서 length 접근 보호)
    // 필요시 여기서 상태코드에 따라 토스트/로그 처리
    return [];
  }
}
