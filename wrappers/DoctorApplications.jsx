"use client";
import React, { useState } from "react";
import DoctorApplicationCard from "@/components/list/DoctorApplicationCard";

const DoctorApplications = ({ initialData, accessToken }) => {
  const [applications, setApplications] = useState(initialData?.content || []);

  const handleDelete = (deletedId) => {
    // Remove the deleted application from the state
    setApplications((prevApplications) =>
      prevApplications.filter((app) => app.id !== deletedId)
    );
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Doctor Applications</h2>
        <p className="text-gray-500">Review and manage doctor applications</p>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <DoctorApplicationCard
              key={application.id}
              id={application.id}
              firstName={application.firstName}
              lastName={application.lastName}
              email={application.email}
              phone={application.phone}
              totalExperience={application.totalExperience}
              coverLetter={application.coverLetter}
              resumeFileName={application.resumeFileName}
              licenceFileName={application.licenceFileName}
              lastUpdate={application.lastUpdate}
              accessToken={accessToken}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No doctor applications found.</p>
        </div>
      )}
    </>
  );
};

export default DoctorApplications;
