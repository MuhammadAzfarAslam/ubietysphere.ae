"use client";
import React from "react";
import { signOut } from "next-auth/react";

const Logout = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "https://ubietysphere.ae/login" })}
      className="inline-block lg:px-6 px-3 lg:py-3 py-1 bg-red-500 text-white font-medium rounded-sm shadow relative overflow-hidden group border-2 border-transparent hover:border-primary transition lg:mt-0 mt-2"
    >
      <span className="relative z-10 group-hover:text-primary">Logout</span>
      <span className="absolute left-0 top-0 w-full h-full bg-secondary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
    </button>
  );
};

export default Logout;
