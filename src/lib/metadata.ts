import * as cheerio from "cheerio";
import type { LinkMetadata } from "@/types";
import fs from "fs";
import Path from "path";
import bundledMetadataCache from "@/cache/metadata-cache.json";

const CACHE_PATH = Path.join(
  process.cwd(),
  "src/cache/metadata-cache.json",
);

// Memory cache initialized with statically bundled build cache
const inMemoryCache: Record<string, LinkMetadata> = {
  ...(bundledMetadataCache as Record<string, LinkMetadata>),
};

async function saveCache(cache: Record<string, LinkMetadata>) {
  if (process.env.NODE_ENV === "production") return;
  try {
    const dir = Path.dirname(CACHE_PATH);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to save metadata cache", e);
  }
}

export async function getLinkMetadataMap(
  links?: string | string[],
): Promise<Record<string, LinkMetadata>> {
  if (!links) return {};
  const linksArray = Array.isArray(links) ? links : [links];

  const linkMetadataMap: Record<string, LinkMetadata> = {};
  let cacheUpdated = false;

  await Promise.all(
    linksArray.map(async (url: string) => {
      if (inMemoryCache[url]) {
        linkMetadataMap[url] = inMemoryCache[url];
      } else {
        const metadata = await getUrlMetadata(url);
        linkMetadataMap[url] = metadata;
        inMemoryCache[url] = metadata;
        cacheUpdated = true;
      }
    }),
  );

  if (cacheUpdated) {
    await saveCache(inMemoryCache);
  }

  return linkMetadataMap;
}

export async function getUrlMetadata(url: string): Promise<LinkMetadata> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Twitterbot/1.0",
      },
      signal: AbortSignal.timeout(1500),
    });

    if (!res.ok) {
      return { url, title: url };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      url;

    const description =
      $('meta[property="description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="og:description"]').attr("content");

    let image =
      $('meta[property="image"]').attr("content") ||
      $('meta[name="image"]').attr("content") ||
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="og:image"]').attr("content");

    let icon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon"]').attr("href");

    if (image && !image.startsWith("http") && !image.startsWith("//")) {
      image = new URL(image, url).href;
    }

    if (icon && !icon.startsWith("http") && !icon.startsWith("//")) {
      icon = new URL(icon, url).href;
    }

    return {
      url,
      title,
      description,
      image,
      icon,
      fetchedAt: Date.now(),
    };
  } catch (error) {
    console.error(`Failed to fetch metadata for ${url}`, error);
    return { url, title: url, fetchedAt: Date.now() };
  }
}
