"use client";
import React from "react";
import { signOut } from "next-auth/react";

const Logout = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
};

export default Logout;
