import { axiosInstance } from '../../../index';

type ReviewDetail = {
  id: number;
  user: {
    id: number;
    nickname: string;
    email: string;
  };
  product: {
    id: number;
    name: string;
    company: string;
    price: number;
    unit: string;
    piece: number;
    productType: string;
    viewCount: number;
  };
  rate: number;
  review: string;
  date: string;
  updated: boolean;
  images: {
    id: number;
    url: string;
  }[];
};

type ReviewDetailMapDTO = {
  success?: boolean;
  review: ReviewDetail;
};

export async function getPhotoReviewDetail(review_id: number) {
  try {
    const { data } = await axiosInstance.get<ReviewDetailMapDTO>(
      `/review/detail/${review_id}/`,
    );
    console.log('data', data);
    return data.review;
  } catch (e: any) {
    const status = e?.response?.status;
    const body = e?.response?.data;
    console.log('[getPhotoReviewDetail] FAIL', { status, body, review_id });

    throw e;
  }
}
