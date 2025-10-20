"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SessionCleaner({ shouldClear }) {
  useEffect(() => {
    if (shouldClear) {
      // Clear the session without redirecting (we're already on login page)
      signOut({ redirect: false });
    }
  }, [shouldClear]);

  return null;
}
