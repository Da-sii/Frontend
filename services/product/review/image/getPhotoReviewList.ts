import { axiosInstance } from '../../../index';

type ReviewsImagesMapDTO = {
  success?: boolean;
  product_id: number;
  total_images: number;
  image_urls: { id: number; url: string }[];
};

export async function fetchReviewsImagesList(
  product_id: number,
  image_id: number,
) {
  try {
    const { data } = await axiosInstance.get<ReviewsImagesMapDTO>(
      `/review/product/${product_id}/images/${image_id}/`,
    );
    return data;
  } catch (e: any) {
    const status = e?.response?.status;
    const body = e?.response?.data;
    console.log('[fetchReviewsImagesList] FAIL', {
      status,
      body,
      product_id,
      image_id,
    });

    throw e;
  }
}
