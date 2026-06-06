// 제품명 기준 결정적 색상 — 같은 제품은 캘린더/바텀시트에서 항상 같은 색.
const PALETTE = [
  '#82E3AF', // green-300
  '#66A3FF', // blue-300
  '#FF9C33', // orange-400
  '#B6D43B', // lime-400
  '#F7BF3D', // yellow-400
  '#FF7070', // red-400
  '#9DD716', // lime-500
];

export function recordColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
