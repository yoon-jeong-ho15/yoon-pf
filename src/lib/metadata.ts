import fs from "fs";
import Path from "path";
import bundledMetadataCache from "@/cache/metadata-cache.json";
import type { LinkMetadata } from "@/types";
import {
  DEFAULT_CACHE_TTL_MS,
  SERVER_FETCH_TIMEOUT_MS,
  fetchUrlMetadata,
  resolveMetadataEntry,
} from "./metadata-extractor.js";

const CACHE_PATH = Path.join(
  process.cwd(),
  "src/cache/metadata-cache.json",
);

// Memory cache initialized with statically bundled build cache
const inMemoryCache: Record<string, LinkMetadata> = {
  ...(bundledMetadataCache as Record<string, LinkMetadata>),
};

export type GetLinkMetadataMapOptions = {
  cache?: Record<string, LinkMetadata>;
  cachePath?: string;
  persist?: boolean;
  timeoutMs?: number;
  ttlMs?: number;
  fetchFn?: typeof fetch;
  now?: () => number;
};

export type GetUrlMetadataOptions = {
  timeoutMs?: number;
  fetchFn?: typeof fetch;
  now?: () => number;
};

async function saveCache(
  cache: Record<string, LinkMetadata>,
  cachePath = CACHE_PATH,
) {
  if (process.env.NODE_ENV === "production") return;
  try {
    const dir = Path.dirname(cachePath);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(cachePath, JSON.stringify(cache, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to save metadata cache", e);
  }
}

export async function getLinkMetadataMap(
  links?: string | string[],
  options: GetLinkMetadataMapOptions = {},
): Promise<Record<string, LinkMetadata>> {
  if (!links) return {};
  const rawLinks = Array.isArray(links) ? links : [links];
  const uniqueLinks = Array.from(new Set(rawLinks.filter(Boolean)));

  const cache = options.cache ?? inMemoryCache;
  const cachePath = options.cachePath ?? CACHE_PATH;
  const timeoutMs = options.timeoutMs ?? SERVER_FETCH_TIMEOUT_MS;
  const ttlMs = options.ttlMs ?? DEFAULT_CACHE_TTL_MS;
  const fetchFn = options.fetchFn ?? globalThis.fetch;
  const now = options.now ?? Date.now;
  const shouldPersist =
    options.persist ??
    (options.cachePath !== undefined
      ? process.env.NODE_ENV !== "production"
      : process.env.NODE_ENV !== "production" &&
        process.env.NODE_ENV !== "test");

  const linkMetadataMap: Record<string, LinkMetadata> = {};
  let cacheUpdated = false;

  await Promise.all(
    uniqueLinks.map(async (url: string) => {
      const resolution = await resolveMetadataEntry(url, cache[url], {
        timeoutMs,
        ttlMs,
        fetchFn,
        now,
      });

      linkMetadataMap[url] = resolution.metadata;

      if (resolution.updated && resolution.cached) {
        cache[url] = resolution.cached;
        cacheUpdated = true;
      } else if (!resolution.ok && resolution.failure) {
        console.error(
          `Failed to fetch metadata for ${url}:`,
          resolution.failure.error,
        );
      }
    }),
  );

  if (cacheUpdated && shouldPersist) {
    await saveCache(cache, cachePath);
  }

  return linkMetadataMap;
}

export async function getUrlMetadata(
  url: string,
  options: GetUrlMetadataOptions = {},
): Promise<LinkMetadata> {
  const result = await fetchUrlMetadata(url, {
    timeoutMs: options.timeoutMs ?? SERVER_FETCH_TIMEOUT_MS,
    fetchFn: options.fetchFn ?? globalThis.fetch,
    now: options.now ?? Date.now,
  });

  if (result.ok) {
    return result.metadata;
  }

  console.error(`Failed to fetch metadata for ${url}:`, result.error);
  return { url, title: url };
}
