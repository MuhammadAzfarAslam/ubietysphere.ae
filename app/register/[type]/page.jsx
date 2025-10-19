import Register from "@/components/form/Register";
import React from "react";

const RegisterPage = async ({ params, searchParams }) => {
  const { type } = await params;
  const { token } = await searchParams;

  const role =
    type === "provider" ? "Doctor" : type === "seeker" ? "Patient" : "Parent";

  return (
    <div
      className="lg:py-8 relative lg:min-h-[calc(100vh-98px)] bg-cover bg-top flex items-center justify-center"
      style={{
        backgroundImage: "url(https://ubietysphere.ae/assets/images/asclepius.jpeg)",
      }}
    >
      <div className="max-w-7xl w-full mx-auto lg:px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full backdrop-blur-[20px] shadow-lg py-8 lg:px-20 px-4 flex flex-col justify-center inset-0">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">
            Register as {type?.toUpperCase()}
          </h2>
          <Register role={role} token={token} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
