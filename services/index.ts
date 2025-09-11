import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../lib/authToken';

const MOCK_ACTIVATE = process.env.MOCK_ACTIVATE;

const baseUrl =
  MOCK_ACTIVATE === 'enable'
    ? process.env.EXPO_PUBLIC_MOCK_API_URL
    : process.env.EXPO_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  adapter: 'fetch',
  baseURL: baseUrl,
});

// ---- 요청 로깅 + accessToken 주입
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (__DEV__) {
      const url = (config.baseURL || '') + (config.url || '');
      console.log('[AXIOS] →', url, 'params=', config.params);
    }
    const accessToken = await getAccessToken();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
);

// ---- 401 갱신 큐
let isRefreshing = false;
let waitQueue: {
  resolve: (token: string) => void;
  reject: (e: any) => void;
}[] = [];

function processQueue(token?: string, err?: any) {
  waitQueue.forEach((p) => (token ? p.resolve(token) : p.reject(err)));
  waitQueue = [];
}

async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

  const { data } = await axios.post(`${baseUrl}/api/token/refresh`, {
    refresh: refreshToken,
  });
  // 응답 키 이름도 서버에 맞게 수정
  const newAT = data.access;
  const newRT = data.refresh ?? refreshToken;
  await setTokens(newAT, newRT);
  return newAT;
}

axiosInstance.interceptors.response.use(
  (res) => {
    if (__DEV__) console.log('[AXIOS] ←', res.config.url, res.status);
    return res;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (status === 401 && !original?._retry) {
      original._retry = true;

      if (isRefreshing) {
        // 갱신 완료까지 대기
        return new Promise((resolve, reject) => {
          waitQueue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(original));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const newAT = await refreshAccessToken();
        processQueue(newAT);
        original.headers.Authorization = `Bearer ${newAT}`;
        return axiosInstance(original);
      } catch (e) {
        processQueue(undefined, e);
        await clearTokens();
        // TODO: 전역 상태로 로그아웃 처리/로그인 페이지 이동 트리거
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    if (__DEV__) {
      console.log(
        '[AXIOS] ← ERROR',
        error.config?.url,
        status,
        error.response?.data,
      );
    }
    return Promise.reject(error);
  },
);
