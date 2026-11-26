"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { DEFAULT_IMAGE_FALLBACK } from "@/lib/image-fallback";

export interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc = DEFAULT_IMAGE_FALLBACK,
  alt,
  className,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<ImageProps["src"]>(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    onError?.(event);
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
}
