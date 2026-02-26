import React, { Suspense } from "react";
import ResetPassword from "@/components/form/ResetPassword";

const ResetPasswordPage = async () => {
  return (
    <div
      className="reset-form lg:py-8 relative min-h-[calc(100vh-98px)] bg-cover bg-top flex items-center justify-center"
      style={{
        backgroundImage: "url(/assets/images/asclepius.jpeg)",
      }}
    >
      <div className="max-w-7xl w-full mx-auto lg:px-4 sm:px-6 lg:px-8 px-4 relative z-10">
        <div className="w-full backdrop-blur-[20px] shadow-lg py-8 lg:px-20 px-4 flex flex-col justify-center inset-0">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">
            Reset Password
          </h2>
          <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
            <ResetPassword />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
