"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "avif",
  "apng",
  "svg",
  "bmp",
  "tiff",
  "tif",
  "ico",
  "heic",
  "heif",
];

function getFileExtension(url) {
  return url.split(".").pop().split(/\#|\?/)[0];
}

const page = () => {
  const searchParams = useSearchParams();

  const url = searchParams.get("url"); // ?id=123 → "123"
  const type = getFileExtension(url);
  return (
    <div className="text-center">
      {imageExtensions?.includes(type) && (
        <img src={`https://cms.ubietysphere.ae/${url}`} />
      )}

      {type === "pdf" && (
        <iframe
          src={`https://cms.ubietysphere.ae/${url}`}
          width="100%"
          height="600px"
          style={{ border: 'none' }}
        ></iframe>
      )}
    </div>
  );
};

export default page;
