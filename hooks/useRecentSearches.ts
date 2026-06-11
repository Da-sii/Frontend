import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const KEY = '@recent_searches';
const MAX = 10;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => v && setRecentSearches(JSON.parse(v)))
      .catch(console.error);
  }, []);

  const save = (searches: string[]) => {
    setRecentSearches(searches);
    AsyncStorage.setItem(KEY, JSON.stringify(searches)).catch(console.error);
  };

  const add = (term: string) => {
    if (!term.trim()) return;
    save([term, ...recentSearches.filter((s) => s !== term)].slice(0, MAX));
  };

  const remove = (term: string) =>
    save(recentSearches.filter((s) => s !== term));

  const clear = () => {
    setRecentSearches([]);
    AsyncStorage.removeItem(KEY).catch(console.error);
  };

  return { recentSearches, add, remove, clear };
}
