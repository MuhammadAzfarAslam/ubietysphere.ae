"use client";
import { SessionProvider } from "next-auth/react";
import BookingForm from "./BookingForm";

const BookingFormWrapper = ({ doctorName }) => {
  return (
    <SessionProvider>
      <BookingForm doctorName={doctorName} />
    </SessionProvider>
  );
};

export default BookingFormWrapper;
