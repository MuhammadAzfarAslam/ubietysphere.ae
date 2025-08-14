"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const NextImage = ({
  src = `/no-image.png`,
  width,
  height,
  alt = "",
  priority = false,
  testid = "",
  fallbackSrc = `${process.env.NEXT_PUBLIC_PLACE_HOLDER_IMG}`,
  fill = false,
  decoding = "async",
  objectFit = "contain",
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [fallbackLoaded, setFallbackLoaded] = useState(false);

  const handleImageError = () => {
    if (!fallbackLoaded) {
      setImageSrc(fallbackSrc);
      setFallbackLoaded(true);
    }
  };

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        // priority={priority}
        data-testid={testid}
        onError={handleImageError}
        fill
        sizes="100vw"
        decoding={decoding}
        fetchPriority={priority ? "high" : "low"}
        loading={priority ? "eager" : "lazy"} // {lazy} | {eager}
        objectFit={objectFit}
        {...props}
      />
    );
  }
  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      // priority={priority}
      data-testid={testid}
      onError={handleImageError}
      sizes="100vw"
      decoding={decoding}
      fetchPriority={priority ? "high" : "low"}
      loading={priority ? "eager" : "lazy"} // {lazy} | {eager}
      {...props}
    />
  );
};

export default NextImage;
