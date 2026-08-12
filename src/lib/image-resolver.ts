import fs from "fs";
import Path from "path";

let imageCachePromise: Promise<{ thumbnails: Set<string>; item: Set<string> }> | null = null;

async function getImageCache() {
  if (!imageCachePromise) {
    imageCachePromise = (async () => {
      const readDirSet = async (dirName: string) => {
        try {
          const files = await fs.promises.readdir(Path.join(process.cwd(), "public", dirName));
          return new Set(files);
        } catch {
          return new Set<string>();
        }
      };

      const [thumbnails, item] = await Promise.all([
        readDirSet("thumbnails"),
        readDirSet("item"),
      ]);

      return { thumbnails, item };
    })();
  }
  return imageCachePromise;
}

export async function resolveThumbnail(
  fileName: string,
  priority: "thumbnail" | "item",
): Promise<string> {
  const cache = await getImageCache();
  const extensions = [".jpg", ".webp", ".png", ".jpeg", ".gif"];
  const checkList =
    priority === "thumbnail"
      ? [
          { dir: "thumbnails", set: cache.thumbnails },
          { dir: "item", set: cache.item },
        ]
      : [
          { dir: "item", set: cache.item },
          { dir: "thumbnails", set: cache.thumbnails },
        ];

  for (const { dir, set } of checkList) {
    for (const ext of extensions) {
      const targetFileName = `${fileName}${ext}`;
      if (set.has(targetFileName)) {
        return `/${dir}/${targetFileName}`;
      }
    }
  }
  return "/empty.png";
}
