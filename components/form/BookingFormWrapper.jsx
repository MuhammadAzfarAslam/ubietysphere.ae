"use client";
import { SessionProvider } from "next-auth/react";
import BookingForm from "./BookingForm";
import { ToastProvider } from "../toaster/ToastContext";

const BookingFormWrapper = ({
  doctorName = null,
  doctorId = null,
  doctors = [],
  serviceSlug = null,
  serviceTitle = null,
}) => {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <ToastProvider>
        <BookingForm
          doctorName={doctorName}
          doctorId={doctorId}
          doctors={doctors}
          serviceSlug={serviceSlug}
          serviceTitle={serviceTitle}
        />
      </ToastProvider>
    </SessionProvider>
  );
};

export default BookingFormWrapper;
