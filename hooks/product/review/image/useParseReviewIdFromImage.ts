export function useParseReviewIdFromImage() {
  const parseReviewId = (url: string) => {
    // 예: "5/44/b0e2ac6f-591a-4a83-8d6e-cfc5f3da29a3.jpg"
    const pathPattern = url.match(/^(\d+)\/(\d+)\//);
    return pathPattern ? Number(pathPattern[2]) : -1;
  };

  return { parseReviewId };
}
