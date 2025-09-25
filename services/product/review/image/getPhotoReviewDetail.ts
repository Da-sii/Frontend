import { axiosInstance } from '../../../index';

type ImagesReviewDetail = {
  url: string;
  nickname: string;
  rate: number;
  date: string;
  review: string;
};

type ImagesReviewDetailMapDTO = {
  success?: boolean;
  image_id: number;
  review_info: ImagesReviewDetail;
};

export async function getPhotoReviewDetail(image_id: number) {
  try {
    const { data } = await axiosInstance.get<ImagesReviewDetailMapDTO>(
      `/review/image/${image_id}/`,
    );
    console.log('data', data);
    return data.review_info;
  } catch (e: any) {
    const status = e?.response?.status;
    const body = e?.response?.data;
    console.log('[getPhotoReviewDetail] FAIL', { status, body, image_id });

    throw e;
  }
}
