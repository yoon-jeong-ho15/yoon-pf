import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import {
  BUILD_FETCH_TIMEOUT_MS,
  DEFAULT_CACHE_TTL_MS,
  isMetadataExpired,
  resolveMetadataEntry,
} from "../src/lib/metadata-extractor.js";

const MD_DIR = path.join(process.cwd(), "md");
const DATA_DIR = path.join(process.cwd(), "src/cache");
const NEW_CACHE_PATH = path.join(DATA_DIR, "metadata-cache.json");
const LEGACY_CACHE_PATH = path.join(process.cwd(), ".cache/metadata-cache.json");
const OLD_CACHE_PATH = path.join(
  process.cwd(),
  "src/features/(markdown)/lib/metadata-cache.json",
);

// Helper to filter out hidden or template files/folders
const isValidPath = (name) => !name.startsWith(".") && !name.startsWith("_");

// Recursive markdown scanner
export function scanMarkdownFiles(dir, allLinks = new Set()) {
  if (!fs.existsSync(dir)) return allLinks;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!isValidPath(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanMarkdownFiles(fullPath, allLinks);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      try {
        const fileContent = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContent);
        const links = data.link;

        if (typeof links === "string" && links.trim()) {
          allLinks.add(links.trim());
        } else if (Array.isArray(links)) {
          links.forEach((l) => {
            if (typeof l === "string" && l.trim()) {
              allLinks.add(l.trim());
            }
          });
        }
      } catch (err) {
        console.error(`[Prefetch] Failed to parse frontmatter for ${fullPath}:`, err.message);
      }
    }
  }

  return allLinks;
}

function loadExistingCache(cachePath, legacyCachePath, oldCachePath) {
  if (fs.existsSync(cachePath)) {
    console.log(`[Prefetch] Loading existing cache from ${cachePath}`);
    return JSON.parse(fs.readFileSync(cachePath, "utf8"));
  }
  if (legacyCachePath && fs.existsSync(legacyCachePath)) {
    console.log(`[Prefetch] Migrating cache from legacy cache: ${legacyCachePath}`);
    return JSON.parse(fs.readFileSync(legacyCachePath, "utf8"));
  }
  if (oldCachePath && fs.existsSync(oldCachePath)) {
    console.log(`[Prefetch] Migrating cache from committed src cache: ${oldCachePath}`);
    return JSON.parse(fs.readFileSync(oldCachePath, "utf8"));
  }
  return {};
}

export async function prefetchMetadata({
  mdDir = MD_DIR,
  cachePath = NEW_CACHE_PATH,
  legacyCachePath = LEGACY_CACHE_PATH,
  oldCachePath = OLD_CACHE_PATH,
  ttlMs = DEFAULT_CACHE_TTL_MS,
  timeoutMs = BUILD_FETCH_TIMEOUT_MS,
  fetchFn = globalThis.fetch,
  now = Date.now,
} = {}) {
  console.log("[Prefetch] Scanning markdown files for external links...");
  const allLinks = scanMarkdownFiles(mdDir);
  console.log(`[Prefetch] Found ${allLinks.size} unique links.`);

  // 1. Load existing cache
  const cache = loadExistingCache(cachePath, legacyCachePath, oldCachePath);

  // 2. Resolve missing or expired metadata
  let updatedCount = 0;
  let failedCount = 0;

  for (const url of allLinks) {
    const cachedData = cache[url];
    const expired = isMetadataExpired(cachedData, now(), ttlMs);

    if (!cachedData || expired) {
      if (expired && cachedData) {
        console.log(`[Prefetch] Cache expired: Refetching metadata for ${url}`);
      } else {
        console.log(`[Prefetch] Cache miss: Fetching metadata for ${url}`);
      }

      const resolution = await resolveMetadataEntry(url, cachedData, {
        timeoutMs,
        ttlMs,
        fetchFn,
        now,
      });

      switch (resolution.kind) {
        case "cached":
          break;
        case "refreshed":
          cache[url] = resolution.metadata;
          updatedCount++;
          break;
        case "stale":
        case "failed":
          failedCount++;
          console.error(
            `[Prefetch] Failed to fetch metadata for ${url}:`,
            resolution.failure.error,
          );
          break;
      }
    }
  }

  console.log(`[Prefetch] Completed. ${updatedCount} links updated.`);

  // 3. Save new cache
  const cacheDir = path.dirname(cachePath);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf8");
  console.log(`[Prefetch] Cache successfully saved to ${cachePath}`);

  return { cache, updatedCount, failedCount, totalLinks: allLinks.size };
}

const isDirectExecution = (() => {
  if (!process.argv[1]) return false;
  try {
    return (
      fs.realpathSync(process.argv[1]) ===
      fs.realpathSync(fileURLToPath(import.meta.url))
    );
  } catch {
    return path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
  }
})();

if (isDirectExecution) {
  prefetchMetadata().catch((err) => {
    console.error("[Prefetch] Fatal error during prefetch:", err);
    process.exit(1);
  });
}
