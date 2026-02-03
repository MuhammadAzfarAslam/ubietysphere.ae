"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import getData, { postData } from "@/utils/getData";
import FormButton from "../button/FormButton";
import { useToast } from "../toaster/ToastContext";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Validation Schema
const createSchema = (isLoggedIn) =>
  yup.object({
    name: yup.string().required("Name is required"),
    email: isLoggedIn
      ? yup.string().email("Please enter a valid email address")
      : yup.string().email("Please enter a valid email address").required("Email is required"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must be digits only"),
    file: yup.mixed(),
    message: yup.string().required("Message is required"),
  });

// Payment Form Component
const PaymentFormContent = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/appointments`,
        },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess();
      } else {
        onError("Payment was not successful. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      onError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: "tabs" }} />
      <FormButton additionalClass="w-full" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay Now"}
      </FormButton>
      <p className="text-xs text-gray-500 text-center">Your payment is secured by Stripe</p>
    </form>
  );
};

const BookingForm = ({
  doctorName = null,
  doctorId = null,
  doctors = [],
  serviceSlug = null,
  serviceTitle = null,
}) => {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const isLoggedIn = !!session?.user?.name;
  const accessToken = session?.accessToken;

  // Form state
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(createSchema(isLoggedIn)) });

  // Auto-fill name and phone from session when logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) {
        setValue("name", session.user.name);
      }
      if (session.user.phone || session.user.mobileNumber) {
        setValue("phone", session.user.phone || session.user.mobileNumber);
      }
    }
  }, [session, setValue]);

  // Slot selection state
  const [selectedDoctor, setSelectedDoctor] = useState(
    doctorId ? { id: doctorId, name: doctorName } : null
  );
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Booking flow state
  const [step, setStep] = useState("select"); // "select" | "payment" | "success"
  const [appointment, setAppointment] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({ amount: null, currency: "AED" });

  // Format date for display
  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
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

  // Fetch available slots
  const fetchSlots = useCallback(async () => {
    if (!selectedDoctor?.id || !serviceSlug) return;
    setLoading(true);
    try {
      const response = await getData(
        `doctor/slots/available?doctorId=${selectedDoctor.id}&serviceSlug=${serviceSlug}`
      );
      setSlots(response?.data || {});
    } catch (error) {
      console.error("Failed to fetch slots:", error);
      setSlots({});
    } finally {
      setLoading(false);
    }
  }, [selectedDoctor?.id, serviceSlug]);

  useEffect(() => {
    if (selectedDoctor?.id && serviceSlug) {
      fetchSlots();
    }
  }, [selectedDoctor?.id, serviceSlug, fetchSlots]);

  useEffect(() => {
    if (doctorId) {
      setSelectedDoctor({ id: doctorId, name: doctorName });
    }
  }, [doctorId, doctorName]);

  // Get available dates (dates that have slots)
  const availableDates = useMemo(() => {
    return Object.keys(slots).filter((dateKey) => {
      const daySlots = slots[dateKey] || [];
      return daySlots.some((s) => s.status === "Available");
    }).sort();
  }, [slots]);

  // Get slots for selected date
  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return (slots[selectedDate] || []).filter((s) => s.status === "Available");
  }, [slots, selectedDate]);

  const handleDoctorChange = (e) => {
    const id = parseInt(e.target.value);
    const doc = doctors.find((d) => d.id === id);
    setSelectedDoctor(doc ? { id: doc.id, name: `${doc.firstName} ${doc.lastName}` } : null);
    setSelectedDate("");
    setSelectedSlot(null);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null);
  };

  const handleTimeChange = (e) => {
    const slotId = parseInt(e.target.value);
    const slot = slotsForSelectedDate.find((s) => s.id === slotId);
    setSelectedSlot(slot || null);
  };

  const onSubmit = async (formData) => {
    if (!selectedSlot || !accessToken) {
      addToast("Please select a date and time slot", "error");
      return;
    }

    setLoading(true);
    try {
      // Create appointment
      const appointmentRes = await postData(
        "appointments",
        {
          doctorSlotId: selectedSlot.id,
          patientNotes: formData.message || null,
        },
        { Authorization: `Bearer ${accessToken}` }
      );

      if (!appointmentRes?.data?.id) {
        throw new Error("Failed to create appointment");
      }

      setAppointment(appointmentRes.data);

      // Create payment intent
      const paymentRes = await postData(
        `appointments/${appointmentRes.data.id}/payment`,
        {},
        { Authorization: `Bearer ${accessToken}` }
      );

      if (!paymentRes?.data?.clientSecret) {
        throw new Error("Failed to create payment");
      }

      setClientSecret(paymentRes.data.clientSecret);
      setPaymentInfo({
        amount: paymentRes.data.price,
        currency: paymentRes.data.currency || "AED",
      });
      setStep("payment");
    } catch (error) {
      console.error("Booking failed:", error);
      addToast(error.message || "Failed to create booking. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setStep("success");
    addToast("Payment successful! Your appointment is confirmed.", "success");
    reset();
  };

  const handlePaymentError = (error) => {
    addToast(error || "Payment failed. Please try again.", "error");
  };

  // Success View
  if (step === "success") {
    return (
      <div className="mt-4 text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Appointment Confirmed!</h3>
        <p className="text-gray-600 mb-2">
          Your appointment with {selectedDoctor?.name} has been booked.
        </p>
        <p className="text-gray-600 mb-4">
          Check your appointment inside your{" "}
          <a href="/dashboard/appointment-room" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
            Appointment Room
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </p>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden max-w-sm mx-auto text-left">
          <div className="px-4 py-3" style={{ backgroundColor: 'var(--color-yellow-500)' }}>
            <h4 className="text-white font-semibold">Your Appointment</h4>
          </div>
          <div className="p-4 space-y-3">
            {selectedDoctor && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Doctor</p>
                  <p className="text-sm font-medium text-gray-900">{selectedDoctor.name}</p>
                </div>
              </div>
            )}
            {serviceTitle && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Service</p>
                  <p className="text-sm font-medium text-gray-900">{serviceTitle}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDisplayDate(selectedDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Time & Duration</p>
                <p className="text-sm font-medium text-gray-900">{formatTime(selectedSlot?.startTime)} ({selectedSlot?.duration} min)</p>
              </div>
            </div>
            {appointment?.googleMeetLink && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Meeting Link</p>
                  <a
                    href={appointment.googleMeetLink}
                    className="text-sm font-medium text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Google Meet
                  </a>
                </div>
              </div>
            )}
            {selectedSlot?.price && (
              <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Paid</span>
                <span className="text-lg font-bold text-primary">AED {selectedSlot.price}</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    );
  }

  // Payment View
  if (step === "payment" && clientSecret) {
    return (
      <div className="mt-4 py-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Payment</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            <strong>Doctor:</strong> {selectedDoctor?.name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Service:</strong> {serviceTitle}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Date:</strong> {selectedDate && formatDisplayDate(selectedDate)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Time:</strong> {selectedSlot && formatTime(selectedSlot.startTime)} (
            {selectedSlot?.duration} min)
          </p>
          {paymentInfo.amount && (
            <p className="text-lg font-semibold text-primary mt-2">
              Total: {paymentInfo.currency} {paymentInfo.amount}
            </p>
          )}
        </div>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentFormContent onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
        </Elements>
        <button
          onClick={() => setStep("select")}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to slot selection
        </button>
      </div>
    );
  }

  // Main Form View - Same UI as original
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name*</label>
          <input
            type="text"
            placeholder="Enter your Name"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:primary"
            {...register("name")}
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>

        {/* Email - Only show if not logged in */}
        {!isLoggedIn && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Email*</label>
            <input
              type="email"
              placeholder="Enter your Email"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:primary"
              {...register("email")}
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>
        )}

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
          <input
            type="text"
            placeholder="Enter your Phone Number"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:primary"
            {...register("phone")}
          />
          <p className="text-red-500 text-sm">{errors.phone?.message}</p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload File</label>
          <input
            type="file"
            className="mt-1 block w-full text-sm text-gray-700 px-3 py-3.5 border border-gray-300 rounded-sm shadow-sm"
            {...register("file")}
          />
          <p className="text-red-500 text-sm">{errors.file?.message}</p>
        </div>

        {/* Doctor Dropdown (only if not pre-selected) */}
        {!doctorId && doctors.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Choose Doctor*</label>
            <select
              value={selectedDoctor?.id || ""}
              onChange={handleDoctorChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:primary"
            >
              <option value="">Select a doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.firstName} {doc.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date - Now shows available dates from slots */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date*</label>
          {selectedDoctor && serviceSlug ? (
            <select
              value={selectedDate}
              onChange={handleDateChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:primary"
              disabled={loading || availableDates.length === 0}
            >
              <option value="">
                {loading ? "Loading..." : availableDates.length === 0 ? "No available dates" : "Select a date"}
              </option>
              {availableDates.map((dateKey) => (
                <option key={dateKey} value={dateKey}>
                  {formatDisplayDate(dateKey)}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="date"
              disabled
              placeholder="Select a doctor first"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:primary bg-gray-100"
            />
          )}
        </div>

        {/* Time - Now shows available time slots */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Time*</label>
          {selectedDate ? (
            <select
              value={selectedSlot?.id || ""}
              onChange={handleTimeChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:primary"
              disabled={slotsForSelectedDate.length === 0}
            >
              <option value="">
                {slotsForSelectedDate.length === 0 ? "No available times" : "Select a time"}
              </option>
              {slotsForSelectedDate.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {formatTime(slot.startTime)} ({slot.duration} min){slot.price ? ` - AED ${slot.price}` : ""}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="time"
              disabled
              placeholder="Select a date first"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:primary bg-gray-100"
            />
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Your health complaint (150)*</label>
        <textarea
          rows="4"
          placeholder="Enter your Message"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:primary"
          {...register("message")}
        />
        <p className="text-red-500 text-sm">{errors.message?.message}</p>
      </div>

      {/* Booking Summary Card */}
      {selectedSlot && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3" style={{ backgroundColor: 'var(--color-yellow-500)' }}>
            <h4 className="text-white font-semibold">Your Appointment</h4>
          </div>
          <div className="p-4 space-y-3">
            {selectedDoctor && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Doctor</p>
                  <p className="text-sm font-medium text-gray-900">{selectedDoctor.name}</p>
                </div>
              </div>
            )}
            {serviceTitle && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Service</p>
                  <p className="text-sm font-medium text-gray-900">{serviceTitle}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDisplayDate(selectedDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Time & Duration</p>
                <p className="text-sm font-medium text-gray-900">{formatTime(selectedSlot.startTime)} ({selectedSlot.duration} min)</p>
              </div>
            </div>
            {selectedSlot.price && (
              <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Amount</span>
                <span className="text-lg font-bold text-primary">AED {selectedSlot.price}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-5">
        <FormButton additionalClass="w-full" disabled={loading || !selectedSlot || !accessToken || isSubmitting}>
          {loading ? "Processing..." : "Book An Appointment"}
        </FormButton>
        {(loading || isSubmitting) && (
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-primary fill-secondary"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        )}
      </div>

      {!accessToken && (
        <p className="text-sm text-center text-red-500">
          Please <a href="/login" className="text-primary hover:underline font-medium">log in</a> to book an appointment.
        </p>
      )}
    </form>
  );
};

export default BookingForm;
