"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData, putData } from "@/utils/getData";
import FormButton from "../button/FormButton";
import { useToast } from "../toaster/ToastContext";

// Medical treatment categories
const medicalCategories = [
  "X-Ray",
  "MRI Scan",
  "CT Scan",
  "Ultrasound",
  "Blood Test",
  "Urine Test",
  "ECG",
  "Echocardiogram",
  "Endoscopy",
  "Colonoscopy",
  "Biopsy",
  "Pathology Report",
  "Prescription",
  "Medical Certificate",
  "Discharge Summary",
  "Lab Report",
  "Vaccination Record",
  "Allergy Test",
  "Pregnancy Test",
  "Other"
];

// Define validation schema using Yup
const schema = yup.object({
  title: yup.string().required("Title is required"),
  category: yup.string().required("Category is required"),
  file: yup.mixed().required("File is required"),
});

const DocumentForm = ({
  id,
  accessToken,
  data = {},
  setIsOpen,
  refreshCall,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: data?.title || "",
      category: data?.category || "",
    },
  });

  const uploadDocument = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await postData("user/reports/upload", formData, {
        Authorization: `Bearer ${accessToken}`,
      });
      return response?.data?.id;
    } catch (error) {
      console.error("Upload failed:", error);
      addToast("File upload failed!", "error");
      return null;
    }
  };

  const onSubmit = async (formData) => {
    try {
      let documentId = null;

      // Always upload file - required for both add and edit
      const file = formData.file[0]; // Get file from form data
      documentId = await uploadDocument(file);
      if (!documentId) {
        addToast("File upload is required!", "error");
        return;
      }

      const payload = {
        title: formData.title,
        category: formData.category,
        userId: id,
        ...(documentId && { documentId }),
      };

      let response;
      if (data?.id) {
        // Update existing document
        response = await putData(`user/reports/${data.id}`, payload, {
          Authorization: `Bearer ${accessToken}`,
        });
        addToast("Document updated successfully!", "success");
      } else {
        // Create new document
        response = await postData("user/reports", payload, {
          Authorization: `Bearer ${accessToken}`,
        });
        addToast("Document added successfully!", "success");
      }

      await refreshCall();
      setIsOpen(false);
    } catch (error) {
      console.error("Submit failed:", error);
      addToast("Something went wrong!", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title*
        </label>
        <input
          type="text"
          placeholder="Enter document title"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary"
          {...register("title")}
        />
        <p className="text-red-500 text-sm">{errors.title?.message}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category*
        </label>
        <select
          className="mt-1 block w-full capitalize p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
          {...register("category")}
        >
          <option value="">Select Category</option>
          {medicalCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <p className="text-red-500 text-sm">{errors.category?.message}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          File*
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary"
          {...register("file")}
        />
        <p className="text-sm text-gray-600 mt-1">
          Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
        </p>
        <p className="text-red-500 text-sm">{errors.file?.message}</p>
      </div>

      <div className="flex items-center gap-5">
        <FormButton type="submit">
          {data?.id ? "Update Document" : "Add Document"}
        </FormButton>
      </div>
    </form>
  );
};

export default DocumentForm;
