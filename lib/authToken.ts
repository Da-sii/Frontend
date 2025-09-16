// 토큰 관리 유틸
import * as SecureStore from 'expo-secure-store';
import { KEYS } from '../constants/storage';

// 인터셉터가 요청마다 SecureStore I/O를 하지 않고, 앱 실행 이후에는 메모리에서 바로 가져오기 위한 메모리 캐시
let memAT: string | null = null;
let memRT: string | null = null;

export async function getAccessToken() {
  if (memAT !== null) return memAT;
  memAT = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  return memAT;
}

export async function setAccessToken(token: string) {
  memAT = token;
  return SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
}

export async function getRefreshToken() {
  if (memRT !== null) return memRT;
  memRT = await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  return memRT;
}

export async function setTokens(at: string, rt?: string) {
  memAT = at;
  await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, at);
  // if (rt) {
  //   memRT = rt;
  //   await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, rt);
  // }
}

export async function clearTokens() {
  memAT = null;
  memRT = null;
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
    SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
  ]);
}
