"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Define validation schema using Yup
const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address") // Email validation
    .required("Email is required"), // Required validation
  password: yup.string().required("Password is required"), // Password validation
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:primary"
          {...register("email")}
        />
        <p className="text-red-500 text-sm mb-0">
          {errors.email && errors.email.message} &nbsp;
        </p>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:primary"
          {...register("password")}
        />
        <p className="text-red-500 text-sm">
          {errors.password && errors.password.message} &nbsp;
        </p>
      </div>

      <div>
        <button
          type="submit"
          className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-sm shadow relative overflow-hidden group border-2 border-transparent hover:border-primary transition w-full text-center"
        >
          <span className="relative z-10 group-hover:text-primary">Login</span>
          <span className="absolute left-0 top-0 w-full h-full bg-secondary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
        </button>
      </div>
    </form>
  );
};

export default Login;
