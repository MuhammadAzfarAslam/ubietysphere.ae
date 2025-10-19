"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormButton from "../button/FormButton";
import { useToast } from "../toaster/ToastContext";
import Modal from "./Modal";
import { postData } from "@/utils/getData";
import { useSession } from "next-auth/react";

// Validation schema for doctor email/id
const schema = yup.object({
  doctor: yup
    .string()
    .required("Doctor email or ID is required"),
});

const ShareDocument = ({ isOpen, onClose, documentData }) => {
  const [sharedEmails, setSharedEmails] = useState([]);
  const { addToast } = useToast();
  const { data: session } = useSession();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      if (!documentData?.id) {
        addToast("No document selected to share!", "error");
        return;
      }

      // Prepare the request body according to the API spec
      const requestBody = {
        doctor: data.doctor, // Can be user ID or email
        reports: [
          {
            id: documentData.id
          }
        ]
      };

      // Call the API to share the document
      const response = await postData(
        "user/reports/share",
        requestBody,
        {
          Authorization: `Bearer ${session?.accessToken}`,
        }
      );

      if (response) {
        // Add to shared emails list for display
        const newEntry = {
          id: Date.now(),
          email: data.doctor,
        };
        setSharedEmails([...sharedEmails, newEntry]);

        addToast("Document shared successfully!", "success");
        reset();
      }
    } catch (error) {
      console.error("Share failed:", error);
      addToast("Failed to share document!", "error");
    }
  };

  const removeEmail = (emailId) => {
    try {
      // TODO: API call to remove email access
      console.log("Removing email access:", emailId);
      
      setSharedEmails(sharedEmails.filter(email => email.id !== emailId));
      addToast("Email access removed!", "success");
    } catch (error) {
      console.error("Remove failed:", error);
      addToast("Failed to remove email access!", "error");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Document"
    >

      {/* Document Info */}
      <div className="mb-6 p-3 bg-gray-50 rounded-sm">
        <p className="text-sm text-gray-600">Document:</p>
        <p className="font-medium text-gray-800">
          {documentData?.title || "Untitled Document"}
        </p>
      </div>

      {/* Share Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share with Doctor
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter doctor email or ID"
              className="flex-1 p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary"
              {...register("doctor")}
            />
            <FormButton type="submit">
              Share
            </FormButton>
          </div>
          <p className="text-red-500 text-sm mt-1">{errors.doctor?.message}</p>
        </div>
      </form>

      {/* Shared Emails List */}
      {sharedEmails.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Shared with:
          </h3>
          <div className="space-y-2">
            {sharedEmails.map((email) => (
              <div
                key={email.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-sm"
              >
                <span className="text-sm text-gray-800">{email.email}</span>
                <button
                  onClick={() => removeEmail(email.id)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  title="Remove access"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ShareDocument;
