const pad = (num: number): string => String(num).padStart(2, '0');

export const formatCurrentTime = (tab: string): string => {
  const now = new Date();

  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());

  let dateString = `${month}.${day}`;

  if (tab === 'daily') {
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    dateString += ` ${hours}:${minutes}`;
  }

  return `${dateString} 기준`;
};
