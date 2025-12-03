"use client";
import React, { useState, useMemo } from "react";
import { SERVICE_CONTENT } from "@/utils/serviceContent";
import { useToast } from "@/components/toaster/ToastContext";

// Mock doctor's services - in real app, this would come from API
const DOCTOR_SERVICES = ["second-opinion", "women's-health"];

const DAYS_OF_WEEK = [
  { key: "monday", label: "Mon", fullLabel: "Monday" },
  { key: "tuesday", label: "Tue", fullLabel: "Tuesday" },
  { key: "wednesday", label: "Wed", fullLabel: "Wednesday" },
  { key: "thursday", label: "Thu", fullLabel: "Thursday" },
  { key: "friday", label: "Fri", fullLabel: "Friday" },
  { key: "saturday", label: "Sat", fullLabel: "Saturday" },
  { key: "sunday", label: "Sun", fullLabel: "Sunday" },
];

// Generate time options (00:00 to 23:30 in 30-min intervals)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const h = hour.toString().padStart(2, "0");
      const m = min.toString().padStart(2, "0");
      times.push(`${h}:${m}`);
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

// Format time for display (24h to 12h)
const formatTime = (time24) => {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Get week dates starting from a given date
const getWeekDates = (startDate) => {
  const dates = [];
  const start = new Date(startDate);
  // Adjust to Monday of the week
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Format date for display
const formatDate = (date) => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Format date as key (YYYY-MM-DD)
const formatDateKey = (date) => {
  return date.toISOString().split("T")[0];
};

const Slots = () => {
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState("week"); // "week" or "month"
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slots, setSlots] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Form state for adding slots
  const [formData, setFormData] = useState({
    service: "",
    duration: "",
    startTime: "09:00",
    endTime: "17:00",
    selectedDays: [],
  });

  // Duplicate modal state
  const [duplicateData, setDuplicateData] = useState({
    type: "day", // "day" or "week"
    sourceDate: "",
    targetDate: "",
  });

  // Get doctor's available services with details
  const doctorServices = useMemo(() => {
    return DOCTOR_SERVICES.map((slug) => ({
      ...SERVICE_CONTENT[slug],
      slug,
    })).filter(Boolean);
  }, []);

  // Get available durations for selected service
  const availableDurations = useMemo(() => {
    if (!formData.service) return [];
    const service = SERVICE_CONTENT[formData.service];
    return service?.durations || [];
  }, [formData.service]);

  // Generate slots based on time range and duration
  const generateSlots = (startTime, endTime, duration) => {
    const generatedSlots = [];
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    while (currentMinutes + duration <= endMinutes) {
      const hour = Math.floor(currentMinutes / 60);
      const min = currentMinutes % 60;
      const slotStart = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;

      const endSlotMinutes = currentMinutes + duration;
      const endSlotHour = Math.floor(endSlotMinutes / 60);
      const endSlotMin = endSlotMinutes % 60;
      const slotEnd = `${endSlotHour.toString().padStart(2, "0")}:${endSlotMin.toString().padStart(2, "0")}`;

      generatedSlots.push({
        id: `${Date.now()}-${currentMinutes}`,
        startTime: slotStart,
        endTime: slotEnd,
        duration,
      });

      currentMinutes += duration;
    }

    return generatedSlots;
  };

  // Check for slot conflicts
  const hasConflict = (dateKey, newSlot) => {
    const daySlots = slots[dateKey] || [];
    const newStart = parseInt(newSlot.startTime.replace(":", ""));
    const newEnd = parseInt(newSlot.endTime.replace(":", ""));

    return daySlots.some((existingSlot) => {
      const existStart = parseInt(existingSlot.startTime.replace(":", ""));
      const existEnd = parseInt(existingSlot.endTime.replace(":", ""));
      return newStart < existEnd && newEnd > existStart;
    });
  };

  // Handle adding slots
  const handleAddSlots = () => {
    if (!formData.service || !formData.duration) {
      addToast("Please select a service and duration", "error");
      return;
    }

    if (formData.selectedDays.length === 0 && !selectedDate) {
      addToast("Please select at least one day", "error");
      return;
    }

    const newSlots = generateSlots(
      formData.startTime,
      formData.endTime,
      parseInt(formData.duration)
    );

    if (newSlots.length === 0) {
      addToast("No slots could be generated with the selected time range", "error");
      return;
    }

    const weekDates = getWeekDates(currentDate);
    const daysToAdd = selectedDate
      ? [selectedDate]
      : formData.selectedDays.map((dayIndex) => formatDateKey(weekDates[dayIndex]));

    let conflictFound = false;
    const updatedSlots = { ...slots };

    daysToAdd.forEach((dateKey) => {
      newSlots.forEach((slot) => {
        const slotWithService = {
          ...slot,
          id: `${dateKey}-${slot.startTime}-${formData.service}`,
          service: formData.service,
          serviceTitle: SERVICE_CONTENT[formData.service]?.title,
        };

        if (hasConflict(dateKey, slotWithService)) {
          conflictFound = true;
        } else {
          if (!updatedSlots[dateKey]) {
            updatedSlots[dateKey] = [];
          }
          updatedSlots[dateKey].push(slotWithService);
        }
      });
    });

    if (conflictFound) {
      addToast("Some slots were skipped due to conflicts", "warning");
    }

    // Sort slots by time
    Object.keys(updatedSlots).forEach((key) => {
      updatedSlots[key].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    setSlots(updatedSlots);
    setShowAddModal(false);
    setSelectedDate(null);
    setFormData({
      service: "",
      duration: "",
      startTime: "09:00",
      endTime: "17:00",
      selectedDays: [],
    });
    addToast("Slots added successfully!", "success");
  };

  // Handle deleting a slot
  const handleDeleteSlot = (dateKey, slotId) => {
    const updatedSlots = { ...slots };
    updatedSlots[dateKey] = updatedSlots[dateKey].filter((s) => s.id !== slotId);
    if (updatedSlots[dateKey].length === 0) {
      delete updatedSlots[dateKey];
    }
    setSlots(updatedSlots);
    addToast("Slot deleted", "success");
  };

  // Handle duplicate
  const handleDuplicate = () => {
    if (!duplicateData.sourceDate || !duplicateData.targetDate) {
      addToast("Please select source and target dates", "error");
      return;
    }

    const updatedSlots = { ...slots };

    if (duplicateData.type === "day") {
      const sourceSlots = slots[duplicateData.sourceDate] || [];
      if (sourceSlots.length === 0) {
        addToast("No slots found on source date", "error");
        return;
      }

      const newSlots = sourceSlots.map((slot) => ({
        ...slot,
        id: `${duplicateData.targetDate}-${slot.startTime}-${slot.service}`,
      }));

      updatedSlots[duplicateData.targetDate] = [
        ...(updatedSlots[duplicateData.targetDate] || []),
        ...newSlots,
      ];
    } else {
      // Duplicate week
      const sourceWeekDates = getWeekDates(new Date(duplicateData.sourceDate));
      const targetWeekDates = getWeekDates(new Date(duplicateData.targetDate));

      sourceWeekDates.forEach((sourceDate, index) => {
        const sourceDateKey = formatDateKey(sourceDate);
        const targetDateKey = formatDateKey(targetWeekDates[index]);
        const sourceSlots = slots[sourceDateKey] || [];

        if (sourceSlots.length > 0) {
          const newSlots = sourceSlots.map((slot) => ({
            ...slot,
            id: `${targetDateKey}-${slot.startTime}-${slot.service}`,
          }));

          updatedSlots[targetDateKey] = [
            ...(updatedSlots[targetDateKey] || []),
            ...newSlots,
          ];
        }
      });
    }

    // Sort slots
    Object.keys(updatedSlots).forEach((key) => {
      updatedSlots[key].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    setSlots(updatedSlots);
    setShowDuplicateModal(false);
    setDuplicateData({ type: "day", sourceDate: "", targetDate: "" });
    addToast("Slots duplicated successfully!", "success");
  };

  // Navigate weeks/months
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get calendar data for month view
  const getMonthCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = (firstDay.getDay() + 6) % 7; // Adjust for Monday start

    const days = [];

    // Add padding for days before month starts
    for (let i = 0; i < startPadding; i++) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - (startPadding - i));
      days.push({ date, isCurrentMonth: false });
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Add padding to complete the last week
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const date = new Date(lastDay);
        date.setDate(date.getDate() + i);
        days.push({ date, isCurrentMonth: false });
      }
    }

    return days;
  };

  const weekDates = getWeekDates(currentDate);
  const monthDays = getMonthCalendarData();

  // Get service color
  const getServiceColor = (serviceSlug) => {
    const colors = {
      "second-opinion": "bg-blue-100 text-blue-800 border-blue-200",
      "women's-health": "bg-pink-100 text-pink-800 border-pink-200",
      "expert-medical-consultation": "bg-green-100 text-green-800 border-green-200",
      "mental-health-counseling": "bg-purple-100 text-purple-800 border-purple-200",
      "holistic-health-counseling": "bg-teal-100 text-teal-800 border-teal-200",
      "lifestyle-management-and-coaching": "bg-orange-100 text-orange-800 border-orange-200",
      "nutrition-and-dietetics-counseling": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "children's-health": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "genetic-counselor": "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return colors[serviceSlug] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">My Slots</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowDuplicateModal(true)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
          >
            Duplicate Slots
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition text-sm"
          >
            + Add Slots
          </button>
        </div>
      </div>

      {/* View Toggle & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={navigatePrevious}
            className="p-2 hover:bg-gray-200 rounded-md transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-white border rounded-md hover:bg-gray-50 transition"
          >
            Today
          </button>
          <button
            onClick={navigateNext}
            className="p-2 hover:bg-gray-200 rounded-md transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="ml-2 font-medium">
            {viewMode === "week"
              ? `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}, ${weekDates[0].getFullYear()}`
              : currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>
        <div className="flex rounded-md overflow-hidden border">
          <button
            onClick={() => setViewMode("week")}
            className={`px-4 py-2 text-sm transition ${
              viewMode === "week" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`px-4 py-2 text-sm transition ${
              viewMode === "month" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Service Legend */}
      <div className="flex flex-wrap gap-2">
        {doctorServices.map((service) => (
          <span
            key={service.slug}
            className={`px-3 py-1 text-xs rounded-full border ${getServiceColor(service.slug)}`}
          >
            {service.title}
          </span>
        ))}
      </div>

      {/* Week View */}
      {viewMode === "week" && (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDates.map((date, index) => {
                const isToday = formatDateKey(date) === formatDateKey(new Date());
                return (
                  <div
                    key={index}
                    className={`text-center p-2 rounded-t-lg ${
                      isToday ? "bg-primary text-white" : "bg-gray-100"
                    }`}
                  >
                    <div className="font-medium">{DAYS_OF_WEEK[index].label}</div>
                    <div className="text-sm">{formatDate(date)}</div>
                  </div>
                );
              })}
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, dayIndex) => {
                const dateKey = formatDateKey(date);
                const daySlots = slots[dateKey] || [];

                return (
                  <div
                    key={dayIndex}
                    className="min-h-[300px] bg-gray-50 rounded-b-lg p-2 border border-gray-200"
                  >
                    <button
                      onClick={() => {
                        setSelectedDate(dateKey);
                        setShowAddModal(true);
                      }}
                      className="w-full mb-2 py-1 text-xs text-gray-500 hover:text-primary hover:bg-gray-100 rounded transition"
                    >
                      + Add
                    </button>

                    <div className="space-y-1">
                      {daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-2 rounded border text-xs ${getServiceColor(slot.service)} group relative`}
                        >
                          <div className="font-medium">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </div>
                          <div className="truncate">{slot.serviceTitle}</div>
                          <div className="text-[10px] opacity-70">{slot.duration} min</div>
                          <button
                            onClick={() => handleDeleteSlot(dateKey, slot.id)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-200 rounded transition"
                          >
                            <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Month View */}
      {viewMode === "month" && (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.key} className="text-center p-2 bg-gray-100 font-medium text-sm">
                  {day.label}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((dayData, index) => {
                const dateKey = formatDateKey(dayData.date);
                const daySlots = slots[dateKey] || [];
                const isToday = dateKey === formatDateKey(new Date());

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-1 border rounded ${
                      dayData.isCurrentMonth ? "bg-white" : "bg-gray-50"
                    } ${isToday ? "border-primary border-2" : "border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm ${
                          dayData.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                        } ${isToday ? "font-bold text-primary" : ""}`}
                      >
                        {dayData.date.getDate()}
                      </span>
                      {dayData.isCurrentMonth && (
                        <button
                          onClick={() => {
                            setSelectedDate(dateKey);
                            setShowAddModal(true);
                          }}
                          className="text-xs text-gray-400 hover:text-primary"
                        >
                          +
                        </button>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      {daySlots.slice(0, 3).map((slot) => (
                        <div
                          key={slot.id}
                          className={`px-1 py-0.5 rounded text-[10px] truncate ${getServiceColor(slot.service)}`}
                          title={`${slot.serviceTitle} - ${formatTime(slot.startTime)}`}
                        >
                          {formatTime(slot.startTime)}
                        </div>
                      ))}
                      {daySlots.length > 3 && (
                        <div className="text-[10px] text-gray-500 text-center">
                          +{daySlots.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Slots Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedDate
                    ? `Add Slots for ${new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}`
                    : "Add Slots"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedDate(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value, duration: "" })
                    }
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select Service</option>
                    {doctorServices.map((service) => (
                      <option key={service.slug} value={service.slug}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    disabled={!formData.service}
                  >
                    <option value="">Select Duration</option>
                    {availableDurations.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration} minutes
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <select
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {formatTime(time)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <select
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {formatTime(time)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Day Selection (only when not selecting specific date) */}
                {!selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day, index) => (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => {
                            const newDays = formData.selectedDays.includes(index)
                              ? formData.selectedDays.filter((d) => d !== index)
                              : [...formData.selectedDays, index];
                            setFormData({ ...formData, selectedDays: newDays });
                          }}
                          className={`px-3 py-1 rounded-md text-sm transition ${
                            formData.selectedDays.includes(index)
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview */}
                {formData.service && formData.duration && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      This will create{" "}
                      <strong>
                        {generateSlots(
                          formData.startTime,
                          formData.endTime,
                          parseInt(formData.duration)
                        ).length}
                      </strong>{" "}
                      slots of {formData.duration} minutes each
                      {!selectedDate && formData.selectedDays.length > 0 && (
                        <> for {formData.selectedDays.length} day(s)</>
                      )}
                      .
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedDate(null);
                    }}
                    className="flex-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSlots}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition"
                  >
                    Add Slots
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Duplicate Slots</h3>
                <button
                  onClick={() => setShowDuplicateModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Duplicate Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duplicate Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDuplicateData({ ...duplicateData, type: "day" })}
                      className={`flex-1 px-4 py-2 rounded-md text-sm transition ${
                        duplicateData.type === "day"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Copy Day
                    </button>
                    <button
                      type="button"
                      onClick={() => setDuplicateData({ ...duplicateData, type: "week" })}
                      className={`flex-1 px-4 py-2 rounded-md text-sm transition ${
                        duplicateData.type === "week"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Copy Week
                    </button>
                  </div>
                </div>

                {/* Source Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {duplicateData.type === "day" ? "Source Date" : "Source Week (any day in week)"}
                  </label>
                  <input
                    type="date"
                    value={duplicateData.sourceDate}
                    onChange={(e) =>
                      setDuplicateData({ ...duplicateData, sourceDate: e.target.value })
                    }
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Target Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {duplicateData.type === "day" ? "Target Date" : "Target Week (any day in week)"}
                  </label>
                  <input
                    type="date"
                    value={duplicateData.targetDate}
                    onChange={(e) =>
                      setDuplicateData({ ...duplicateData, targetDate: e.target.value })
                    }
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowDuplicateModal(false)}
                    className="flex-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition"
                  >
                    Duplicate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slots;
