import * as cheerio from "cheerio";
import type { LinkMetadata } from "@/types";

export async function getLinkMetadataMap(
  frontmatter: Record<string, any>,
): Promise<Record<string, LinkMetadata>> {
  const links = frontmatter.link || [];
  if (!Array.isArray(links)) return {};

  const linkMetadataMap: Record<string, LinkMetadata> = {};
  await Promise.all(
    links.map(async (url: string) => {
      linkMetadataMap[url] = await getUrlMetadata(url);
    }),
  );
  return linkMetadataMap;
}

export async function getUrlMetadata(url: string): Promise<LinkMetadata> {
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
    console.error(`Failed to fetch metadata for ${url}`, error);
    return { url, title: url };
  }
}
