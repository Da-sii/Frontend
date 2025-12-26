// app/oauth.tsx
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function OAuth() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);

  return null;
}
