"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

export interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc = "/empty.png",
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
