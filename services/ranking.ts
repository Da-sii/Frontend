import { GetRankingPayload } from '@/types/payloads/fetch';
import { RankingResponse } from '@/types/responses/product';
import { axiosInstance } from '.';

export const rankingAPI = {
  getRanking: async (payload: GetRankingPayload) => {
    const { data } = await axiosInstance.get<RankingResponse>(
      '/products/ranking/',
      {
        params: payload,
      },
    );
    return data;
  },
};
