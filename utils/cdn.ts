export const CDN_PREFIX = process.env.EXPO_PUBLIC_CDN_PREFIX;

export const toCdnUrl = (key: string) => `${CDN_PREFIX}/${key}`; // "7/13/uuid.jpg" → "https://.../7/13/uuid.jpg"
