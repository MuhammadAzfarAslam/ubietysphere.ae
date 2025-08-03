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
    // formData.append("dto", JSON.stringify({ id })); // replace with real id
    formData.append("image", selectedFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // replace with real token (e.g., from session)
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Uploa  d failed");
      }
      const data = await res.json();
      addToast("Your profile picture has been uploaded!", "success");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <FileUpload
      preValue={preValue}
      onChange={changeHandler} // notice: pass file object, not event
      label="Upload your photo"
      accept="image/*"
      className="rounded-full w-30 h-30 "
    />
  );
};

export default GeneralProfile;
