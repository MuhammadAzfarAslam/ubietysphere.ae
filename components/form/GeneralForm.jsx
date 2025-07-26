"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "@/utils/getData";
import FormButton from "../button/FormButton";
import NationalitySelect from "./NationalitySelect";
import CategorySelect from "./CategorySelect";

// Define validation schema using Yup
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  dateOfBirth: yup.date().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobileNumber: yup
    .number()
    .typeError("Must be a number")
    .required("Mobile number is required"),
  address: yup.string(),
  nationality: yup.string().required("Nationality is required"),
  // nationalId: yup.number().typeError("Must be a number"),
  // passportNumber: yup.number().typeError("Must be a number"),
  category: yup.string().required("Category is required"),
});

const GeneralForm = ({ data, accessToken }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      mobileNumber: data?.mobileNumber || "",
      dateOfBirth: data?.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
      gender: data?.gender || "",
      address: data?.details?.address || "",
      nationality: data?.details?.nationality || "",
      nationalId: data?.details?.nationalId || "",
      passportNumber: data?.details?.passportNumber || "",
      category: data?.details?.category || "",
    },
  });

  const onSubmit = async (formData) => {
    const formattedDate = new Date(formData.dateOfBirth)
      .toISOString()
      .split("T")[0];

    const payload = {
      id: data?.id, // original user id
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formattedDate,
      gender: formData.gender,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      role: data?.role, // keep same
      details: {
        id: data?.id, // original details id
        address: formData.address,
        nationality: formData.nationality,
        nationalId: Number(formData.nationalId),
        passportNumber: Number(formData.passportNumber),
        category: formData.category,
      },
    };

    console.log("Update payload:", payload);

    try {
      const response = await postData(`user`, payload, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Update response:", response);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 register-form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-light"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary placeholder-primary-light text-primary-light"
            {...register("firstName")}
          />
          <p className="text-red-500 text-sm">
            {errors.firstName && errors.firstName.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-light"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("lastName")}
          />
          <p className="text-red-500 text-sm">
            {errors.lastName && errors.lastName.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-light"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("email")}
          />
          <p className="text-red-500 text-sm">
            {errors.email && errors.email.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="mobileNumber"
            className="block text-sm font-medium text-light"
          >
            Mobile Number
          </label>
          <input
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            placeholder="Enter mobile number"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("mobileNumber")}
          />
          <p className="text-red-500 text-sm">
            {errors.mobileNumber && errors.mobileNumber.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-light"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("dateOfBirth")}
          />
          <p className="text-red-500 text-sm">
            {errors.dateOfBirth && errors.dateOfBirth.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-light"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
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

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-light"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("address")}
          />
          <p className="text-red-500 text-sm">{errors.address?.message}</p>
        </div>
        <div>
          <label
            htmlFor="nationality"
            className="block text-sm font-medium text-light"
          >
            Nationality
          </label>
          <NationalitySelect
            register={register}
            defaultValue={data?.details?.nationality || ""}
          />
          <p className="text-red-500 text-sm">{errors.nationality?.message}</p>
        </div>

        <div>
          <label
            htmlFor="nationalId"
            className="block text-sm font-medium text-light"
          >
            National ID
          </label>
          <input
            type="text"
            id="nationalId"
            placeholder="National ID"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("nationalId")}
          />
          <p className="text-red-500 text-sm">{errors.nationalId?.message}</p>
        </div>
        <div>
          <label
            htmlFor="passportNumber"
            className="block text-sm font-medium text-light"
          >
            Passport Number
          </label>
          <input
            type="text"
            id="passportNumber"
            placeholder="Passport Number"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("passportNumber")}
          />
          <p className="text-red-500 text-sm">
            {errors.passportNumber?.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-light"
          >
            Category
          </label>
          <CategorySelect
            register={register}
            defaultValue={data?.details?.category || ""}
          />
          <p className="text-red-500 text-sm">{errors.category?.message}</p>
        </div>
      </div>

      <div>
        <FormButton additionalClass={"w-full"}>Update</FormButton>
      </div>
    </form>
  );
};

export default GeneralForm;
