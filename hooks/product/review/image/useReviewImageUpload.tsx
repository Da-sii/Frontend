import { useCallback, useMemo, useRef, useState } from 'react';
import type { Picked, PresignedItem } from '@/types/review';
import { addReviewImage } from '../../../../services/product/review/image/getPresignedUrl';
import { putToS3FromUri, extToMime } from '../../../../utils/putToS3';

export function useReviewImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0); // 0~1
  const [error, setError] = useState<Error | null>(null);
  const controllersRef = useRef<AbortController[]>([]);

  const cancel = useCallback(() => {
    // legacy uploadAsync는 취소가 안 돼서 UX용 표시만
    // controllersRef.current.forEach((c) => c.abort());
    // controllersRef.current = [];
    setIsUploading(false);
    setError(new Error('업로드가 취소되었습니다.'));
  }, []);

  const upload = useCallback(async (reviewId: number, picked: Picked[]) => {
    if (!picked.length)
      return { finalUrls: [] as string[], items: [] as PresignedItem[] };
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 1) 파일명 → presigned
      const names = picked.map(
        (p) => p.fileName ?? p.uri.split('/').pop() ?? 'image.jpg',
      );
      const items = await addReviewImage(reviewId, names);

      // 2) 매칭: original_url ↔ Picked
      const byName = new Map<string, Picked>();
      picked.forEach((p) => {
        const k = (p.fileName ?? p.uri.split('/').pop() ?? '').trim();
        if (k) byName.set(k, p);
      });

      // 3) 순차 업로드 (병렬 원하면 Promise.all로 교체)
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const p = byName.get(it.original_url ?? '');
        if (!p) throw new Error(`로컬 파일 매칭 실패: ${it.original_url}`);

        const contentType = p.mimeType ?? extToMime(it.filename);
        await putToS3FromUri(it.upload_url, p.uri, contentType);

        setProgress((i + 1) / items.length);
      }

      setIsUploading(false);
      return { finalUrls: items.map((i) => i.final_url), items };
    } catch (e: any) {
      setIsUploading(false);
      setError(e instanceof Error ? e : new Error(String(e)));
      throw e;
    } finally {
      controllersRef.current = [];
    }
  }, []);

  return useMemo(
    () => ({
      upload,
      cancel,
      isUploading,
      progress,
      error,
    }),
    [upload, cancel, isUploading, progress, error],
  );
}
