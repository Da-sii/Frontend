import KO_LIST from '@/constants/koBadwords';
import leoProfanity from 'leo-profanity';

type Result = { isProfane: boolean; cleaned: string; hits: string[] };

// 화이트리스트(오탐 방지)
const WHITELIST = ['시발점', '시발유'];

// 정규화 유틸
const ZW = /\u200B|\u200C|\u200D/g;
const STRIP = /[\s`~!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?·•…—]/g;
const MAP_TABLE: Array<[RegExp, string]> = [
  [/[0oＯｏ]/gi, 'o'],
  [/[@Ａａa]/gi, 'a'],
  [/[1l|!Ⅰ]/g, 'l'],
  [/[5Ｓｓ]/g, 's'],
  [/[3Ｅｅ]/g, 'e'],
];

const normalize = (s: string) => {
  let t = String(s ?? '')
    .normalize('NFKC')
    .replace(ZW, '')
    .toLowerCase();
  t = t.replace(STRIP, '');
  for (const [re, rep] of MAP_TABLE) t = t.replace(re, rep);
  return t;
};
const isUseful = (w: string) => !!w && w.length >= 2 && /[a-z가-힣]/.test(w);

// 1) 원본 사전(중복 제거)
const FINAL_ORIGINAL = Array.from(
  new Set(KO_LIST.map((w) => String(w ?? '').trim()).filter(Boolean)),
);

// 2) leo는 치환용으로만 사용
leoProfanity.clearList();
leoProfanity.add(FINAL_ORIGINAL);

function removeWhitelist(text: string) {
  let out = text;
  for (const w of WHITELIST) {
    const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    out = out.replace(re, '');
  }
  return out;
}

export default function useProfanity() {
  const check = (text: string): Result => {
    if (!text?.trim()) return { isProfane: false, cleaned: text, hits: [] };

    const t0 = removeWhitelist(text);
    const nText = normalize(t0);

    // 정규화된 include 매칭 (한글/우회에 강함)
    const hits: string[] = [];
    for (const original of FINAL_ORIGINAL) {
      const nw = normalize(original);
      if (!isUseful(nw)) continue;
      if (nText.includes(nw)) hits.push(original);
    }

    const unique = Array.from(new Set(hits));
    const isProfane = unique.length > 0;
    const cleaned = isProfane ? leoProfanity.clean(text) : text;

    if (__DEV__) {
      console.log(
        '[profanity] dict.len=',
        FINAL_ORIGINAL.length,
        'hits=',
        unique,
      );
    }
    return { isProfane, cleaned, hits: unique.slice(0, 10) };
  };

  return { check };
}
