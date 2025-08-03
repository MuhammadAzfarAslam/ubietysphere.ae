"use client";
import { useState } from "react";

export default function FileUpload({
  preValue = "",
  onChange = () => {},
  label = "Upload File",
  accept = "*",
  className = "",
  ...props
}) {
  const [preview, setPreview] = useState(preValue);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  };

  return (
    <div
      className={`flex relative flex-col items-start space-y-2 ${className}`}
      {...props}
    >
      <label
        htmlFor="file-upload"
        className="cursor-pointer absolute -top-1 -right-2 z-99 rounded-full text-center w-10 h-10 p-2 inline-flex items-center mb-0 text-base bg-primary text-white hover:bg-primary-dark transition"
      >
        {/* {label} */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.183L6.75 19.963l-4.5.75.75-4.5L16.862 3.487z"
          />
        </svg>
      </label>

      <input
        id="file-upload"
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Show preview if it’s an image */}
      {preview !== null &&
      (preview.startsWith("data:") ||
        preview.startsWith("blob:") ||
        preview.match(/\.(jpeg|jpg|png|gif|webp)$/i)) ? (
        <img
          src={preview}
          alt="Preview"
          className="absolute border border-gray-300 rounded-full w-30 h-30 object-cover"
        />
      ) : (
        preview && (
          <a
            href={preview}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline mt-2"
          >
            View file
          </a>
        )
      )}
    </div>
  );
}
