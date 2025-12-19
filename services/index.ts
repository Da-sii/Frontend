import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { clearTokens, getAccessToken, setTokens } from '../lib/authToken';

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// ---- 요청 로깅 + accessToken 주입
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await getAccessToken();
    if (__DEV__) {
      const url = (config.baseURL || '') + (config.url || '');
      // console.log('[AXIOS] →', url, 'params=', config.params);
    }

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

axiosInstance.interceptors.response.use(
  (res) => {
    if (__DEV__) {
      const url = (res.config.baseURL || '') + (res.config.url || '');
      console.log(
        '[AXIOS RES] ←',
        res.status,
        url,
        'params=',
        res.config.params,
        'data=',
        res.data,
      );
    }
    return res;
  },
  (err) => {
    if (__DEV__) {
      const cfg = err.config || {};
      const url = (cfg.baseURL || '') + (cfg.url || '');
      console.log(
        '[AXIOS ERR] ←',
        err.response?.status,
        url,
        'params=',
        cfg.params,
        'data=',
        err.response?.data,
      );
    }
    return Promise.reject(err);
  },
);

axiosInstance.interceptors.response.use(
  (res) => {
    if (__DEV__) console.log('[AXIOS] ←', res.config.url, res.status);
    return res;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      disableRedirect?: boolean;
    };

    if (status === 401 && !original?._retry) {
      // if (!original?._retry) {
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
