import React from "react";

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

const PreviewPage = async ({ searchParams }) => {
  const params = await searchParams;
  const url = params?.url;

  if (!url) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No file to preview</p>
      </div>
    );
  }

  const type = getFileExtension(url);

  return (
    <div className="text-center">
      {imageExtensions?.includes(type) && (
        <img
          src={`https://cms.ubietysphere.ae/${url}`}
          alt="Preview"
          className="max-w-full h-auto mx-auto"
        />
      )}

      {type === "pdf" && (
        <iframe
          src={`https://cms.ubietysphere.ae/${url}`}
          width="100%"
          height="600px"
          style={{ border: 'none' }}
          title="PDF Preview"
        ></iframe>
      )}

      {!imageExtensions?.includes(type) && type !== "pdf" && (
        <div className="text-center py-8">
          <p className="text-gray-500">Unsupported file type: {type}</p>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
