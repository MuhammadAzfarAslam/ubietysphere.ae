"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData, putData } from "@/utils/getData";
import FormButton from "../button/FormButton";
import { useToast } from "../toaster/ToastContext";
import Link from "next/link";

// Medical document categories
const medicalCategories = [
  "Government-issued ID",
  "Health insurance card or policy document",
  "Clinical notes from previous consultations",
  "Discharge summaries from hospitalizations",
  "Current medication list and past prescriptions (last 6–12 months)",
  "Recent diagnostic reports (blood, urine, radiology, etc.)",
  "Allergy list (if any)",
  "Vaccination records",
  "Referral letter (if applicable)",
  "Previous oncology consultation notes",
  "Histopathology/biopsy reports",
  "Imaging reports (MRI, PET, CT scans, etc.)",
  "Tumor marker test results",
  "Treatment protocols or chemotherapy schedules",
  "Genetic/molecular profiling reports",
  "Discharge summaries from oncology admissions",
  "Current medication and allergy list",
  "Mental health history or past psychological assessments",
  "School behavior reports (for children/adolescents)",
  "Completed mental health screening forms (if shared in advance)",
  "Medication history (especially psychotropics)",
  "Relevant personal history documents (trauma, family, education, etc.)",
  "Sleep logs or mood tracking logs (if available)",
  "Recent lab reports (blood glucose, lipid profile, thyroid tests, etc.)",
  "Current weight and height or BMI data",
  "Food journals or diet logs (3–7 days preferred)",
  "Exercise or activity tracker data (if any)",
  "Medication list (especially for metabolic or GI disorders)",
  "Existing medical diagnoses or conditions (e.g., diabetes, PCOS, IBS)",
  "Previous consultations with other dietitians (if any)",
  "All previous clinical notes relevant to the condition",
  "Recent and old diagnostic reports",
  "Images (X-ray, CT, MRI, etc.) in DICOM or PDF format",
  "Treatment history and medication regimen",
  "Referral note or specific question for the second opinion",
  "Family history forms (if genetic/hereditary condition suspected)",
  "Patient's own symptom record or timeline of condition"
];

// Define validation schema using Yup (without file validation - handled separately)
const schema = yup.object({
  title: yup.string().required("Title is required"),
  category: yup.string().required("Category is required"),
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

  const onSubmit = async (formData) => {
    try {
      // Get file from form data
      const file = formData.file && formData.file[0];

      // Check if file is required (for new documents only)
      if (!data?.id && !file) {
        addToast("File upload is required for new documents!", "error");
        return;
      }

      const dto = {
        title: formData.title,
        category: formData.category,
        userId: id,
      };

      const payload = new FormData();
      payload.append(
        "dto",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
      );

      // Append file only if provided
      if (file) {
        payload.append("image", file);
      }

      let response;
      if (data?.id) {
        // Update existing document
        response = await putData(`user/reports/${data.id}`, payload, {
          Authorization: `Bearer ${accessToken}`,
        });
        addToast("Document updated successfully!", "success");
      } else {
        // Create new document
        response = await postData("user/reports/upload", payload, {
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
          File{!data?.id && "*"}
        </label>

        {/* Show current file when editing */}
        {data?.id && data?.fileName && (
          <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-sm">
            <p className="text-sm text-gray-600 mb-2">Current file:</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">{data.fileName}</span>
              <Link
                href={`/preview?url=img/reports-images/${data?.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark underline text-sm"
              >
                View File
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-2">Upload a new file to replace the current one (optional)</p>
          </div>
        )}

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
