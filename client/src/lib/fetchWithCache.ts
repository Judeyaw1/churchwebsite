const cache = new Map<
  string,
  { timestamp: number; data: unknown; ttl: number }
>();

interface CachedRequestInit extends RequestInit {
  ttl?: number;
  cacheKey?: string;
}

const DEFAULT_TTL = 1000 * 60 * 5; // 5 minutes

export async function fetchWithCache<T>(
  url: string,
  options: CachedRequestInit = {},
): Promise<T> {
  const { ttl = DEFAULT_TTL, cacheKey, method = "GET" } = options;
  const key = cacheKey ?? `${method}:${url}`;

  if (method.toUpperCase() !== "GET") {
    return fetch(url, options).then((res) => res.json());
  }

  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data as T;
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  const data = (await response.json()) as T;
  cache.set(key, { timestamp: Date.now(), data, ttl });
  return data;
}

export function invalidateCache(keyPrefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(keyPrefix)) {
      cache.delete(key);
    }
  }
}
