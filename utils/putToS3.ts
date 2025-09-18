import { Platform } from 'react-native';
import * as FS from 'expo-file-system/legacy';

export async function putToS3FromUri(
  uploadUrl: string,
  localUri: string,
  contentType: string,
) {
  if (Platform.OS === 'web') {
    const fileBlob = await (await fetch(localUri)).blob();
    const r = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: fileBlob,
    });
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      throw new Error(`S3 업로드 실패(web): ${r.status} ${t}`);
    }
    return;
  }

  // ✅ RN(Hermes)에서는 Blob 금지 → 바로 바이너리 PUT
  const res = await FS.uploadAsync(uploadUrl, localUri, {
    httpMethod: 'PUT',
    uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
    headers: { 'Content-Type': contentType },
  });

  if (res.status !== 200 && res.status !== 204) {
    throw new Error(
      `S3 업로드 실패(native): ${res.status} ${res.body?.slice(0, 200) ?? ''}`,
    );
  }
}

export function extToMime(nameOrKey: string) {
  const ext = nameOrKey.split('.').pop()?.toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'heic' || ext === 'heif') return 'image/heic';
  return 'application/octet-stream';
}
