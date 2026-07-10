import fs from "fs";
import path from "path";
import matter from "gray-matter";
import * as cheerio from "cheerio";

const MD_DIR = path.join(process.cwd(), "md");
const CACHE_DIR = path.join(process.cwd(), ".cache");
const NEW_CACHE_PATH = path.join(CACHE_DIR, "metadata-cache.json");
const OLD_CACHE_PATH = path.join(
  process.cwd(),
  "src/features/(markdown)/lib/metadata-cache.json",
);

// Helper to filter out hidden or template files/folders
const isValidPath = (name) => !name.startsWith(".") && !name.startsWith("_");

// Recursive markdown scanner
function scanMarkdownFiles(dir, allLinks = new Set()) {
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

        if (typeof links === "string") {
          allLinks.add(links.trim());
        } else if (Array.isArray(links)) {
          links.forEach((l) => {
            if (typeof l === "string") {
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

// Fetch helper from src/features/(markdown)/lib/metadata.ts
async function getUrlMetadata(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Twitterbot/1.0",
      },
      signal: AbortSignal.timeout(5000),
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
    };
  } catch (error) {
    console.error(`[Prefetch] Failed to fetch metadata for ${url}:`, error.message);
    return { url, title: url };
  }
}

async function main() {
  console.log("[Prefetch] Scanning markdown files for external links...");
  const allLinks = scanMarkdownFiles(MD_DIR);
  console.log(`[Prefetch] Found ${allLinks.size} unique links.`);

  // 1. Load existing cache
  let cache = {};
  if (fs.existsSync(NEW_CACHE_PATH)) {
    console.log(`[Prefetch] Loading existing cache from ${NEW_CACHE_PATH}`);
    cache = JSON.parse(fs.readFileSync(NEW_CACHE_PATH, "utf8"));
  } else if (fs.existsSync(OLD_CACHE_PATH)) {
    console.log(`[Prefetch] Migrating cache from committed src cache: ${OLD_CACHE_PATH}`);
    cache = JSON.parse(fs.readFileSync(OLD_CACHE_PATH, "utf8"));
  }

  // 2. Resolve missing metadata
  let updatedCount = 0;
  for (const url of allLinks) {
    if (!cache[url]) {
      console.log(`[Prefetch] Cache miss: Fetching metadata for ${url}`);
      cache[url] = await getUrlMetadata(url);
      updatedCount++;
    }
  }

  console.log(`[Prefetch] Completed. ${updatedCount} links updated.`);

  // 3. Save new cache
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
  fs.writeFileSync(NEW_CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
  console.log(`[Prefetch] Cache successfully saved to ${NEW_CACHE_PATH}`);
}

main().catch((err) => {
  console.error("[Prefetch] Fatal error during prefetch:", err);
  process.exit(1);
});
