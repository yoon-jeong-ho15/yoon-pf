"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

export interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  fileName: string;
  type: "thumbnail" | "item";
  fallbackSrc?: string;
}

function getSources(
  fileName: string,
  type: "thumbnail" | "item",
  fallbackSrc: string,
) {
  const extensions = [".jpg", ".webp", ".png", ".jpeg", ".gif"];
  const dirs =
    type === "thumbnail" ? ["thumbnails", "item"] : ["item", "thumbnails"];
  const sources: string[] = [];
  for (const dir of dirs) {
    for (const ext of extensions) {
      sources.push(`/${dir}/${fileName}${ext}`);
    }
  }
  sources.push(fallbackSrc);
  return sources;
}

export default function ImageWithFallback({
  fileName,
  type,
  fallbackSrc = "/s.jpg",
  alt,
  className,
  ...props
}: ImageWithFallbackProps) {
  // Re-generate list only when type or fileName changes
  const sources = React.useMemo(
    () => getSources(fileName, type, fallbackSrc),
    [fileName, type, fallbackSrc],
  );
  const [srcIndex, setSrcIndex] = useState(0);

  // Reset index if the target file info changes
  useEffect(() => {
    setSrcIndex(0);
  }, [fileName, type]);

  const handleError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    }
  };

  return (
    <Image
      src={sources[srcIndex]}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
}
