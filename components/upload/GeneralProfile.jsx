"use client";
import React, { useState } from "react";
import FileUpload from "./FileUpload";
import { useToast } from "../toaster/ToastContext";

const GeneralProfile = ({ id, preValue = null, accessToken }) => {
  const { addToast } = useToast();

  const changeHandler = async (selectedFile) => {
    const formData = new FormData();
    formData.append(
      "dto",
      new Blob([JSON.stringify({ id })], { type: "application/json" })
    );
    formData.append("image", selectedFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      // This may not be reached in 413 scenario
      if (!res.ok) {
        const text = await res.text();
        console.warn("Server responded with:", res.status, text);

        if (res.status === 413) {
          addToast("File must be under 3MB", "error");
        } else {
          addToast("Something went wrong, please try again!", "error");
        }
        return;
      }

      addToast("Your profile picture has been uploaded!", "success");
    } catch (error) {
      console.error("Upload error:", error);

      // Detect 413 manually if possible
      if (
        error.message?.includes("413") ||
        error.message?.includes("Payload Too Large")
      ) {
        addToast("File must be under 3MB", "error");
      } else {
        addToast("A network error occurred. File must be under 3MB!", "error");
      }
    }
  };

  return (
    <FileUpload
      isDP
      preValue={preValue}
      onChange={changeHandler} // notice: pass file object, not event
      label="Upload your photo"
      accept="image/*"
      className="rounded-full w-30 h-30 "
    />
  );
};

export default GeneralProfile;
