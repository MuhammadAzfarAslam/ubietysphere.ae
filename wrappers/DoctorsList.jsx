"use client";
import React, { useState } from "react";
import DoctorCard from "@/components/list/DoctorCard";

const DoctorsList = ({ initialData, accessToken }) => {
  const [doctors, setDoctors] = useState(initialData?.content || []);
  const [filteredDoctors, setFilteredDoctors] = useState(initialData?.content || []);
  const [statusFilter, setStatusFilter] = useState("all");
  const [professionFilter, setProfessionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Get unique professions from doctors list
  const professions = [...new Set(doctors.map(doctor => doctor.details?.category).filter(Boolean))];

  // Apply filters
  const applyFilters = (status, profession) => {
    let filtered = [...doctors];

    // Filter by status
    if (status !== "all") {
      const isActive = status === "active";
      filtered = filtered.filter(doctor => doctor.enabled === isActive);
    }

    // Filter by profession
    if (profession !== "all") {
      filtered = filtered.filter(doctor => doctor.details?.category === profession);
    }

    setFilteredDoctors(filtered);
    setCurrentPage(0); // Reset to first page when filters change
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    applyFilters(status, professionFilter);
  };

  const handleProfessionChange = (profession) => {
    setProfessionFilter(profession);
    applyFilters(statusFilter, profession);
  };

  const handleDelete = (deletedId) => {
    setDoctors(prevDoctors => prevDoctors.filter(doc => doc.id !== deletedId));
    setFilteredDoctors(prevDoctors => prevDoctors.filter(doc => doc.id !== deletedId));
  };

  const handleToggleStatus = (doctorId, newStatus) => {
    setDoctors(prevDoctors =>
      prevDoctors.map(doc =>
        doc.id === doctorId ? { ...doc, enabled: newStatus } : doc
      )
    );
    setFilteredDoctors(prevDoctors =>
      prevDoctors.map(doc =>
        doc.id === doctorId ? { ...doc, enabled: newStatus } : doc
      )
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Doctors List</h2>
        <p className="text-gray-500">Manage doctors and their status</p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Profession Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Profession
          </label>
          <select
            value={professionFilter}
            onChange={(e) => handleProfessionChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Professions</option>
            {professions.map((profession) => (
              <option key={profession} value={profession}>
                {profession}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors List */}
      {currentDoctors.length > 0 ? (
        <>
          <div className="space-y-4">
            {currentDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                accessToken={accessToken}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredDoctors.length)} of{" "}
                {filteredDoctors.length} doctors
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index)}
                      className={`px-3 py-2 rounded-sm text-sm font-medium ${
                        currentPage === index
                          ? "bg-primary text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No doctors found matching the filters.</p>
        </div>
      )}
    </>
  );
};

export default DoctorsList;
