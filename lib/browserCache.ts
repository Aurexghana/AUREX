const STORAGE_PREFIX = "aurex:cache:";
const DEFAULT_TTL_MS = 60 * 60 * 1000;

type Entry<T> = { data: T; expiresAt: number };

const inflight = new Map<string, Promise<unknown>>();

export async function cachedInBrowser<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS,
): Promise<T> {
  const storageKey = `${STORAGE_PREFIX}${key}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const entry = JSON.parse(raw) as Entry<T>;
      if (entry.expiresAt > Date.now()) return entry.data;
    }
  } catch {
    // empty
  }

  const pending = inflight.get(storageKey);
  if (pending) return pending as Promise<T>;

  const promise = fetcher()
    .then((data) => {
      try {
        const entry: Entry<T> = { data, expiresAt: Date.now() + ttlMs };
        localStorage.setItem(storageKey, JSON.stringify(entry));
      } catch {
        // empty
      }
      return data;
    })
    .finally(() => {
      inflight.delete(storageKey);
    });
  inflight.set(storageKey, promise);
  return promise;
}
