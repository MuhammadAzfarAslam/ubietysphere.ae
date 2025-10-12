"use client";
import { SessionProvider } from "next-auth/react";
import BookingForm from "./BookingForm";

const BookingFormWrapper = ({ doctorName }) => {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <BookingForm doctorName={doctorName} />
    </SessionProvider>
  );
};

export default BookingFormWrapper;
