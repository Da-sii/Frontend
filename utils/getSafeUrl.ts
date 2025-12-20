export function getSafeUrl(link: string) {
  // 절대 URL(http/https)이거나 상대 경로(/)로 시작하면 안전한 것으로 간주
  const isAbsoluteUrl = /^https?:\/\//i.test(link);
  const isRelativePath = link.startsWith('/');
  const isHashLink = link.startsWith('#');
  const isRelativeFile = link.startsWith('./') || link.startsWith('../');

  const safeHref =
    isAbsoluteUrl || isRelativePath || isHashLink || isRelativeFile ? link : '';
  return safeHref;
}
