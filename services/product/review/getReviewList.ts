import { axiosInstance } from '../../index';

type ReviewImagesDTO = { url: string };

type ReviewValueDTO = {
  rate: number;
  date?: string;
  review: string;
  images?: ReviewImagesDTO[];
};

export type ReviewsDTO = {
  success: boolean;
  reviews: Record<string, ReviewValueDTO>; // key = 닉네임
};

export type ProductReview = {
  nickname: string;
  rate: number;
  date?: string;
  review: string;
  images: string[]; // url만 뽑아 정규화
};

export async function fetchProductReviews(
  productId: number,
): Promise<ProductReview[]> {
  const { data } = await axiosInstance.get<ReviewsDTO>(
    `/review/product/${productId}/reviews/`,
  );

  console.log(data);
  // 객체 → 배열로 변환 + images 정규화
  const arr: ProductReview[] = Object.entries(data.reviews ?? {}).map(
    ([nickname, v]) => ({
      nickname,
      rate: v.rate,
      date: v.date,
      review: v.review,
      images: (v.images ?? []).map((img) => img.url),
    }),
  );
  return arr;
}
