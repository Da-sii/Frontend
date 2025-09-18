import { axiosInstance } from '../index';

type ReviewImagesDTO = { url: string };

type ReviewValueDTO = {
  rate: number;
  date?: string;
  review: string;
  images?: ReviewImagesDTO[];
};

export type MyReviewListDTO = {
  success: boolean;
  reviews: Record<string, ReviewValueDTO>; // key = 닉네임
};

export type MyReview = {
  nickname: string;
  rate: number;
  date?: string;
  review: string;
  images: string[]; // url만 뽑아 정규화
};
export async function getMyReviewList(): Promise<MyReview[]> {
  const { data } =
    await axiosInstance.get<MyReviewListDTO>(`/review/myReviews/`);
  return Object.entries(data.reviews ?? {}).map(
    ([nickname, v]: [string, ReviewValueDTO]) => ({
      nickname,
      rate: v.rate,
      date: v.date,
      review: v.review,
      images: (v.images ?? []).map((img) => img.url),
    }),
  );
}
