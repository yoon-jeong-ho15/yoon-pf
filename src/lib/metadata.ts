import * as cheerio from "cheerio";

export interface LinkMetadata {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export async function getUrlMetadata(url: string): Promise<LinkMetadata> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        "User-Agent": "bot", // Generic user agent to avoid some blockings
      },
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
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content");

    const image = $('meta[property="og:image"]').attr("content");

    return {
      url,
      title,
      description,
      image,
    };
  } catch (error) {
    console.error(`Failed to fetch metadata for ${url}`, error);
    return { url, title: url };
  }
}
