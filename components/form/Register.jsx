"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "@/utils/getData";

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

const Register = ({ role }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const formattedDate = new Date(data.dateOfBirth).toISOString().split('T')[0];
    const response = await postData(
      `api/user/signup`,
      { ...data, dateOfBirth: formattedDate, role } // Pass role from props
    );
    console.log("Register response:", response);
  };

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
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-white"
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
