import { axiosInstance } from '../index';

type ReviewImagesDTO = { url: string };

export type MyReviewListDTO = {
  success: boolean;
  user_id: number;
  reviews: Record<string, MyReview>; // key = 닉네임
};

export type ProductInfoDTO = {
  id: number;
  name: string;
  company: string;
  image: { id: number; url: string };
};
export type MyReview = {
  review_id: number;
  nickname: string;
  rate: number;
  date?: string;
  review: string;
  images: ReviewImagesDTO[]; // url만 뽑아 정규화
  product_info: ProductInfoDTO;
};

export async function getMyReviewList(review_id: number): Promise<MyReview[]> {
  const { data } = await axiosInstance.get<MyReviewListDTO>(
    `/review/myReviews/${review_id}/`,
  );

  return Object.entries(data.reviews ?? {}).map(
    ([nickname, v]: [string, MyReview]) => ({
      review_id: v.review_id,
      nickname,
      rate: v.rate,
      date: v.date,
      review: v.review,

      images: v.images,
      product_info: v.product_info,
    }),
  );
}
