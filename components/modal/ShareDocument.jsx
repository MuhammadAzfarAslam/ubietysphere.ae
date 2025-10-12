"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormButton from "../button/FormButton";
import { useToast } from "../toaster/ToastContext";
import Modal from "./Modal";

// Validation schema for email
const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const ShareDocument = ({ isOpen, onClose, documentData }) => {
  const [sharedEmails, setSharedEmails] = useState([
    // Mock data - replace with actual API data
    { id: 1, email: "john@example.com" },
    { id: 2, email: "sarah@example.com" },
  ]);
  
  const { addToast } = useToast();
  
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
      // TODO: API call to share document
      console.log("Sharing document with:", data.email);
      
      // Add to shared emails list (temporary)
      const newEmail = {
        id: Date.now(),
        email: data.email,
      };
      setSharedEmails([...sharedEmails, newEmail]);
      
      addToast("Document shared successfully!", "success");
      reset();
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
            Share with email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email address"
              className="flex-1 p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary"
              {...register("email")}
            />
            <FormButton type="submit">
              Share
            </FormButton>
          </div>
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
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
