import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { LinkMetadata } from "@/types";
import {
  BUILD_FETCH_TIMEOUT_MS,
  DEFAULT_CACHE_TTL_MS,
  SERVER_FETCH_TIMEOUT_MS,
  extractMetadataFromHtml,
  fetchUrlMetadata,
  resolveMetadataEntry,
} from "./metadata-extractor.js";
import { getLinkMetadataMap, getUrlMetadata } from "./metadata";
import { prefetchMetadata } from "../../scripts/prefetch-metadata.js";

const FIXTURE_URL = "https://example.com/posts/hello-world";
const FIXTURE_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Fallback HTML Title</title>
    <meta property="og:title" content="  Fixture OG Title  " />
    <meta name="description" content="Fixture page description" />
    <meta property="og:image" content="/images/cover.png" />
    <link rel="icon" href="/favicon.ico" />
  </head>
  <body></body>
</html>`;

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "metadata-test-"));
});

afterEach(async () => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  await rm(tempDir, { recursive: true, force: true });
});

describe("metadata extraction and caching", () => {
  test("extracts normal metadata from fixed HTML consistently across server and build prefetch", async () => {
    const fixedNow = 1_795_000_000_000;
    const seenHeaders: Array<HeadersInit | undefined> = [];
    const mockFetch: typeof fetch = vi.fn(async (_input, init) => {
      seenHeaders.push(init?.headers);
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return new Response(FIXTURE_HTML, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    });

    const directExtracted = extractMetadataFromHtml(
      FIXTURE_URL,
      FIXTURE_HTML,
      fixedNow,
    );

    expect(directExtracted).toEqual({
      url: FIXTURE_URL,
      title: "Fixture OG Title",
      description: "Fixture page description",
      image: "https://example.com/images/cover.png",
      icon: "https://example.com/favicon.ico",
      fetchedAt: fixedNow,
    });

    const serverCache: Record<string, LinkMetadata> = {};
    const serverCachePath = join(tempDir, "server-cache.json");
    const serverMap = await getLinkMetadataMap([FIXTURE_URL], {
      cache: serverCache,
      cachePath: serverCachePath,
      fetchFn: mockFetch,
      now: () => fixedNow,
    });

    const mdDir = join(tempDir, "md", "blogs");
    await mkdir(mdDir, { recursive: true });
    await writeFile(
      join(mdDir, "sample.md"),
      `---\ntitle: Sample\nlink:\n  - ${FIXTURE_URL}\n---\nBody\n`,
      "utf8",
    );

    const buildCachePath = join(tempDir, "build-cache.json");
    const prefetchResult = await prefetchMetadata({
      mdDir: join(tempDir, "md"),
      cachePath: buildCachePath,
      legacyCachePath: join(tempDir, "missing-legacy.json"),
      oldCachePath: join(tempDir, "missing-old.json"),
      fetchFn: mockFetch,
      now: () => fixedNow,
    });

    expect(serverMap[FIXTURE_URL]).toEqual(directExtracted);
    expect(prefetchResult.cache[FIXTURE_URL]).toEqual(directExtracted);
    expect(prefetchResult.updatedCount).toBe(1);

    const persistedServerCache = JSON.parse(
      await readFile(serverCachePath, "utf8"),
    );
    const persistedBuildCache = JSON.parse(
      await readFile(buildCachePath, "utf8"),
    );
    expect(persistedServerCache).toEqual({ [FIXTURE_URL]: directExtracted });
    expect(persistedBuildCache).toEqual({ [FIXTURE_URL]: directExtracted });
    expect(seenHeaders).toEqual([
      { "User-Agent": "Twitterbot/1.0" },
      { "User-Agent": "Twitterbot/1.0" },
    ]);
  });

  test("handles HTTP errors by distinguishing failure, displaying URL on initial miss, and retrying next time", async () => {
    let attempt = 0;
    const fixedNow = 1_795_000_100_000;
    const mockFetch: typeof fetch = vi.fn(async () => {
      attempt++;
      if (attempt === 1) {
        return new Response("Internal Server Error", { status: 500 });
      }
      return new Response(FIXTURE_HTML, { status: 200 });
    });

    const fetchFailure = await fetchUrlMetadata(FIXTURE_URL, {
      fetchFn: mockFetch,
      now: () => fixedNow,
    });
    expect(fetchFailure).toEqual({
      ok: false,
      reason: "http",
      status: 500,
      error: "HTTP 500",
    });

    // Reset attempt to test server initial lookup failure followed by retry
    attempt = 0;
    const serverCache: Record<string, LinkMetadata> = {};
    const serverCachePath = join(tempDir, "http-retry-server.json");

    const firstMap = await getLinkMetadataMap(FIXTURE_URL, {
      cache: serverCache,
      cachePath: serverCachePath,
      fetchFn: mockFetch,
      now: () => fixedNow,
    });

    // Displays URL on screen, but does not cache failed initial lookup
    expect(firstMap[FIXTURE_URL]).toEqual({
      url: FIXTURE_URL,
      title: FIXTURE_URL,
    });
    expect(serverCache[FIXTURE_URL]).toBeUndefined();
    await expect(readFile(serverCachePath, "utf8")).rejects.toThrow();

    // Next lookup retries and succeeds
    const secondMap = await getLinkMetadataMap(FIXTURE_URL, {
      cache: serverCache,
      cachePath: serverCachePath,
      fetchFn: mockFetch,
      now: () => fixedNow + 1000,
    });

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(secondMap[FIXTURE_URL]).toMatchObject({
      url: FIXTURE_URL,
      title: "Fixture OG Title",
      description: "Fixture page description",
      fetchedAt: fixedNow + 1000,
    });
    expect(serverCache[FIXTURE_URL]).toEqual(secondMap[FIXTURE_URL]);
  });

  test("preserves last valid metadata and success timestamp when refresh fails with HTTP error", async () => {
    const previousSuccessAt = 1_795_000_000_000;
    const currentNow = previousSuccessAt + DEFAULT_CACHE_TTL_MS + 60_000;
    const lastValidEntry: LinkMetadata = {
      url: FIXTURE_URL,
      title: "Previously Cached Title",
      description: "Previously Cached Description",
      image: "https://example.com/old-image.png",
      icon: "https://example.com/old-icon.ico",
      fetchedAt: previousSuccessAt,
    };

    const failingFetch: typeof fetch = vi.fn(
      async () => new Response("Service Unavailable", { status: 503 }),
    );

    // Server refresh failure preserves last valid entry & timestamp
    const serverCache: Record<string, LinkMetadata> = {
      [FIXTURE_URL]: { ...lastValidEntry },
    };
    const serverMap = await getLinkMetadataMap([FIXTURE_URL], {
      cache: serverCache,
      persist: false,
      fetchFn: failingFetch,
      now: () => currentNow,
    });

    expect(serverMap[FIXTURE_URL]).toEqual(lastValidEntry);
    expect(serverCache[FIXTURE_URL]).toEqual(lastValidEntry);

    // Build prefetch refresh failure preserves last valid entry & timestamp in cache JSON
    const mdDir = join(tempDir, "md", "blogs");
    await mkdir(mdDir, { recursive: true });
    await writeFile(
      join(mdDir, "sample.md"),
      `---\ntitle: Sample\nlink: ${FIXTURE_URL}\n---\n`,
      "utf8",
    );
    const buildCachePath = join(tempDir, "prefetch-preserve.json");
    await writeFile(
      buildCachePath,
      JSON.stringify({ [FIXTURE_URL]: lastValidEntry }, null, 2),
      "utf8",
    );

    const prefetchResult = await prefetchMetadata({
      mdDir: join(tempDir, "md"),
      cachePath: buildCachePath,
      legacyCachePath: join(tempDir, "none1.json"),
      oldCachePath: join(tempDir, "none2.json"),
      fetchFn: failingFetch,
      now: () => currentNow,
    });

    expect(prefetchResult.updatedCount).toBe(0);
    expect(prefetchResult.failedCount).toBe(1);
    expect(prefetchResult.cache[FIXTURE_URL]).toEqual(lastValidEntry);

    const persisted = JSON.parse(await readFile(buildCachePath, "utf8"));
    expect(persisted[FIXTURE_URL]).toEqual(lastValidEntry);
  });

  test("times out at 1.5s on server and retries successfully on the next lookup", async () => {
    vi.useFakeTimers();
    const baseTime = 1_795_100_000_000;
    vi.setSystemTime(baseTime);

    let attempt = 0;
    let observedAbort = false;
    const mockFetch: typeof fetch = vi.fn((_input, init) => {
      attempt++;
      if (attempt === 1) {
        return new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            observedAbort = true;
            reject(init.signal?.reason ?? new DOMException("Aborted", "AbortError"));
          });
        });
      }
      return Promise.resolve(new Response(FIXTURE_HTML, { status: 200 }));
    });

    const serverCache: Record<string, LinkMetadata> = {};
    const serverCachePath = join(tempDir, "timeout-server-cache.json");

    // 1. Initial lookup times out after SERVER_FETCH_TIMEOUT_MS (1500ms)
    const firstPromise = getLinkMetadataMap([FIXTURE_URL], {
      cache: serverCache,
      cachePath: serverCachePath,
      fetchFn: mockFetch,
    });

    await vi.advanceTimersByTimeAsync(SERVER_FETCH_TIMEOUT_MS - 1);
    expect(observedAbort).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    const firstMap = await firstPromise;

    expect(observedAbort).toBe(true);
    expect(firstMap[FIXTURE_URL]).toEqual({
      url: FIXTURE_URL,
      title: FIXTURE_URL,
    });
    expect(serverCache[FIXTURE_URL]).toBeUndefined();

    // 2. Retry succeeds and populates cache
    const retryTime = baseTime + 5000;
    vi.setSystemTime(retryTime);
    const secondMap = await getLinkMetadataMap([FIXTURE_URL], {
      cache: serverCache,
      cachePath: serverCachePath,
      fetchFn: mockFetch,
    });

    expect(attempt).toBe(2);
    expect(secondMap[FIXTURE_URL]).toEqual({
      url: FIXTURE_URL,
      title: "Fixture OG Title",
      description: "Fixture page description",
      image: "https://example.com/images/cover.png",
      icon: "https://example.com/favicon.ico",
      fetchedAt: retryTime,
    });

    // 3. Subsequent lookup hits cache without calling fetch again
    const thirdMap = await getLinkMetadataMap([FIXTURE_URL], {
      cache: serverCache,
      cachePath: serverCachePath,
      fetchFn: mockFetch,
    });
    expect(attempt).toBe(2);
    expect(thirdMap[FIXTURE_URL]).toEqual(secondMap[FIXTURE_URL]);
  });

  test("times out at 5s in build prefetch, preserves valid cache or skips failed initial lookup, and retries", async () => {
    vi.useFakeTimers();
    const baseTime = 1_795_200_000_000;
    vi.setSystemTime(baseTime);

    const existingUrl = "https://example.com/existing";
    const newUrl = "https://example.com/new";
    const expiredSuccessAt = baseTime - DEFAULT_CACHE_TTL_MS - 1000;
    const existingEntry: LinkMetadata = {
      url: existingUrl,
      title: "Existing Valid Title",
      description: "Existing description",
      fetchedAt: expiredSuccessAt,
    };

    const mdDir = join(tempDir, "md", "blogs");
    await mkdir(mdDir, { recursive: true });
    await writeFile(
      join(mdDir, "links.md"),
      `---\ntitle: Links\nlink:\n  - ${existingUrl}\n  - ${newUrl}\n---\n`,
      "utf8",
    );

    const buildCachePath = join(tempDir, "build-timeout-cache.json");
    await writeFile(
      buildCachePath,
      JSON.stringify({ [existingUrl]: existingEntry }, null, 2),
      "utf8",
    );

    let phase = 1;
    const timeoutEvents: string[] = [];
    const mockFetch: typeof fetch = vi.fn((input, init) => {
      const targetUrl = String(input);
      if (phase === 1) {
        return new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            timeoutEvents.push(targetUrl);
            reject(init.signal?.reason ?? new DOMException("Timeout", "TimeoutError"));
          });
        });
      }

      const title =
        targetUrl === existingUrl ? "Refreshed Existing Title" : "Fetched New Title";
      return Promise.resolve(
        new Response(`<html><head><title>${title}</title></head></html>`, {
          status: 200,
        }),
      );
    });

    // Run 1: both links time out after BUILD_FETCH_TIMEOUT_MS (5000ms) each
    const firstRunPromise = prefetchMetadata({
      mdDir: join(tempDir, "md"),
      cachePath: buildCachePath,
      legacyCachePath: join(tempDir, "none1.json"),
      oldCachePath: join(tempDir, "none2.json"),
      fetchFn: mockFetch,
    });

    await vi.advanceTimersByTimeAsync(BUILD_FETCH_TIMEOUT_MS - 1);
    expect(timeoutEvents).toHaveLength(0);

    await vi.advanceTimersByTimeAsync(1);
    expect(timeoutEvents).toEqual([existingUrl]);

    await vi.advanceTimersByTimeAsync(BUILD_FETCH_TIMEOUT_MS);
    const firstRun = await firstRunPromise;

    expect(timeoutEvents).toEqual([existingUrl, newUrl]);
    expect(firstRun.updatedCount).toBe(0);
    expect(firstRun.failedCount).toBe(2);
    expect(firstRun.cache[existingUrl]).toEqual(existingEntry);
    expect(firstRun.cache[newUrl]).toBeUndefined();

    // Run 2: retry succeeds for both links
    phase = 2;
    const retryTime = baseTime + 20_000;
    vi.setSystemTime(retryTime);
    const secondRun = await prefetchMetadata({
      mdDir: join(tempDir, "md"),
      cachePath: buildCachePath,
      legacyCachePath: join(tempDir, "none1.json"),
      oldCachePath: join(tempDir, "none2.json"),
      fetchFn: mockFetch,
    });

    expect(secondRun.updatedCount).toBe(2);
    expect(secondRun.failedCount).toBe(0);
    expect(secondRun.cache[existingUrl]).toEqual({
      url: existingUrl,
      title: "Refreshed Existing Title",
      fetchedAt: retryTime,
    });
    expect(secondRun.cache[newUrl]).toEqual({
      url: newUrl,
      title: "Fetched New Title",
      fetchedAt: retryTime,
    });
  });

  test("getUrlMetadata returns URL fallback on failure without crashing", async () => {
    const failingFetch: typeof fetch = vi.fn(async () => {
      throw new Error("Network unreachable");
    });

    const result = await getUrlMetadata(FIXTURE_URL, {
      fetchFn: failingFetch,
    });

    expect(result).toEqual({
      url: FIXTURE_URL,
      title: FIXTURE_URL,
    });
  });

  test("resolveMetadataEntry returns discriminated union results for cached, refreshed, stale, and failed outcomes", async () => {
    const baseNow = 1_795_300_000_000;
    const validEntry: LinkMetadata = {
      url: FIXTURE_URL,
      title: "Valid Cached Title",
      fetchedAt: baseNow,
    };

    // 1. Fresh cache hit -> kind: "cached" without fetching
    const unusedFetch: typeof fetch = vi.fn();
    const cachedResult = await resolveMetadataEntry(FIXTURE_URL, validEntry, {
      fetchFn: unusedFetch,
      now: () => baseNow + 1000,
    });
    expect(unusedFetch).not.toHaveBeenCalled();
    expect(cachedResult).toEqual({
      kind: "cached",
      metadata: validEntry,
    });

    // 2. Initial miss or expired cache with successful fetch -> kind: "refreshed"
    const successFetch: typeof fetch = vi.fn(
      async () => new Response(FIXTURE_HTML, { status: 200 }),
    );
    const refreshedResult = await resolveMetadataEntry(FIXTURE_URL, undefined, {
      fetchFn: successFetch,
      now: () => baseNow + 2000,
    });
    expect(refreshedResult).toEqual({
      kind: "refreshed",
      metadata: {
        url: FIXTURE_URL,
        title: "Fixture OG Title",
        description: "Fixture page description",
        image: "https://example.com/images/cover.png",
        icon: "https://example.com/favicon.ico",
        fetchedAt: baseNow + 2000,
      },
    });

    // 3. Expired cache with failed refresh -> kind: "stale" preserving cached entry
    const failingFetch: typeof fetch = vi.fn(
      async () => new Response("Bad Gateway", { status: 502 }),
    );
    const staleResult = await resolveMetadataEntry(FIXTURE_URL, validEntry, {
      fetchFn: failingFetch,
      now: () => baseNow + DEFAULT_CACHE_TTL_MS + 1,
    });
    expect(staleResult).toEqual({
      kind: "stale",
      metadata: validEntry,
      failure: {
        ok: false,
        reason: "http",
        status: 502,
        error: "HTTP 502",
      },
    });

    // 4. Initial lookup failure -> kind: "failed" with URL fallback
    const failedResult = await resolveMetadataEntry(FIXTURE_URL, undefined, {
      fetchFn: failingFetch,
      now: () => baseNow + 3000,
    });
    expect(failedResult).toEqual({
      kind: "failed",
      metadata: { url: FIXTURE_URL, title: FIXTURE_URL },
      failure: {
        ok: false,
        reason: "http",
        status: 502,
        error: "HTTP 502",
      },
    });
  });
});
