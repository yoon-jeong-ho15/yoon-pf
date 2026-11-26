import * as cheerio from "cheerio";

export const BUILD_FETCH_TIMEOUT_MS = 5000;
export const SERVER_FETCH_TIMEOUT_MS = 1500;
export const DEFAULT_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Resolves a potentially relative asset URL (image or icon) against the page URL.
 * Preserves http(s), protocol-relative (//), and data URIs as-is.
 */
function resolveAssetUrl(assetUrl, baseUrl) {
  if (typeof assetUrl !== "string") return undefined;
  const trimmed = assetUrl.trim();
  if (!trimmed) return undefined;

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  try {
    return new URL(trimmed, baseUrl).href;
  } catch {
    return undefined;
  }
}

/**
 * Extracts link metadata from an HTML string using the shared selector rules.
 */
export function extractMetadataFromHtml(url, html, fetchedAt = Date.now()) {
  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr("content")?.trim() ||
    $("title").text().trim() ||
    url;

  const description =
    $('meta[property="description"]').attr("content")?.trim() ||
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    $('meta[name="og:description"]').attr("content")?.trim() ||
    undefined;

  const rawImage =
    $('meta[property="image"]').attr("content") ||
    $('meta[name="image"]').attr("content") ||
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="og:image"]').attr("content");

  const rawIcon =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    $('link[rel="apple-touch-icon"]').attr("href");

  const image = resolveAssetUrl(rawImage, url);
  const icon = resolveAssetUrl(rawIcon, url);

  return {
    url,
    title,
    ...(description !== undefined ? { description } : {}),
    ...(image !== undefined ? { image } : {}),
    ...(icon !== undefined ? { icon } : {}),
    fetchedAt,
  };
}

export function isMetadataExpired(
  entry,
  now = Date.now(),
  ttlMs = DEFAULT_CACHE_TTL_MS,
) {
  if (!entry || typeof entry.fetchedAt !== "number") {
    return true;
  }
  return now - entry.fetchedAt > ttlMs;
}

/**
 * Fetches and parses metadata for a URL, distinguishing success from failure.
 */
export async function fetchUrlMetadata(url, options = {}) {
  const {
    timeoutMs = BUILD_FETCH_TIMEOUT_MS,
    fetchFn = globalThis.fetch,
    now = Date.now,
  } = options;

  if (typeof fetchFn !== "function") {
    return {
      ok: false,
      reason: "network",
      error: "Fetch implementation is not available",
    };
  }

  const controller = new AbortController();
  const timeoutError = new DOMException(
    `Metadata fetch timed out after ${timeoutMs}ms`,
    "TimeoutError",
  );
  let timedOut = false;
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort(timeoutError);
      reject(timeoutError);
    }, timeoutMs);
  });

  const performFetch = async () => {
    const res = await fetchFn(url, {
      headers: {
        "User-Agent": "Twitterbot/1.0",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      return {
        ok: false,
        reason: "http",
        status: res.status,
        error: `HTTP ${res.status}`,
      };
    }

    const html = await res.text();
    return {
      ok: true,
      metadata: extractMetadataFromHtml(url, html, now()),
    };
  };

  const fetchPromise = performFetch();
  // Prevent unhandled rejection if timeoutPromise settles first and fetch rejects later.
  fetchPromise.catch(() => {});

  try {
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    const errorName =
      error && typeof error === "object" && "name" in error
        ? String(error.name)
        : "";
    const isTimeout =
      timedOut || errorName === "TimeoutError" || errorName === "AbortError";

    return {
      ok: false,
      reason: isTimeout ? "timeout" : "network",
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Resolves metadata for a URL against an optional existing cache entry.
 * - Fresh cache hits return `kind: "cached"` without fetching.
 * - Successful fetches return `kind: "refreshed"` with the new metadata entry.
 * - Refresh failures return `kind: "stale"` preserving the last valid cached entry.
 * - Initial lookup failures return `kind: "failed"` with a URL display fallback.
 */
export async function resolveMetadataEntry(url, cachedEntry, options = {}) {
  const {
    timeoutMs = BUILD_FETCH_TIMEOUT_MS,
    ttlMs = DEFAULT_CACHE_TTL_MS,
    fetchFn = globalThis.fetch,
    now = Date.now,
  } = options;

  const currentTime = now();

  if (cachedEntry && !isMetadataExpired(cachedEntry, currentTime, ttlMs)) {
    return {
      kind: "cached",
      metadata: cachedEntry,
    };
  }

  const result = await fetchUrlMetadata(url, { timeoutMs, fetchFn, now });

  if (result.ok) {
    return {
      kind: "refreshed",
      metadata: result.metadata,
    };
  }

  if (cachedEntry) {
    return {
      kind: "stale",
      metadata: cachedEntry,
      failure: result,
    };
  }

  return {
    kind: "failed",
    metadata: { url, title: url },
    failure: result,
  };
}
