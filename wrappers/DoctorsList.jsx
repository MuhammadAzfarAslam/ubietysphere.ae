"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DoctorCard from "@/components/list/DoctorCard";
import getData, { putData } from "@/utils/getData";
import { DOCTOR_CATEGORIES } from "@/utils/enums";
import { useToast } from "@/components/toaster/ToastContext";

const DoctorsList = ({ initialData, accessToken }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  // Initialize filters from URL params
  const [doctors, setDoctors] = useState(initialData?.content || []);
  const [paginationData, setPaginationData] = useState({
    page: initialData?.page ?? 0,
    size: initialData?.size ?? 20,
    totalElements: initialData?.totalElements ?? 0,
    totalPages: initialData?.totalPages ?? 1,
    first: initialData?.first ?? true,
    last: initialData?.last ?? false,
  });
  const [statusFilter, setStatusFilter] = useState(searchParams.get('active') ? (searchParams.get('active') === 'true' ? 'active' : 'inactive') : 'all');
  const [professionFilter, setProfessionFilter] = useState(searchParams.get('profession') || 'all');
  const [isLoading, setIsLoading] = useState(false);

  // Build API URL with query parameters
  const buildApiUrl = (page = 0, status = statusFilter, profession = professionFilter) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());

    if (status !== 'all') {
      params.set('active', status === 'active' ? 'true' : 'false');
    }

    if (profession !== 'all') {
      params.set('profession', profession);
    }

    return `user/doctors?${params.toString()}`;
  };

  const fetchDoctors = async (page = 0, status = statusFilter, profession = professionFilter) => {
    setIsLoading(true);

    // Update URL
    const urlParams = new URLSearchParams();
    urlParams.set('page', page.toString());
    if (status !== 'all') {
      urlParams.set('active', status === 'active' ? 'true' : 'false');
    }
    if (profession !== 'all') {
      urlParams.set('profession', profession);
    }
    router.push(`?${urlParams.toString()}`);

    try {
      const apiUrl = buildApiUrl(page, status, profession);
      const res = await getData(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res?.data) {
        setDoctors(res.data.content || []);
        setPaginationData({
          page: res.data.page ?? 0,
          size: res.data.size ?? 20,
          totalElements: res.data.totalElements ?? 0,
          totalPages: res.data.totalPages ?? 1,
          first: res.data.first ?? true,
          last: res.data.last ?? false,
        });
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    fetchDoctors(0, status, professionFilter); // Reset to page 0 when filter changes
  };

  const handleProfessionChange = (profession) => {
    setProfessionFilter(profession);
    fetchDoctors(0, statusFilter, profession); // Reset to page 0 when filter changes
  };

  const handleDelete = (deletedId) => {
    setDoctors(prevDoctors => prevDoctors.filter(doc => doc.id !== deletedId));
    setPaginationData(prev => ({
      ...prev,
      totalElements: prev.totalElements - 1
    }));
  };

  const handleToggleStatus = async (doctorId, newStatus) => {
    try {
      // Find the doctor object
      const doctor = doctors.find(doc => doc.id === doctorId);

      if (!doctor) return;

      // Prepare the payload with the complete doctor object
      const payload = {
        id: doctor.id,
        lastUpdate: doctor.lastUpdate,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        dateOfBirth: doctor.dateOfBirth,
        gender: doctor.gender,
        email: doctor.email,
        mobileNumber: doctor.mobileNumber,
        enabled: doctor.enabled,
        role: doctor.role,
        active: newStatus
      };

      // Call the API
      await putData("user", payload, {
        Authorization: `Bearer ${accessToken}`
      });

      // Update local state
      setDoctors(prevDoctors =>
        prevDoctors.map(doc =>
          doc.id === doctorId ? { ...doc, active: newStatus } : doc
        )
      );

      addToast(
        `Doctor ${newStatus ? "activated" : "deactivated"} successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error toggling doctor status:", error);
      addToast("Failed to update doctor status", "error");
    }
  };

  const goToPage = (page) => {
    if (page < 0 || page >= paginationData.totalPages || isLoading) {
      return;
    }
    fetchDoctors(page, statusFilter, professionFilter);
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
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="all">All Professions</option>
            {DOCTOR_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors List */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading doctors...</p>
        </div>
      ) : doctors.length > 0 ? (
        <>
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                accessToken={accessToken}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>

          {/* Pagination - Using API pagination data */}
          {paginationData.totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {paginationData.page * paginationData.size + 1} to{" "}
                {Math.min(
                  (paginationData.page + 1) * paginationData.size,
                  paginationData.totalElements
                )}{" "}
                of {paginationData.totalElements} doctors
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => goToPage(paginationData.page - 1)}
                  disabled={paginationData.first || isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Previous"}
                </button>

                <div className="flex space-x-1">
                  {[...Array(paginationData.totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index)}
                      disabled={isLoading}
                      className={`px-3 py-2 rounded-sm text-sm font-medium ${
                        paginationData.page === index
                          ? "bg-primary text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(paginationData.page + 1)}
                  disabled={paginationData.last || isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Next"}
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
