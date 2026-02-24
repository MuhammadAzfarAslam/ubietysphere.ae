"use client";
import React, { useState, useEffect, useCallback } from "react";
import getData, { postData } from "@/utils/getData";
import { useToast } from "@/components/toaster/ToastContext";

// Tab to API status mapping
const TAB_STATUS_MAP = {
  upcoming: "CONFIRMED",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

// Format date for display
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Format time for display (HH:mm:ss -> h:mm AM/PM)
const formatTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Get status badge styles
const getStatusBadge = (status) => {
  const badges = {
    Confirmed: "bg-green-100 text-green-800 border-green-200",
    CONFIRMED: "bg-green-100 text-green-800 border-green-200",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Completed: "bg-blue-100 text-blue-800 border-blue-200",
    COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    "No-Show": "bg-orange-100 text-orange-800 border-orange-200",
    NO_SHOW: "bg-orange-100 text-orange-800 border-orange-200",
  };
  return badges[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Get payment status badge styles
const getPaymentBadge = (status) => {
  const badges = {
    Paid: "bg-green-100 text-green-700",
    PAID: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    Refunded: "bg-purple-100 text-purple-700",
    REFUNDED: "bg-purple-100 text-purple-700",
    Failed: "bg-red-100 text-red-700",
    FAILED: "bg-red-100 text-red-700",
  };
  return badges[status] || "bg-gray-100 text-gray-700";
};

// Get service color
const getServiceColor = (serviceSlug) => {
  const colors = {
    "second-opinion": "border-l-blue-500",
    "women-s-health": "border-l-pink-500",
    "expert-medical-consultation": "border-l-green-500",
    "mental-health-counseling": "border-l-purple-500",
    "holistic-health-counseling": "border-l-teal-500",
    "lifestyle-management-and-coaching": "border-l-orange-500",
    "nutrition-and-dietetics-counseling": "border-l-yellow-500",
    "children-s-health": "border-l-cyan-500",
    "genetic-counselor": "border-l-indigo-500",
  };
  return colors[serviceSlug] || "border-l-gray-500";
};

// Get file icon based on file extension
const getFileIcon = (fileName) => {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  if (["pdf"].includes(ext)) {
    return (
      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 13h1c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H9v1.5H8v-4.5h.5zm1 2.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H9v1h.5zm2.5-2.5h1.5c.83 0 1.5.67 1.5 1.5v1c0 .83-.67 1.5-1.5 1.5H12v-4zm1 3.5c.28 0 .5-.22.5-.5v-1c0-.28-.22-.5-.5-.5h-.5v2h.5zm3-3.5h2v1h-1.5v.5h1v1h-1v1.5h-1v-4z"/>
      </svg>
    );
  }
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return (
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
};

// Format status for display
const formatStatus = (status) => {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const AppointmentRoom = ({ accessToken, userRole }) => {
  const isDoctor = userRole?.toLowerCase() === "doctor";
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  // Tab counts (fetched separately)
  const [counts, setCounts] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });

  // Documents state
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [attachingDocuments, setAttachingDocuments] = useState(false);

  // Cancel appointment state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancellationResult, setCancellationResult] = useState(null);

  // Reschedule appointment state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rescheduling, setRescheduling] = useState(false);
  const [availableSlots, setAvailableSlots] = useState({});
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedRescheduleDate, setSelectedRescheduleDate] = useState("");
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState(null);

  // Doctor notes state (for doctors only)
  const [editingNotesFor, setEditingNotesFor] = useState(null);
  const [doctorNotesInput, setDoctorNotesInput] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Fetch appointments with status filter and pagination
  const fetchAppointments = useCallback(async (status, page = 0) => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const response = await getData(
        `appointments?status=${status}&page=${page}&size=${pagination.size}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = response?.data || {};
      setAppointments(data.appointments || []);
      setPagination(prev => ({
        ...prev,
        page: data.page || 0,
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
      }));
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      addToast("Failed to load appointments", "error");
    } finally {
      setLoading(false);
    }
  }, [accessToken, addToast, pagination.size]);

  // Fetch counts for all tabs
  const fetchCounts = useCallback(async () => {
    if (!accessToken) return;
    try {
      const [confirmedRes, completedRes, cancelledRes] = await Promise.all([
        getData(`appointments?status=CONFIRMED&page=0&size=1`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        getData(`appointments?status=COMPLETED&page=0&size=1`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        getData(`appointments?status=CANCELLED&page=0&size=1`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);
      setCounts({
        upcoming: confirmedRes?.data?.totalElements || 0,
        completed: completedRes?.data?.totalElements || 0,
        cancelled: cancelledRes?.data?.totalElements || 0,
      });
    } catch (error) {
      console.error("Failed to fetch counts:", error);
    }
  }, [accessToken]);

  // Fetch user's documents
  const fetchDocuments = useCallback(async () => {
    if (!accessToken) return;
    try {
      setDocumentsLoading(true);
      const response = await getData("user/reports", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setDocuments(response?.data?.content || []);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setDocumentsLoading(false);
    }
  }, [accessToken]);

  // Initial load
  useEffect(() => {
    fetchAppointments(TAB_STATUS_MAP[activeTab], 0);
    fetchCounts();
    fetchDocuments();
  }, []);

  // When tab changes, fetch appointments for that status
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchAppointments(TAB_STATUS_MAP[tab], 0);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchAppointments(TAB_STATUS_MAP[activeTab], newPage);
  };

  // Refresh current tab
  const handleRefresh = () => {
    fetchAppointments(TAB_STATUS_MAP[activeTab], pagination.page);
    fetchCounts();
  };

  // Open document attachment modal
  const openDocumentModal = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDocuments(appointment.reports?.map(r => r.id) || []);
    setShowDocumentModal(true);
  };

  // Toggle document selection
  const toggleDocumentSelection = (documentId) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  // Attach documents to appointment
  const handleAttachDocuments = async () => {
    if (!selectedAppointment || selectedDocuments.length === 0) {
      addToast("Please select at least one document", "error");
      return;
    }

    setAttachingDocuments(true);
    try {
      await postData(
        `appointments/${selectedAppointment.id}/reports`,
        { reportIds: selectedDocuments },
        { Authorization: `Bearer ${accessToken}` },
        "PATCH"
      );
      addToast("Documents attached successfully", "success");
      setShowDocumentModal(false);
      setSelectedAppointment(null);
      setSelectedDocuments([]);
      handleRefresh();
    } catch (error) {
      console.error("Failed to attach documents:", error);
      addToast("Failed to attach documents", "error");
    } finally {
      setAttachingDocuments(false);
    }
  };

  // Remove report from appointment
  const handleRemoveReport = async (appointmentId, reportIdToRemove, currentReports) => {
    const remainingReportIds = currentReports
      .filter(r => r.id !== reportIdToRemove)
      .map(r => r.id);

    try {
      await postData(
        `appointments/${appointmentId}/reports`,
        { reportIds: remainingReportIds },
        { Authorization: `Bearer ${accessToken}` },
        "PATCH"
      );
      addToast("Report removed successfully", "success");
      handleRefresh();
    } catch (error) {
      console.error("Failed to remove report:", error);
      addToast("Failed to remove report", "error");
    }
  };

  // Open cancel modal
  const openCancelModal = (appointment) => {
    setAppointmentToCancel(appointment);
    setCancelReason("");
    setShowCancelModal(true);
  };

  // Cancel appointment
  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    setCancelling(true);
    try {
      const response = await postData(
        `appointments/${appointmentToCancel.id}/cancel`,
        { cancellationReason: cancelReason || null },
        { Authorization: `Bearer ${accessToken}` },
        "PUT"
      );
      // Check if response contains refund information
      if (response?.data?.refundAmount !== undefined || response?.data?.refundPercentage !== undefined) {
        setCancellationResult({
          refundAmount: response.data.refundAmount,
          refundPercentage: response.data.refundPercentage,
          stripeRefundId: response.data.stripeRefundId,
        });
      } else {
        addToast("Appointment cancelled successfully", "success");
        setShowCancelModal(false);
        setAppointmentToCancel(null);
        setCancelReason("");
        handleRefresh();
      }
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      addToast("Failed to cancel appointment", "error");
    } finally {
      setCancelling(false);
    }
  };

  // Close cancel modal with refund result
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setAppointmentToCancel(null);
    setCancelReason("");
    setCancellationResult(null);
    handleRefresh();
  };

  // Fetch available slots for rescheduling
  const fetchAvailableSlotsForDoctor = async (doctorId, serviceSlug) => {
    if (!accessToken || !doctorId || !serviceSlug) return;
    setSlotsLoading(true);
    try {
      const response = await getData(
        `doctor/slots/available?doctorId=${doctorId}&serviceSlug=${serviceSlug}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      // Response is already grouped by date, filter only Available slots
      const slotsByDate = {};
      const data = response?.data || {};
      Object.keys(data).forEach((date) => {
        const availableSlots = (data[date] || []).filter((slot) => slot.status === "Available");
        if (availableSlots.length > 0) {
          slotsByDate[date] = availableSlots;
        }
      });
      setAvailableSlots(slotsByDate);
    } catch (error) {
      console.error("Failed to fetch available slots:", error);
      addToast("Failed to load available slots", "error");
    } finally {
      setSlotsLoading(false);
    }
  };

  // Open reschedule modal
  const openRescheduleModal = (appointment) => {
    setAppointmentToReschedule(appointment);
    setRescheduleReason("");
    setSelectedRescheduleDate("");
    setSelectedRescheduleSlot(null);
    setShowRescheduleModal(true);
    // Fetch available slots for this doctor and service
    fetchAvailableSlotsForDoctor(appointment.doctor?.id, appointment.serviceSlug);
  };

  // Calculate hours until appointment
  const getHoursUntilAppointment = (appointment) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.startTime}`);
    return (appointmentDateTime - now) / (1000 * 60 * 60);
  };

  // Get reschedule penalty info
  const getReschedulePenaltyInfo = (appointment) => {
    const hours = getHoursUntilAppointment(appointment);
    if (hours < 4) {
      return { allowed: false, percentage: 0, message: "Cannot reschedule within 4 hours. Please cancel instead." };
    } else if (hours < 24) {
      return { allowed: true, percentage: 50, message: "50% penalty fee applies for rescheduling within 24 hours." };
    }
    return { allowed: true, percentage: 0, message: "No penalty fee - rescheduling 24+ hours in advance." };
  };

  // Get cancellation refund info
  const getCancellationRefundInfo = (appointment) => {
    const hours = getHoursUntilAppointment(appointment);
    const amount = appointment.amount || 0;

    if (hours >= 48) {
      return {
        refundPercentage: 100,
        refundAmount: amount,
        deductionAmount: 0,
        message: "Full refund - cancelling 48+ hours in advance",
        color: "green"
      };
    } else if (hours >= 24) {
      return {
        refundPercentage: 50,
        refundAmount: amount * 0.5,
        deductionAmount: amount * 0.5,
        message: "50% refund - cancelling 24-48 hours before appointment",
        color: "amber"
      };
    }
    return {
      refundPercentage: 0,
      refundAmount: 0,
      deductionAmount: amount,
      message: "No refund - cancelling less than 24 hours before appointment",
      color: "red"
    };
  };

  // Handle reschedule
  const handleReschedule = async () => {
    if (!appointmentToReschedule || !selectedRescheduleSlot) {
      addToast("Please select a new time slot", "error");
      return;
    }

    const penalty = getReschedulePenaltyInfo(appointmentToReschedule);
    if (!penalty.allowed) {
      addToast(penalty.message, "error");
      return;
    }

    setRescheduling(true);
    try {
      const response = await postData(
        `appointments/${appointmentToReschedule.id}/reschedule`,
        {
          appointmentId: appointmentToReschedule.id,
          newSlotId: selectedRescheduleSlot.id,
          reason: rescheduleReason || "Schedule change",
        },
        { Authorization: `Bearer ${accessToken}` },
        "PUT"
      );

      // Check if penalty payment is required
      if (response?.data?.penaltyPayment?.required) {
        // TODO: Handle penalty payment flow with Stripe
        addToast("Penalty payment required. Please complete payment to confirm reschedule.", "warning");
      } else {
        addToast("Appointment rescheduled successfully!", "success");
        setShowRescheduleModal(false);
        setAppointmentToReschedule(null);
        setSelectedRescheduleSlot(null);
        handleRefresh();
      }
    } catch (error) {
      console.error("Failed to reschedule:", error);
      addToast(error.message || "Failed to reschedule appointment", "error");
    } finally {
      setRescheduling(false);
    }
  };

  // Save doctor notes
  const handleSaveDoctorNotes = async (appointmentId, currentPatientNotes) => {
    setSavingNotes(true);
    try {
      await postData(
        `appointments/${appointmentId}/doctor-notes`,
        {
          doctorNotes: doctorNotesInput,
          patientNotes: currentPatientNotes || ""
        },
        { Authorization: `Bearer ${accessToken}` },
        "PATCH"
      );
      addToast("Notes saved successfully", "success");
      setEditingNotesFor(null);
      setDoctorNotesInput("");
      handleRefresh();
    } catch (error) {
      console.error("Failed to save notes:", error);
      addToast("Failed to save notes", "error");
    } finally {
      setSavingNotes(false);
    }
  };

  // Check if appointment can be joined (within 15 mins before start time)
  const canJoinMeeting = (appointment) => {
    if (!appointment.googleMeetLink) return false;
    const status = appointment.status?.toUpperCase();
    if (status !== "CONFIRMED") return false;

    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.startTime}`);
    const endDateTime = new Date(`${appointment.appointmentDate}T${appointment.endTime}`);
    const joinableFrom = new Date(appointmentDateTime.getTime() - 15 * 60 * 1000);

    return now >= joinableFrom && now <= endDateTime;
  };

  const getMeetingTooltip = (appointment) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.startTime}`);
    const endDateTime = new Date(`${appointment.appointmentDate}T${appointment.endTime}`);
    const joinableFrom = new Date(appointmentDateTime.getTime() - 15 * 60 * 1000);

    if (now < joinableFrom) {
      const joinDateTime = joinableFrom.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      return `You can join 15 minutes before the appointment. Join available at ${joinDateTime}`;
    }
    if (now > endDateTime) {
      return "This appointment has ended";
    }
    return "Click to join the meeting";
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">My Appointments</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and view your scheduled appointments</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 -mb-px">
          {[
            { key: "upcoming", label: "Upcoming", count: counts.upcoming },
            { key: "completed", label: "Completed", count: counts.completed },
            { key: "cancelled", label: "Cancelled", count: counts.cancelled },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              disabled={loading}
              className={`py-3 px-1 border-b-2 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.key ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No {activeTab} appointments</h3>
          <p className="text-sm text-gray-500">
            {activeTab === "upcoming" ? "Book an appointment to get started" : `You don't have any ${activeTab} appointments`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden border-l-4 ${getServiceColor(appointment.serviceSlug)}`}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left: Appointment Details */}
                  <div className="flex-1 space-y-3">
                    {/* Service & Status */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.serviceTitle}</h3>
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusBadge(appointment.status)}`}>
                        {formatStatus(appointment.status)}
                      </span>
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getPaymentBadge(appointment.paymentStatus)}`}>
                        {formatStatus(appointment.paymentStatus)}
                      </span>
                    </div>

                    {/* Doctor (for patients) or Patient (for doctors) */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm">
                        {isDoctor
                          ? `Patient: ${appointment.patient?.name || appointment.patientName || "N/A"}`
                          : `Dr. ${appointment.doctor?.name}`
                        }
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(appointment.appointmentDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                        <span className="text-gray-400">({appointment.duration} min)</span>
                      </div>
                    </div>

                    {/* Patient Notes */}
                    {appointment.patientNotes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-500 mb-1">Your Notes</p>
                        <p className="text-sm text-gray-700">{appointment.patientNotes}</p>
                      </div>
                    )}

                    {/* Doctor Notes (display for patients) */}
                    {appointment.doctorNotes && !isDoctor && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-md">
                        <p className="text-xs text-blue-600 mb-1">Doctor's Notes</p>
                        <p className="text-sm text-gray-700">{appointment.doctorNotes}</p>
                      </div>
                    )}

                    {/* Doctor Notes Edit (for doctors) */}
                    {isDoctor && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-blue-600 font-medium">Doctor's Notes</p>
                          {editingNotesFor !== appointment.id && (
                            <button
                              onClick={() => {
                                setEditingNotesFor(appointment.id);
                                setDoctorNotesInput(appointment.doctorNotes || "");
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              {appointment.doctorNotes ? "Edit" : "Add Notes"}
                            </button>
                          )}
                        </div>
                        {editingNotesFor === appointment.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={doctorNotesInput}
                              onChange={(e) => setDoctorNotesInput(e.target.value)}
                              placeholder="Add notes about this consultation..."
                              rows={3}
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingNotesFor(null);
                                  setDoctorNotesInput("");
                                }}
                                disabled={savingNotes}
                                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveDoctorNotes(appointment.id, appointment.patientNotes)}
                                disabled={savingNotes}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                              >
                                {savingNotes ? "Saving..." : "Save Notes"}
                              </button>
                            </div>
                          </div>
                        ) : appointment.doctorNotes ? (
                          <p className="text-sm text-gray-700">{appointment.doctorNotes}</p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No notes added yet</p>
                        )}
                      </div>
                    )}

                    {/* Attached Reports */}
                    {appointment.reports && appointment.reports.length > 0 && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-md">
                        <p className="text-xs text-purple-600 mb-2">Attached Reports ({appointment.reports.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {appointment.reports.map((report) => (
                            <div
                              key={report.id}
                              className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-purple-200 text-xs text-purple-700"
                            >
                              <a
                                href={`/preview?url=img/user-reports/${report.fileName}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 hover:text-purple-900 transition"
                              >
                                {getFileIcon(report.fileName)}
                                <span className="truncate max-w-[120px]">{report.title || report.category || report.fileName}</span>
                              </a>
                              {/* Remove button - only for patients/parents, not doctors */}
                              {!isDoctor && appointment.status?.toUpperCase() !== "CANCELLED" && (
                                <button
                                  onClick={() => handleRemoveReport(appointment.id, report.id, appointment.reports)}
                                  className="ml-1 p-0.5 hover:bg-red-100 rounded text-gray-400 hover:text-red-600 transition"
                                  title="Remove report"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cancellation Reason */}
                    {appointment.status?.toUpperCase() === "CANCELLED" && appointment.cancellationReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md">
                        <p className="text-xs text-red-600 mb-1">Cancellation Reason</p>
                        <p className="text-sm text-gray-700">{appointment.cancellationReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Price & Actions */}
                  <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    {/* Price */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {appointment.currency} {appointment.amount?.toFixed(2)}
                      </p>
                    </div>

                    {/* Join Meeting Button */}
                    {appointment.googleMeetLink && appointment.status?.toUpperCase() === "CONFIRMED" && (
                      <div className="relative group">
                        <a
                          href={canJoinMeeting(appointment) ? appointment.googleMeetLink : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => !canJoinMeeting(appointment) && e.preventDefault()}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                            canJoinMeeting(appointment)
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-gray-100 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          {canJoinMeeting(appointment) ? "Join Meeting" : "Meeting Link"}
                        </a>
                        {/* Tooltip */}
                        <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-56 text-center z-10">
                          {getMeetingTooltip(appointment)}
                          <div className="absolute bottom-full right-4 border-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                    )}

                    {/* Attach Documents Button - Only for patients/parents, not for doctors */}
                    {!isDoctor && appointment.status?.toUpperCase() !== "CANCELLED" && (
                      <button
                        onClick={() => openDocumentModal(appointment)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        Attach Documents
                      </button>
                    )}

                    {/* Reschedule & Cancel - Only for CONFIRMED appointments */}
                    {appointment.status?.toUpperCase() === "CONFIRMED" && (
                      <>
                        {/* Reschedule Button - Only for patients/parents, not for doctors */}
                        {!isDoctor && (
                          <button
                            onClick={() => openRescheduleModal(appointment)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Reschedule
                          </button>
                        )}

                        {/* Cancel Button */}
                        <button
                          onClick={() => openCancelModal(appointment)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      </>
                    )}

                    {/* Appointment ID */}
                    <p className="text-xs text-gray-400">ID: #{appointment.id}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {pagination.page * pagination.size + 1} to{" "}
            {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{" "}
            {pagination.totalElements} appointments
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0 || loading}
              className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-sm">
              Page {pagination.page + 1} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1 || loading}
              className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {(counts.upcoming > 0 || counts.completed > 0 || counts.cancelled > 0) && (
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{counts.upcoming}</p>
            <p className="text-xs text-gray-500">Upcoming</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{counts.completed}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{counts.cancelled}</p>
            <p className="text-xs text-gray-500">Cancelled</p>
          </div>
        </div>
      )}

      {/* Document Attachment Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Attach Documents</h3>
                <p className="text-sm text-gray-500">Select documents from My Documents</p>
              </div>
              <button
                onClick={() => {
                  setShowDocumentModal(false);
                  setSelectedAppointment(null);
                  setSelectedDocuments([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {documentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 mb-2">No documents found</p>
                  <a href="/dashboard/my-documents" className="text-primary text-sm hover:underline">
                    Go to My Documents to upload
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <label
                      key={doc.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                        selectedDocuments.includes(doc.id)
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={() => toggleDocumentSelection(doc.id)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.fileName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.title || doc.fileName || "Untitled Document"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doc.category || doc.type || "Document"}
                        </p>
                      </div>
                      {doc.fileName && (
                        <a
                          href={`/preview?url=img/user-reports/${doc.fileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-primary p-1"
                          title="Preview"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <p className="text-sm text-gray-600">
                {selectedDocuments.length} document{selectedDocuments.length !== 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDocumentModal(false);
                    setSelectedAppointment(null);
                    setSelectedDocuments([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAttachDocuments}
                  disabled={selectedDocuments.length === 0 || attachingDocuments}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-light transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {attachingDocuments ? "Attaching..." : "Attach Selected"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && appointmentToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
            {/* Show Refund Result */}
            {cancellationResult ? (
              <>
                <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Appointment Cancelled</h3>
                      <p className="text-sm text-gray-600">Your refund is being processed</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600 mb-2">
                      {appointmentToCancel.currency || "AED"} {cancellationResult.refundAmount?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {cancellationResult.refundPercentage}% refund
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4 text-left">
                      <p className="text-sm text-blue-800 font-medium mb-1">Refund Timeline</p>
                      <p className="text-sm text-blue-700">
                        Your refund will be processed within 7-14 business days to your original payment method.
                      </p>
                      {cancellationResult.stripeRefundId && (
                        <p className="text-xs text-blue-600 mt-2">
                          Refund ID: {cancellationResult.stripeRefundId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={closeCancelModal}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-light transition"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Cancel Appointment</h3>
                      <p className="text-sm text-gray-600">This action cannot be undone</p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Appointment Details</p>
                    <p className="font-medium text-gray-900">{appointmentToCancel.serviceTitle}</p>
                    <p className="text-sm text-gray-600">
                      {isDoctor
                        ? `Patient: ${appointmentToCancel.patient?.name || appointmentToCancel.patientName || "N/A"}`
                        : `Dr. ${appointmentToCancel.doctor?.name}`
                      } • {formatDate(appointmentToCancel.appointmentDate)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatTime(appointmentToCancel.startTime)} - {formatTime(appointmentToCancel.endTime)}
                    </p>
                  </div>

                  {/* Refund Preview - Only show for patients, not doctors */}
                  {!isDoctor && (() => {
                    const refundInfo = getCancellationRefundInfo(appointmentToCancel);
                    const colorClasses = {
                      green: "bg-green-50 border-green-200 text-green-800",
                      amber: "bg-amber-50 border-amber-200 text-amber-800",
                      red: "bg-red-50 border-red-200 text-red-800"
                    };
                    return (
                      <div className={`mb-4 p-4 rounded-lg border ${colorClasses[refundInfo.color]}`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">Refund Estimate</p>
                          <span className="text-lg font-bold">
                            {appointmentToCancel.currency || "AED"} {refundInfo.refundAmount.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm opacity-90">{refundInfo.message}</p>
                        {refundInfo.deductionAmount > 0 && (
                          <p className="text-xs mt-2 opacity-75">
                            Deduction: {appointmentToCancel.currency || "AED"} {refundInfo.deductionAmount.toFixed(2)} ({100 - refundInfo.refundPercentage}%)
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for cancellation (optional)
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Let us know why you're cancelling..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                  <button
                    onClick={closeCancelModal}
                    disabled={cancelling}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Keep Appointment
                  </button>
                  <button
                    onClick={handleCancelAppointment}
                    disabled={cancelling}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {cancelling ? "Cancelling..." : "Cancel Appointment"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Reschedule Appointment Modal */}
      {showRescheduleModal && appointmentToReschedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h3>
                    <p className="text-sm text-gray-600">Select a new date and time</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setAppointmentToReschedule(null);
                    setSelectedRescheduleDate("");
                    setSelectedRescheduleSlot(null);
                    setRescheduleReason("");
                  }}
                  className="p-2 hover:bg-blue-100 rounded-full transition"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Current Appointment Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Current Appointment</p>
                <p className="font-medium text-gray-900">{appointmentToReschedule.serviceTitle}</p>
                <p className="text-sm text-gray-600">
                  Dr. {appointmentToReschedule.doctor?.name} • {formatDate(appointmentToReschedule.appointmentDate)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatTime(appointmentToReschedule.startTime)} - {formatTime(appointmentToReschedule.endTime)}
                </p>
              </div>

              {/* Penalty Warning */}
              {(() => {
                const penalty = getReschedulePenaltyInfo(appointmentToReschedule);
                if (!penalty.allowed) {
                  return (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="font-medium text-red-800">Cannot Reschedule</p>
                          <p className="text-sm text-red-700">{penalty.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                } else if (penalty.percentage > 0) {
                  return (
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="font-medium text-amber-800">Penalty Fee Applies</p>
                          <p className="text-sm text-amber-700">{penalty.message}</p>
                          <p className="text-sm text-amber-700 mt-1">
                            Estimated fee: {appointmentToReschedule.currency || "AED"} {((appointmentToReschedule.amount || 0) * penalty.percentage / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="font-medium text-green-800">Free Rescheduling</p>
                          <p className="text-sm text-green-700">{penalty.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              })()}

              {/* Slots Loading */}
              {slotsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : Object.keys(availableSlots).length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 mb-2">No available slots found</p>
                  <p className="text-sm text-gray-400">The doctor has no available slots for rescheduling</p>
                </div>
              ) : (
                <>
                  {/* Date Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select New Date</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(availableSlots).sort().slice(0, 14).map((date) => (
                        <button
                          key={date}
                          onClick={() => {
                            setSelectedRescheduleDate(date);
                            setSelectedRescheduleSlot(null);
                          }}
                          className={`px-3 py-2 text-sm rounded-lg border transition ${
                            selectedRescheduleDate === date
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5"
                          }`}
                        >
                          {new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  {selectedRescheduleDate && availableSlots[selectedRescheduleDate] && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select New Time</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots[selectedRescheduleDate].map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedRescheduleSlot(slot)}
                            className={`px-3 py-2 text-sm rounded-lg border transition ${
                              selectedRescheduleSlot?.id === slot.id
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5"
                            }`}
                          >
                            {formatTime(slot.startTime)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reason Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for rescheduling
                    </label>
                    <textarea
                      value={rescheduleReason}
                      onChange={(e) => setRescheduleReason(e.target.value)}
                      placeholder="Let us know why you're rescheduling..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setAppointmentToReschedule(null);
                  setSelectedRescheduleDate("");
                  setSelectedRescheduleSlot(null);
                  setRescheduleReason("");
                  setPenaltyInfo(null);
                }}
                disabled={rescheduling}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={rescheduling || !selectedRescheduleSlot || !getReschedulePenaltyInfo(appointmentToReschedule).allowed}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-light transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rescheduling ? "Rescheduling..." : "Confirm Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentRoom;
