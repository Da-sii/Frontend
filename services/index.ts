import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { clearTokens, getAccessToken, setTokens } from '../lib/authToken';

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export const publicAxios = axios.create({
  baseURL: baseUrl,
  withCredentials: false,
});

// ---- 요청 로깅 + accessToken 주입
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
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

function flushQueue(token?: string, err?: any) {
  waitQueue.forEach((p) => (token ? p.resolve(token) : p.reject(err)));
  waitQueue = [];
}

async function refreshViaCookie() {
  const { data } = await axiosInstance.post('/auth/token/refresh/');
  const newAT = data.access;
  await setTokens(newAT);
  return newAT;
}

// ✅ refresh 제외 엔드포인트
function shouldSkipRefresh(url?: string) {
  if (!url) return false;
  // 로그인 전 / 인증 시작 단계는 refresh 의미 없음
  return (
    url.includes('/auth/prelogin/') ||
    // url.includes('/auth/login') ||
    // url.includes('/auth/signup') ||
    url.includes('/auth/token/refresh/') // refresh 자체는 재귀 방지
  );
}

axiosInstance.interceptors.response.use(
  (res) => {
    if (__DEV__) {
      const url = (res.config.baseURL || '') + (res.config.url || '');
      console.log('[AXIOS RES] ←', res.status, url, 'data=', res.data);
    }
    return res;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      disableRedirect?: boolean;
    };

    if (__DEV__) {
      const cfg = error.config as InternalAxiosRequestConfig | undefined;
      const url = (cfg?.baseURL || '') + (cfg?.url || '');

      console.log('[AXIOS ERR] ←', status, url, 'data=', error.response?.data);
    }

    // ✅ 1) refresh 제외 엔드포인트면 그대로 반환 (덮어쓰기 방지 핵심)
    if (shouldSkipRefresh(original?.url)) {
      return Promise.reject(error);
    }

    // ✅ 2) 401 + 아직 재시도 안 했으면 refresh 시도
    if (status === 401 && !original?._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waitQueue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(original));
            },
            reject: (e) => {
              // ✅ refresh 실패해도 "원래 에러"를 유지
              reject(error);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        const newAT = await refreshViaCookie();
        flushQueue(newAT);
        original.headers.Authorization = `Bearer ${newAT}`;
        return axiosInstance(original);
      } catch (e) {
        flushQueue(undefined, e);
        await clearTokens();

        if (!original.disableRedirect) {
          router.replace('/auth/login');
        }

        // ✅ refresh 실패해도 "원래 error"로 reject (덮어쓰기 방지 핵심)
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
