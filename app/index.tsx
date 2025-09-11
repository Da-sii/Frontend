// app/index.tsx
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { getAccessToken } from '../lib/authToken';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      router.replace(token ? '/home' : '/auth/login');
    })();
  }, []);

  return null;
}
