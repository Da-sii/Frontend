const CDN = process.env.EXPO_PUBLIC_CDN_PREFIX;

export const toCdnUrl = (key: string) => {
  if (!key) return '';
  return `${CDN}/${key}`;
};