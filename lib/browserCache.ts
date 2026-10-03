const STORAGE_PREFIX = "aurex:cache:";
const DEFAULT_TTL_MS = 60 * 60 * 1000;

type Entry<T> = { data: T; version?: string; expiresAt: number };

const inflight = new Map<string, Promise<unknown>>();

function readEntry<T>(storageKey: string): Entry<T> | null {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Entry<T>) : null;
  } catch {
    return null;
  }
}

function writeEntry<T>(storageKey: string, entry: Entry<T>): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(entry));
  } catch {
    // empty
  }
}

function removeEntry(storageKey: string): void {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // empty
  }
}

export async function cachedInBrowser<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttlMs?: number;
    /** Cheap freshness check — if it returns something other than the
     *  cached entry's version, the cache is treated as stale even though
     *  its TTL hasn't expired yet. */
    getVersion?: () => Promise<string>;
    /** When provided, a fetched result that fails this check is never
     *  written to the cache (and any stale entry for this key is
     *  dropped) — e.g. don't let an unset value get stuck for the full
     *  TTL once a real value exists. */
    isCacheable?: (data: T) => boolean;
  } = {},
): Promise<T> {
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const storageKey = `${STORAGE_PREFIX}${key}`;
  const stored = readEntry<T>(storageKey);
  const isFresh = stored !== null && stored.expiresAt > Date.now();

  let knownVersion: string | undefined;
  if (isFresh) {
    if (!options.getVersion) return stored.data;
    try {
      knownVersion = await options.getVersion();
      if (knownVersion === stored.version) return stored.data;
    } catch {
      return stored.data;
    }
  }

  const pending = inflight.get(storageKey);
  if (pending) return pending as Promise<T>;

  const promise = (async () => {
    const data = await fetcher();
    const cacheable = options.isCacheable ? options.isCacheable(data) : true;
    if (cacheable) {
      const version = knownVersion ?? (await options.getVersion?.().catch(() => undefined));
      writeEntry(storageKey, { data, version, expiresAt: Date.now() + ttlMs });
    } else {
      removeEntry(storageKey);
    }
    return data;
  })().finally(() => {
    inflight.delete(storageKey);
  });
  inflight.set(storageKey, promise);
  return promise;
}
