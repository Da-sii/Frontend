import {
  DAISO_SEARCH_ALIASES,
  DAISO_SEARCH_KEYWORD,
} from '@/constants/daiso';

/**
 * 검색 API에 넘길 키워드를 정규화한다.
 * 'daiso', '다이소몰' 처럼 백엔드가 인식하지 못하는 별칭만 '다이소'로 치환하고,
 * 그 외에는 입력값을 그대로 사용한다.
 * (부분 일치는 하지 않는다. '다이소파스' 같은 입력이 오치환되면 안 되기 때문)
 */
export const normalizeSearchKeyword = (word: string) => {
  const trimmed = word.trim();
  const compact = trimmed.replace(/\s/g, '').toLowerCase();

  return DAISO_SEARCH_ALIASES.includes(compact)
    ? DAISO_SEARCH_KEYWORD
    : trimmed;
};
