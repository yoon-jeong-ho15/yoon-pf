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
      headers: {
        "User-Agent": "Twitterbot/1.0",
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
      $('meta[property="description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="og:description"]').attr("content");

    let image =
      $('meta[property="image"]').attr("content") ||
      $('meta[name="image"]').attr("content") ||
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="og:image"]').attr("content");

    if (image && !image.startsWith("http") && !image.startsWith("//")) {
      try {
        image = new URL(image, url).href;
      } catch (e) {
        // Ignored if URL parsing fails
      }
    }

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
