import { rankingAPI } from '@/services/ranking';
import { GetRankingPayload } from '@/types/payloads/fetch';
import { RankingResponse } from '@/types/responses/product';
import axios from 'axios';

import { useState } from 'react';

export const useRanking = () => {
  const [rankingInfo, setRankingInfo] = useState<RankingResponse>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchRanking = async (payload: GetRankingPayload) => {
    setIsLoading(true);

    try {
      const data = await rankingAPI.getRanking(payload);
      console.log('ranking: ', data);
      setRankingInfo(data);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('잘못된 핀번호입니다.');
      } else {
        console.log('500');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchRanking,
    isLoading,
    setIsLoading,
    rankingInfo,
  };
};
