interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cacheStore = new Map<string, CacheItem<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const setCache = <T>(key: string, data: T) => {
  cacheStore.set(key, { data, timestamp: Date.now() });
};

export const getCache = <T>(key: string): T | null => {
  const item = cacheStore.get(key);
  if (!item) return null;
  
  if (Date.now() - item.timestamp > CACHE_TTL) {
    cacheStore.delete(key);
    return null;
  }
  
  return item.data as T;
};

export const clearCache = (key?: string) => {
  if (key) {
    cacheStore.delete(key);
  } else {
    cacheStore.clear();
  }
};
