/**
 * 다이소 제품은 백엔드에서 별도 플래그가 아니라 "대분류 카테고리" 하나로 처리된다.
 * 상품 응답(IProduct)에 다이소 여부 필드가 없기 때문에,
 * 프론트에서는 이 대분류로 조회한 상품 목록을 기준으로 다이소 여부를 판별한다.
 */

/** 백엔드 대분류명과 정확히 일치해야 한다 (공백 포함) */
export const DAISO_BIG_CATEGORY = '다이소 제품';

/** 검색 API가 인식하는 정규 키워드 */
export const DAISO_SEARCH_KEYWORD = '다이소';

/** 입력 시 정규 키워드로 치환할 별칭 (공백 제거 + 소문자 비교) */
export const DAISO_SEARCH_ALIASES = [
  '다이소',
  '다이소몰',
  '다이소제품',
  'daiso',
  'daisomall',
];

/** 홈 다이소 섹션 캐러셀에 노출할 상품 수. 전체 목록을 그대로 넘기지 않기 위한 상한 */
export const DAISO_PREVIEW_COUNT = 10;
