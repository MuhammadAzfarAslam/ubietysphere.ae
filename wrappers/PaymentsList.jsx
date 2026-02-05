"use client";
import React, { useState, useEffect } from "react";
import getData from "@/utils/getData";
import { useToast } from "@/components/toaster/ToastContext";
import { SERVICE_CONTENT } from "@/utils/serviceContent";

// Payment status options
const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PAID", label: "Paid" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

// Get services from SERVICE_CONTENT
const SERVICE_OPTIONS = [
  { value: "", label: "All Services" },
  ...Object.values(SERVICE_CONTENT).map((s) => ({
    value: s.slug,
    label: s.title,
  })),
];

// Month options
const MONTH_OPTIONS = [
  { value: "", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// Generate year options (current year and 2 previous years)
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = [
  { value: "", label: "All Years" },
  { value: String(currentYear), label: String(currentYear) },
  { value: String(currentYear - 1), label: String(currentYear - 1) },
  { value: String(currentYear - 2), label: String(currentYear - 2) },
];

// Page size options
const PAGE_SIZE_OPTIONS = [
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

// Commission rate (15%)
const COMMISSION_RATE = 0.15;

const PaymentsList = ({ accessToken }) => {
  const { addToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  // Filter state
  const [filters, setFilters] = useState({
    paymentStatus: "PAID",
    doctorId: "",
    serviceSlug: "",
    month: "",
    year: "",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0,
  });

  // Summary state
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalRecords: 0,
  });

  // Fetch doctors for filter dropdown
  const fetchDoctors = async () => {
    try {
      const res = await getData("user/doctors?page=0&size=100&sort=id,desc&active=true", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setDoctors(res?.data?.content || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Fetch payments with filters
  const fetchPayments = async (page = 0) => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("size", pagination.size);

      if (filters.paymentStatus) params.set("paymentStatus", filters.paymentStatus);
      if (filters.doctorId) params.set("doctorId", filters.doctorId);
      if (filters.serviceSlug) params.set("serviceSlug", filters.serviceSlug);
      if (filters.month) params.set("month", filters.month);
      if (filters.year) params.set("year", filters.year);

      const res = await getData(`appointments/admin/filter?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const appointmentsData = res?.data?.appointments || [];
      setPayments(appointmentsData);
      setPagination({
        ...pagination,
        page: res?.data?.page || 0,
        totalPages: res?.data?.totalPages || 0,
        totalElements: res?.data?.totalElements || 0,
      });

      // Calculate total - prefer API totalAmount if available, otherwise sum from current page
      const totalFromApi = res?.data?.totalAmount;
      const pageTotal = appointmentsData.reduce((sum, apt) => {
        const amount = parseFloat(apt.amount) || 0;
        return sum + amount;
      }, 0);

      // Use API total if provided and valid, otherwise use page calculation
      const finalTotal = (totalFromApi !== undefined && totalFromApi !== null && parseFloat(totalFromApi) > 0)
        ? parseFloat(totalFromApi)
        : pageTotal;

      setSummary({
        totalAmount: finalTotal,
        totalRecords: res?.data?.totalElements || 0,
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      addToast("Failed to load payments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchPayments(0);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      // Clear month when year is cleared
      if (key === "year" && !value) {
        newFilters.month = "";
      }
      return newFilters;
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchPayments(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  // Refetch when page size changes
  useEffect(() => {
    fetchPayments(0);
  }, [pagination.size]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatAmount = (amount, currency = "AED") => {
    if (amount === null || amount === undefined) return "N/A";
    return `${currency} ${parseFloat(amount).toFixed(2)}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PAID: "bg-green-100 text-green-800 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      FAILED: "bg-red-100 text-red-800 border-red-200",
      REFUNDED: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return statusMap[status?.toUpperCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getAppointmentStatusBadge = (status) => {
    const statusMap = {
      CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return statusMap[status?.toUpperCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <div className="text-sm text-gray-500">
          Total: {pagination.totalElements} records
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Payment Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Payment Status</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Doctor</label>
            <select
              value={filters.doctorId}
              onChange={(e) => handleFilterChange("doctorId", e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Doctors</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.firstName} {doc.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Service</label>
            <select
              value={filters.serviceSlug}
              onChange={(e) => handleFilterChange("serviceSlug", e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {YEAR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Month - Only enabled when year is selected */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange("month", e.target.value)}
              disabled={!filters.year}
              className={`w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${!filters.year ? "bg-gray-100 cursor-not-allowed opacity-60" : ""}`}
            >
              {MONTH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {!filters.year && (
              <p className="text-xs text-gray-400 mt-1">Select a year first</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      {!loading && payments.length > 0 && (
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              {/* Total Earnings */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  AED {summary.totalAmount.toFixed(2)}
                </p>
              </div>

              {/* Commission (5%) */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Commission (15%)</p>
                <p className="text-2xl font-bold text-red-600">
                  - AED {(summary.totalAmount * COMMISSION_RATE).toFixed(2)}
                </p>
              </div>

              {/* Payable to Doctor */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {filters.doctorId ? "Payable to Doctor" : "Total Payable"}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  AED {(summary.totalAmount * (1 - COMMISSION_RATE)).toFixed(2)}
                </p>
              </div>
            </div>

{/* Paid Checkbox - Hidden for now
            {filters.doctorId && (
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className={`text-sm font-medium ${isPaid ? "text-green-600" : "text-gray-700"}`}>
                    {isPaid ? "Paid to Doctor" : "Mark as Paid"}
                  </span>
                </label>
                {isPaid && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Settled
                  </span>
                )}
              </div>
            )}
            */}
          </div>

          {/* Selected Doctor Info */}
          {filters.doctorId && (
            <div className="mt-3 pt-3 border-t border-primary/10">
              <p className="text-sm text-gray-600">
                Showing earnings for: <span className="font-medium text-gray-900">
                  Dr. {doctors.find(d => String(d.id) === filters.doctorId)?.firstName}{" "}
                  {doctors.find(d => String(d.id) === filters.doctorId)?.lastName}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="overflow-x-auto">
          {/* Shimmer Summary Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 animate-pulse">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-32 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-28 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-32 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>

          {/* Shimmer Table */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4"><div className="h-4 w-10 bg-gray-200 rounded"></div></td>
                  <td className="px-4 py-4"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
                  <td className="px-4 py-4"><div className="h-4 w-28 bg-gray-200 rounded"></div></td>
                  <td className="px-4 py-4"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-100 rounded"></div>
                  </td>
                  <td className="px-4 py-4"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
                  <td className="px-4 py-4"><div className="h-5 w-14 bg-gray-200 rounded-full"></div></td>
                  <td className="px-4 py-4"><div className="h-5 w-16 bg-gray-200 rounded-full"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p className="text-gray-500">No payments found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{appointment.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.patient?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Dr. {appointment.doctor?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.serviceTitle || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(appointment.appointmentDate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatAmount(appointment.amount, appointment.currency)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusBadge(appointment.paymentStatus)}`}>
                        {appointment.paymentStatus || "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getAppointmentStatusBadge(appointment.status)}`}>
                        {appointment.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 px-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Showing {payments.length} of {pagination.totalElements} records
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Per page:</span>
                <select
                  value={pagination.size}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="p-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {PAGE_SIZE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Page {pagination.page + 1} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentsList;
