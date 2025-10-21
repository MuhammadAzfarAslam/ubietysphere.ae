import React, { Suspense } from "react";
import VerifyEmail from "@/components/form/VerifyEmail";

const VerifyEmailPage = async () => {
  return (
    <div
      className="reset-form lg:py-8 relative min-h-[calc(100vh-98px)] bg-cover bg-top flex items-center justify-center"
      style={{
        backgroundImage: "url(/assets/images/asclepius.jpeg)",
      }}
    >
      <div className="max-w-7xl w-full mx-auto lg:px-4 sm:px-6 lg:px-8 px-4 relative z-10">
        <div className="w-full backdrop-blur-[20px] shadow-lg py-8 lg:px-20 px-4 flex flex-col justify-center inset-0">
          <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
            <VerifyEmail />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
