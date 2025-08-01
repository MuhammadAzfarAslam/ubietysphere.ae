import React from "react";
import Login from "@/components/form/Login";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    // User is already logged in, redirect (e.g., to dashboard)
    redirect('/dashboard');
  }

  return (
    <div className="bg-secondary lg:py-8 relative lg:h-[calc(100vh-100px)]">
      <div className="absolute inset-0 bg-white opacity-90 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto lg:px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:flex">
          <div
            className="lg:w-1/2 w-full lg:bg-cover bg-top-center lg:h-[calc(100vh-170px)] h-[calc(100vh-98px)]"
            style={{
              backgroundImage: "url(https://ubietysphere.ae/assets/images/asclepius2.JPG)",
            }}
          >
            <div className="h-full flex items-center justify-center"></div>
          </div>

          <div className="lg:w-1/2 w-full lg:bg-white backdrop-blur-[4px] shadow-lg py-8 lg:px-20 px-4 flex flex-col justify-center lg:relative absolute inset-0">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Login
            </h2>
            <Login />

            <div className="mt-4 text-center">
              <Link href="/forgot-password" className="text-sm text-primary hover:text-blue-800">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
