"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/toaster/ToastContext";
import Modal from "@/components/modal/Modal";
import { postData } from "@/utils/getData";

const DoctorApplicationCard = ({
  id,
  firstName,
  lastName,
  email,
  phone,
  totalExperience,
  coverLetter,
  resumeFileName,
  licenceFileName,
  lastUpdate,
  accessToken
}) => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sendInvitationHandler = async (applicantEmail) => {
    try {
      const response = await postData(
        "user/doctor-applications/registration-token",
        { email: applicantEmail },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );

      if (response) {
        addToast("Invitation has been sent successfully to the applicant", "success");
      } else {
        addToast("Failed to send invitation", "error");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      addToast("Something went wrong while sending the invitation", "error");
    }
  };

  const rejectHandler = async (applicationId) => {
    try {
      // TODO: Replace with actual API endpoint for rejecting applications
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/doctor-applications/${applicationId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        addToast("Application rejected successfully!", "success");
      } else {
        addToast("Failed to reject application", "error");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      addToast("Something went wrong while rejecting the application", "error");
    }
  };
  return (
    <div className="w-full bg-primary shadow-lg rounded-sm p-4 mb-4 flex items-center justify-between">
      {/* Left Side - All Information */}
      <div className="flex items-center space-x-6 text-white">
        {/* Name */}
        {/* <div className="text-lg font-semibold min-w-[150px]">
          {firstName} {lastName}
        </div> */}

        {/* Contact Information */}
        <div className="text-sm min-w-[200px]">
          <span className="font-medium"></span> {email}
        </div>

        <div className="text-sm min-w-[120px]">
          <span className="font-medium">Phone:</span> {phone}
        </div>

        <div className="text-sm min-w-[100px]">
          <span className="font-medium">Exp:</span> {totalExperience}y
        </div>

        {/* Application Date */}
        <div className="text-sm min-w-[120px]">
          <span className="font-medium">Date:</span> {lastUpdate ? new Date(lastUpdate).toLocaleDateString() : 'N/A'}
        </div>

        {/* File Links */}
        <div className="text-sm min-w-[150px]">
          <span className="font-medium">Docs:</span>{" "}
          {(resumeFileName || licenceFileName) ? (
            <div className="inline-flex space-x-2">
              {resumeFileName && (
                <Link 
                  href={`https://cms.ubietysphere.ae/img/user-reports/${resumeFileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  Resume
                </Link>
              )}
              {resumeFileName && licenceFileName && (
                <span className="text-gray-300">|</span>
              )}
              {licenceFileName && (
                <Link 
                  href={`https://cms.ubietysphere.ae/img/user-reports/${licenceFileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  License
                </Link>
              )}
            </div>
          ) : (
            <span className="text-gray-300">None</span>
          )}
        </div>
      </div>

      {/* Right Side - Action Buttons */}
      <div className="flex space-x-4">
        {/* View Button */}
        <button
          className="text-white cursor-pointer hover:text-blue-300 transition-colors"
          onClick={() => setIsModalOpen(true)}
          title="View Application"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Send Invitation Button */}
        <button
          className="text-white cursor-pointer hover:text-green-300 transition-colors"
          onClick={() => sendInvitationHandler(email)}
          title="Send Invitation Link"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Reject Button */}
        <button 
          className="text-white cursor-pointer hover:text-red-300 transition-colors" 
          onClick={() => rejectHandler(id)}
          title="Reject Application"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* View Application Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Application Details"
      >
        <div className="space-y-4">
          {/* Applicant Name */}
          <div>
            <h3 className="text-lg font-semibold text-primary">
              {firstName} {lastName}
            </h3>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-800">{email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-800">{phone}</p>
            </div>
          </div>

          {/* Experience and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Total Experience</label>
              <p className="text-gray-800">{totalExperience} years</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Application Date</label>
              <p className="text-gray-800">
                {lastUpdate ? new Date(lastUpdate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Cover Letter */}
          {coverLetter && (
            <div>
              <label className="text-sm font-medium text-gray-600">Cover Letter</label>
              <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">
                {coverLetter}
              </p>
            </div>
          )}

          {/* Documents */}
          <div>
            <label className="text-sm font-medium text-gray-600">Documents</label>
            <div className="mt-2 flex justify-between  space-y-2">
              {resumeFileName ? (
                <Link
                  href={`https://cms.ubietysphere.ae/img/user-reports/${resumeFileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  View Resume
                </Link>
              ) : (
                <p className="text-gray-400">No resume uploaded</p>
              )}
              {licenceFileName ? (
                <Link
                  href={`https://cms.ubietysphere.ae/img/user-reports/${licenceFileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  View License
                </Link>
              ) : (
                <p className="text-gray-400">No license uploaded</p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorApplicationCard;
