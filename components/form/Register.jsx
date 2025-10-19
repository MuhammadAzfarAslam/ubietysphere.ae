"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "@/utils/getData";
import Link from "next/link";

// Define validation schema using Yup
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  dateOfBirth: yup
    .date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
  gender: yup.string().required("Gender is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  mobileNumber: yup
    .number()
    .typeError("Mobile number must be a number")
    .required("Mobile number is required"),
  // .min(1000000000, "Mobile number must be at least 10 digits")
  // .max(9999999999, "Mobile number cannot be more than 10 digits"),
  password: yup.string().required("Password is required"),
});

const Register = ({ role, token }) => {
  const [isOkay, setIsOkay] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const formattedDate = new Date(data.dateOfBirth)
      .toISOString()
      .split("T")[0];

    // Prepare payload with token if role is Doctor (provider)
    const payload = {
      ...data,
      dateOfBirth: formattedDate,
      role
    };

    // Add token to payload if role is Doctor and token exists
    if (role === "Doctor" && token) {
      payload.token = token;
    }

    const res = await postData(`user/signup`, payload);
    if (res.status === 201) {
      setIsOkay(true);
    } else {
      alert("Something went wrong, please try again!");
    }
  };

  if (isOkay) {
    return (
      <div className="text-center text-primary-light">
        <div className="tick mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="w-40 h-40 border-8 mx-auto rounded-full bi bi-check text-primary"
            viewBox="0 0 16 16"
          >
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
          </svg>
        </div>
        <p className="text-lg">
          You have registered successfully, {role === 'Doctor' ? <>Please <Link href={'/login'} className="font-semibold underline">Login</Link></> : 'Please check your email for verification link.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 register-form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-white"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary placeholder-white text-white"
            {...register("firstName")}
          />
          <p className="text-red-500 text-sm">
            {errors.firstName && errors.firstName.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-white"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-white"
            {...register("lastName")}
          />
          <p className="text-red-500 text-sm">
            {errors.lastName && errors.lastName.message}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-white"
            {...register("email")}
          />
          <p className="text-red-500 text-sm">
            {errors.email && errors.email.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="mobileNumber"
            className="block text-sm font-medium text-white"
          >
            Mobile Number
          </label>
          <input
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            placeholder="Enter mobile number"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-white"
            {...register("mobileNumber")}
          />
          <p className="text-red-500 text-sm">
            {errors.mobileNumber && errors.mobileNumber.message}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-white"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-white"
            {...register("dateOfBirth")}
          />
          <p className="text-red-500 text-sm">
            {errors.dateOfBirth && errors.dateOfBirth.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-white"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary"
            {...register("gender")}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <p className="text-red-500 text-sm">
            {errors.gender && errors.gender.message}
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-white"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-white"
          {...register("password")}
        />
        <p className="text-red-500 text-sm">
          {errors.password && errors.password.message}
        </p>
      </div>

      <div>
        <button
          type="submit"
          className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-sm shadow relative overflow-hidden group border-2 border-transparent hover:border-primary transition w-full text-center"
        >
          <span className="relative z-10 group-hover:text-primary">
            Register
          </span>
          <span className="absolute left-0 top-0 w-full h-full bg-secondary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
        </button>
      </div>
    </form>
  );
};

export default Register;
