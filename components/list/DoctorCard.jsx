"use client";
import React, { useState } from "react";
import Link from "next/link";
import Modal from "@/components/modal/Modal";

const DoctorCard = ({ doctor, onDelete, onToggleStatus }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    const newStatus = !doctor.active;

    // Call parent handler which will make the API call
    onToggleStatus(doctor.id, newStatus);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setIsDeleteModalOpen(false);

    // Call parent handler which will make the API call
    await onDelete(doctor.id);

    setIsDeleting(false);
  };

  return (
    <div className="w-full bg-primary shadow-lg rounded-sm p-4 mb-4 flex items-center justify-between">
      {/* Left Side - Doctor Information */}
      <div className="flex items-center space-x-6 text-white">
        {/* Profile Image */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
          {doctor.imageName ? (
            <img
              src={`https://cms.ubietysphere.ae/img/user-images/${doctor.imageName}`}
              alt={`${doctor.firstName} ${doctor.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white bg-gray-500 text-xl font-bold">
              {doctor.firstName?.[0]}{doctor.lastName?.[0]}
            </div>
          )}
        </div>

        {/* Name & Email */}
        <div className="min-w-[200px]">
          <div className="font-semibold">
            {doctor.firstName} {doctor.lastName}
          </div>
          <div className="text-sm text-gray-200">{doctor.email}</div>
        </div>

        {/* Profession */}
        <div className="text-sm min-w-[150px]">
          <span className="font-medium">Profession:</span>{" "}
          {doctor.details?.category || "N/A"}
        </div>

        {/* Experience */}
        <div className="text-sm min-w-[100px]">
          <span className="font-medium">Exp:</span>{" "}
          {doctor.details?.totalExperience || 0}y
        </div>

        {/* Status Badge */}
        <div className="min-w-[80px]">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              doctor.active
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {doctor.active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Right Side - Action Buttons */}
      <div className="flex space-x-4">
        {/* View Button */}
        <button
          className="text-white cursor-pointer hover:text-blue-300 transition-colors"
          onClick={() => setIsViewModalOpen(true)}
          title="View Details"
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

        {/* Toggle Active/Inactive */}
        <button
          onClick={handleToggle}
          className={`cursor-pointer transition-colors ${
            doctor.active
              ? "text-green-400 hover:text-green-300"
              : "text-gray-400 hover:text-gray-300"
          }`}
          title={doctor.active ? "Deactivate" : "Activate"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Delete Button */}
        <button
          className="text-white cursor-pointer hover:text-red-300 transition-colors"
          onClick={handleDeleteClick}
          title="Delete Doctor"
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

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Doctor Details"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          {/* Profile Image */}
          {doctor.imageName && (
            <div className="flex justify-center mb-4">
              <img
                src={`https://cms.ubietysphere.ae/img/user-images/${doctor.imageName}`}
                alt={`${doctor.firstName} ${doctor.lastName}`}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h3 className="text-xl font-semibold text-primary">
              {doctor.firstName} {doctor.details?.middleName1 || ""}{" "}
              {doctor.details?.middleName2 || ""} {doctor.lastName}
            </h3>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-800">{doctor.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Mobile</label>
              <p className="text-gray-800">{doctor.mobileNumber}</p>
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <p className="text-gray-800">{doctor.dateOfBirth || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Gender</label>
              <p className="text-gray-800">{doctor.gender || "N/A"}</p>
            </div>
          </div>

          {/* Professional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Profession</label>
              <p className="text-gray-800">{doctor.details?.category || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Experience</label>
              <p className="text-gray-800">{doctor.details?.totalExperience || 0} years</p>
            </div>
          </div>

          {/* Nationality & ID */}
          {doctor.details && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nationality</label>
                <p className="text-gray-800">{doctor.details.nationality || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">National ID</label>
                <p className="text-gray-800">{doctor.details.nationalId || "N/A"}</p>
              </div>
            </div>
          )}

          {/* Bio */}
          {doctor.details?.bio && (
            <div>
              <label className="text-sm font-medium text-gray-600">Bio</label>
              <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                {doctor.details.bio}
              </p>
            </div>
          )}

          {/* Work Days */}
          {doctor.details?.workDays && doctor.details.workDays.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600">Work Days</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {doctor.details.workDays.map((day) => (
                  <span
                    key={day}
                    className="px-3 py-1 bg-primary text-white rounded-full text-sm"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Media */}
          {doctor.details?.socialMediaUrls && (
            <div>
              <label className="text-sm font-medium text-gray-600">Social Media</label>
              <div className="flex space-x-3 mt-2">
                {doctor.details.socialMediaUrls.facebook && (
                  <Link
                    href={doctor.details.socialMediaUrls.facebook}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Facebook
                  </Link>
                )}
                {doctor.details.socialMediaUrls.linkedin && (
                  <Link
                    href={doctor.details.socialMediaUrls.linkedin}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    LinkedIn
                  </Link>
                )}
                {doctor.details.socialMediaUrls.instagram && (
                  <Link
                    href={doctor.details.socialMediaUrls.instagram}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Instagram
                  </Link>
                )}
                {doctor.details.socialMediaUrls.x && (
                  <Link
                    href={doctor.details.socialMediaUrls.x}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    X (Twitter)
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Qualifications */}
          {doctor.qualifications && doctor.qualifications.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-3 block">
                Qualifications ({doctor.qualifications.length})
              </label>
              <div className="space-y-3">
                {doctor.qualifications.map((qual) => (
                  <div
                    key={qual.id}
                    className="p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {qual.degreeType} - {qual.fieldOfStudy}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {qual.institutionName}, {qual.country}
                        </p>
                      </div>
                      {qual.imageName && (
                        <Link
                          href={`https://cms.ubietysphere.ae/img/qualification-images/${qual.imageName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          View Certificate
                        </Link>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {qual.dateFrom} to {qual.dateTo}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Licenses */}
          {doctor.licences && doctor.licences.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-3 block">
                Licenses ({doctor.licences.length})
              </label>
              <div className="space-y-3">
                {doctor.licences.map((license) => (
                  <div
                    key={license.id}
                    className="p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {license.specialization}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {license.authority} - {license.licenceNumber}
                        </p>
                      </div>
                      {license.imageName && (
                        <Link
                          href={`https://cms.ubietysphere.ae/img/licence-images/${license.imageName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          View License
                        </Link>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Valid: {license.validFrom} to {license.validTo}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-600">Account Status</label>
            <p className="text-gray-800">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  doctor.enabled
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {doctor.enabled ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Doctor"
      >
        <div className="space-y-4">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Are you sure you want to delete this doctor?
            </h3>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">
                {doctor.firstName} {doctor.lastName}
              </span>
              <br />
              <span className="text-sm">{doctor.email}</span>
            </p>
            <p className="text-sm text-red-600">
              This action cannot be undone. All associated data will be permanently removed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-sm text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Doctor"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorCard;
