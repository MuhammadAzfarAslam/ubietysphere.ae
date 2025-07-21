"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "@/utils/getData";

// Define validation schema using Yup
const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address") // Email validation
    .required("Email is required"), // Required validation
});

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const [myParam, setMyParam] = useState(null);
  const [isOkay, setIsOkay] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const param = searchParams.get("token");
    setMyParam(param); // Update state when the query parameter changes
  }, [searchParams]);

  const onSubmit = async (data) => {
    const { email } = data;
    const res = await postData(
      `forgot-password`,
      { email } // Pass role from props
    );

    if (res.ok) {
      setIsOkay(true);
    } else {
      alert("Invalid credentials");
    }
  };

  if (isOkay) {
    return (
      <div className="text-center text-secondary">
        <p className="text-lg">
          <b>Check your email,</b> We have sent you an email with instructions to reset your password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email Address: {myParam}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:primary text-white"
          {...register("email")}
        />
        <p className="text-red-500 text-sm mb-0">
          {errors.email && errors.email.message} &nbsp;
        </p>
      </div>

      <div>
        <button
          type="submit"
          className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-sm shadow relative overflow-hidden group border-2 border-transparent hover:border-primary transition w-full text-center"
        >
          <span className="relative z-10 group-hover:text-primary">Submit</span>
          <span className="absolute left-0 top-0 w-full h-full bg-secondary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;
